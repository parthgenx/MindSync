from pydantic import BaseModel, EmailStr
from typing import List, Optional

class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    
class Task(BaseModel):
    id: Optional[str] = None  # Changed from int to str for Supabase UUID
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: Optional[str] = "medium"
    
    class Config:
        extra = "ignore"  # Ignore extra fields from database like created_at, user_id, etc.

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    
class LoginRequest(BaseModel):
    email: EmailStr
    password: str    