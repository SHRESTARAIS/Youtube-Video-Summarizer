from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import uvicorn
from typing import List

from auth import create_access_token, verify_token, get_password_hash, verify_password
from database import get_db, User, SummaryHistory
from services.youtube_downloader import download_audio
from services.speech_to_text import transcribe_audio
from services.summarizer import summarize_text
from services.translator import translate_text, LANGUAGE_MODELS

app = FastAPI(
    title="YouTube Video Summarizer API",
    description="AI-powered multilingual YouTube video summarization",
    version="2.0.0"
)

# CORS middleware for React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class SummaryRequest(BaseModel):
    video_url: str
    language: str = "english"

class SummaryResponse(BaseModel):
    success: bool
    summary: str
    language: str
    transcript_length: int
    summary_length: int
    message: str

# Dependency to get current user from token
def get_current_user(token: str, db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.email == payload.get("email")).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Authentication endpoints
@app.post("/register")
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {"message": "User created successfully", "user_id": user.id}

@app.post("/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"email": user.email, "username": user.username})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }

# Main application endpoints
@app.get("/")
def home():
    return {
        "message": "🚀 YouTube Summarizer API is running!",
        "status": "active",
        "version": "2.0.0"
    }

@app.get("/languages")
def get_supported_languages():
    """Return list of supported languages"""
    languages = list(LANGUAGE_MODELS.keys())
    languages.insert(0, 'english')  # Add English as first option
    return {"languages": languages}

@app.post("/summarize")
async def summarize_video(
    request: SummaryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        print("🚀 Starting video processing...")

        # Step 1: Download audio from YouTube
        print("📥 Downloading audio from YouTube...")
        audio_path = download_audio(request.video_url)

        # Step 2: Convert speech to text
        print("🎤 Converting speech to text...")
        transcript = transcribe_audio(audio_path)

        # Step 3: Summarize text
        print("📝 Generating AI summary...")
        english_summary = summarize_text(transcript)

        # Step 4: Translate if needed
        print("🌐 Translating to target language...")
        final_summary = translate_text(english_summary, request.language)

        # Save to history
        history = SummaryHistory(
            user_id=current_user.id,
            video_url=request.video_url,
            original_title="YouTube Video",  # You can extract this from YouTube
            summary=final_summary,
            language=request.language
        )
        db.add(history)
        db.commit()

        return {
            "success": True,
            "summary": final_summary,
            "language": request.language,
            "transcript_length": len(transcript),
            "summary_length": len(final_summary),
            "message": "✅ Summary generated successfully!"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Processing failed: {str(e)}"
        )

@app.get("/history")
def get_summary_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's summary history"""
    history = db.query(SummaryHistory).filter(
        SummaryHistory.user_id == current_user.id
    ).order_by(SummaryHistory.created_at.desc()).all()
    
    return {"history": history}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")