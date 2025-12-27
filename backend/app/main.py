from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import Optional
from fastapi import Header
import os
from dotenv import load_dotenv
# Custom imports
from app.models import ChatMessage, ChatResponse, Task, SignupRequest, LoginRequest
from app.services import (
    generate_ai_response, 
    generate_task_suggestions,
    get_weather_data,
    get_news_data,
    get_all_tasks_from_db,
    create_task_in_db,
    update_task_in_db,
    delete_task_from_db,
    signup_user,
    login_user,
    get_user_from_token
)

load_dotenv()
app = FastAPI(title="MindSync API", description="AI-powered productivity assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/signup")
async def signup(request: SignupRequest):
    """Sign up a new user"""
    try:
        result = signup_user(request.email, request.password)
        return {
            "message": "Signup successful! Please check your email to verify your account.",
            "user": result["user"],
            "access_token": result["access_token"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """Log in an existing user"""
    try:
        result = login_user(request.email, request.password)
        return {
            "message": "Login successful",
            "user": result["user"],
            "access_token": result["access_token"]
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
@app.get("/api/auth/me")
async def get_current_user(authorization: Optional[str] = Header(None)):
    """Get current user from token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user = get_user_from_token(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return {"user": user}

# Helper function to get user ID from token
def get_user_id_from_header(authorization: Optional[str]) -> str:
    """Extract user ID from authorization header"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    user = get_user_from_token(token)
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user["id"]

@app.get("/")
def read_root():
    return {"message": "MindSync API", "status": "running"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    try:
        response = generate_ai_response(chat_message.message, chat_message.conversation_history)
        return ChatResponse(response=response, timestamp=datetime.now().isoformat())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/tasks")
async def get_tasks(authorization: Optional[str] = Header(None)):
    """Get all tasks for authenticated user"""
    user_id = get_user_id_from_header(authorization)
    tasks = get_all_tasks_from_db(user_id)  # Filter by user_id
    return {"tasks": tasks}

@app.post("/api/tasks")
async def create_task(task: Task, authorization: Optional[str] = Header(None)):
    """Create a new task"""
    user_id = get_user_id_from_header(authorization)
    task_data = {
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "priority": task.priority,
        "user_id": user_id  # Now we have a real user ID!
    }
    created_task = create_task_in_db(task_data)
    return {"message": "Task created", "task": created_task}

@app.put("/api/tasks/{task_id}")
async def update_task(task_id: str, task: Task, authorization: Optional[str] = Header(None)):
    """Update an existing task"""
    user_id = get_user_id_from_header(authorization)
    task_data = {
        "title": task.title,
        "description": task.description,
        "completed": task.completed,
        "priority": task.priority
    }
    updated_task = update_task_in_db(task_id, task_data)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task updated", "task": updated_task}

@app.delete("/api/tasks/{task_id}")
async def delete_task(task_id: str, authorization: Optional[str] = Header(None)):
    """Delete a task"""
    user_id = get_user_id_from_header(authorization)
    success = delete_task_from_db(task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted"}

@app.post("/api/tasks/suggest")
async def suggest_task(task: Task):
    try:
        suggestions = generate_task_suggestions(task.title, task.description)
        return {"suggestions": suggestions, "task": task}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/api/weather/{city}")
async def get_weather(city: str):
    try:
        return get_weather_data(city)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/api/news")
async def get_news(category: str = "technology", limit: int = 5):
    try:
        articles = get_news_data(category, limit)
        return {"articles": articles}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)