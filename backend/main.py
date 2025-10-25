import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import time
from auth import create_access_token, verify_password, get_password_hash
from database import get_user_by_email, create_user

app = FastAPI(
    title="YouTube Video Summarizer",
    description="AI-powered YouTube video summarization in multiple languages",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummaryRequest(BaseModel):
    video_url: str
    language: str = "english"

class UserRegister(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# YouTube download function
def download_youtube_video(video_url: str):
    try:
        from pytubefix import YouTube
        print(f"📥 Downloading: {video_url}")
        
        yt = YouTube(video_url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        
        if not audio_stream:
            return {"success": False, "error": "No audio stream found"}
        
        os.makedirs("downloads", exist_ok=True)
        
        timestamp = int(time.time())
        filename = f"audio_{timestamp}"
        output_path = audio_stream.download(
            output_path="downloads",
            filename=filename
        )
        
        return {
            "success": True, 
            "file_path": output_path,
            "video_title": yt.title,
            "duration": yt.length
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.get("/")
def home():
    return {"message": "🚀 YouTube Summarizer API is running!"}

@app.get("/test")
def test():
    return {"message": "✅ API is working perfectly!"}

@app.get("/languages")
def get_languages():
    return {
        "languages": [
            "english", "hindi", "bengali", "telugu", "tamil", 
            "gujarati", "kannada", "malayalam", "punjabi", "urdu"
        ]
    }

@app.post("/summarize")
async def summarize_video(request: SummaryRequest):
    try:
        print(f"🎬 Processing: {request.video_url} in {request.language}")
        
        download_result = download_youtube_video(request.video_url)
        
        if not download_result["success"]:
            raise HTTPException(status_code=400, detail=download_result["error"])
        
        demo_summary = f"""
        🎯 **AI Summary** - {download_result['video_title']}
        
        🌐 **Language**: {request.language}
        ⏱️ **Duration**: {download_result['duration']} seconds
        
        This is a demo summary. In production, AI would generate real summaries.
        """
        
        return {
            "success": True,
            "summary": demo_summary,
            "language": request.language,
            "video_title": download_result["video_title"],
            "duration": download_result["duration"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

# Authentication endpoints
@app.post("/api/register")
async def register(user_data: UserRegister):
    try:
        # Check if user exists
        existing_user = get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        create_user(user_data.username, user_data.email, get_password_hash(user_data.password))
        return {"message": "User created successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/login")
async def login(user_data: UserLogin):
    try:
        user = get_user_by_email(user_data.email)
        if not user or not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        # Create token
        access_token = create_access_token(data={"sub": user.email})
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "username": user.username
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting YouTube Summarizer API...")
    print("📍 http://localhost:8000")
    print("📚 http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)