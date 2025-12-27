import os
import google.generativeai as genai
import requests
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

# Validate required environment variables
required_env_vars = ["SUPABASE_URL", "SUPABASE_KEY", "GEMINI_API_KEY"]
missing_vars = [var for var in required_env_vars if not os.getenv(var)]
if missing_vars:
    raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Regular Supabase client (for normal operations)
supabase = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Admin Supabase client (for auto-confirming users)
# Only create if service role key is available
supabase_admin = None
if os.getenv("SUPABASE_SERVICE_ROLE_KEY"):
    supabase_admin = create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    )

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-3-flash-preview')

def generate_ai_response(message: str, history: list) -> str:
    try:
        print(f"[DEBUG] Generating AI response for: {message}")
        context = "You are a helpful personal assistant.\n\n"
        if history:
            for msg in history[-5:]:
                context += f"{msg.get('role')}: {msg.get('content')}\n"
        context += f"user: {message}\nassistant:"
        print(f"[DEBUG] Context: {context[:100]}...")
        response = model.generate_content(context)
        print(f"[DEBUG] Response received: {response.text[:100]}...")
        return response.text
    except Exception as e:
        print(f"[ERROR] AI generation failed: {str(e)}")
        import traceback
        traceback.print_exc()
        raise

def generate_task_suggestions(title: str, description: str = None) -> str:
    prompt = f"Task: {title}\nDescription: {description or 'None'}\n\nProvide 3 brief suggestions."
    response = model.generate_content(prompt)
    return response.text

def get_weather_data(city: str) -> dict:
    api_key = os.getenv("WEATHER_API_KEY")
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {
            "city": data["name"],
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],  # Added
            "description": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"],  # Added
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"]  # Added
        }
    raise Exception("City not found")

def get_news_data(category: str = "technology", limit: int = 5) -> list:
    api_key = os.getenv("NEWS_API_KEY")
    url = f"https://newsapi.org/v2/top-headlines?category={category}&pageSize={limit}&apiKey={api_key}"
    response = requests.get(url)
    if response.status_code == 200:
        articles = []
        for article in response.json().get("articles", []):
            articles.append({
                "title": article.get("title"),
                "description": article.get("description"),
                "url": article.get("url")
            })
        return articles
    raise Exception("Failed to fetch news")


# Task functions using Supabase
def get_all_tasks_from_db(user_id=None):
    """Get all tasks from Supabase, optionally filtered by user_id"""
    if user_id:
        response = supabase.table('tasks').select('*').eq('user_id', user_id).execute()
    else:
        response = supabase.table('tasks').select('*').execute()
    return response.data

def create_task_in_db(task_data):
    """Create task in Supabase"""
    response = supabase.table('tasks').insert(task_data).execute()
    return response.data[0] if response.data else None

def update_task_in_db(task_id, task_data):
    """Update task in Supabase"""
    response = supabase.table('tasks').update(task_data).eq('id', task_id).execute()
    return response.data[0] if response.data else None

def delete_task_from_db(task_id):
    """Delete task from Supabase"""
    response = supabase.table('tasks').delete().eq('id', task_id).execute()
    return len(response.data) > 0

def signup_user(email: str, password: str):
    """Sign up a new user with auto-confirmation for development"""
    try:
        # Sign up the user
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "email_redirect_to": None,
                "data": {}
            }
        })
        
        if response.user:
            user_id = response.user.id
            
            # Auto-confirm the user if admin client is available
            if supabase_admin and not response.session:
                try:
                    # Use admin client to update user confirmation
                    supabase_admin.auth.admin.update_user_by_id(
                        user_id,
                        {"email_confirm": True}
                    )
                    
                    # Now try to sign in to get a session
                    login_response = supabase.auth.sign_in_with_password({
                        "email": email,
                        "password": password
                    })
                    
                    if login_response.session:
                        return {
                            "user": {
                                "id": login_response.user.id,
                                "email": login_response.user.email,
                                "email_confirmed": True
                            },
                            "access_token": login_response.session.access_token,
                            "message": "Account created and verified successfully!"
                        }
                except Exception as confirm_error:
                    print(f"Auto-confirm failed: {confirm_error}")
                    # Continue with normal flow if auto-confirm fails
            
            return {
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "email_confirmed": response.user.email_confirmed_at is not None
                },
                "access_token": response.session.access_token if response.session else None,
                "message": "Please check your email to verify your account." if not response.session else "Account created successfully!"
            }
        else:
            raise Exception("Signup failed")
    except Exception as e:
        # Provide more detailed error messages
        error_msg = str(e)
        if "already registered" in error_msg.lower():
            raise Exception("This email is already registered. Please login instead.")
        raise Exception(f"Signup error: {error_msg}")
    
def login_user(email: str, password: str):
    """Log in an existing user"""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        if response.user:
            return {
                "user": {
                    "id": response.user.id,
                    "email": response.user.email
                },
                "access_token": response.session.access_token
            }
        else:
            raise Exception("Login failed")
    except Exception as e:
        error_msg = str(e)
        # Provide specific error messages
        if "email not confirmed" in error_msg.lower() or "email_not_confirmed" in error_msg.lower():
            raise Exception("Please verify your email before logging in. Check your inbox for the verification link.")
        elif "invalid" in error_msg.lower() or "credentials" in error_msg.lower():
            raise Exception("Invalid email or password. Please check your credentials and try again.")
        elif "user not found" in error_msg.lower():
            raise Exception("No account found with this email. Please sign up first.")
        raise Exception(f"Login error: {error_msg}")
    
def get_user_from_token(token: str):
    """Get user from JWT token"""
    try:
        response = supabase.auth.get_user(token)
        if response.user:
            return {
                "id": response.user.id,
                "email": response.user.email
            }
        return None
    except:
        return None