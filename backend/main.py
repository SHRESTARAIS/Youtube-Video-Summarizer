import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import time
from auth import create_access_token, verify_password, get_password_hash
from database import get_user_by_email, create_user

# Import your services
from services.youtube_downloader import download_audio
from services.speech_to_text import transcribe_audio
from services.summarizer import summarize_text
from services.translator import translate_text

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

# Enhanced language support
SUPPORTED_LANGUAGES = {
    # Indian Languages
    "hindi": "Hindi", "bengali": "Bengali", "telugu": "Telugu", "tamil": "Tamil",
    "gujarati": "Gujarati", "kannada": "Kannada", "malayalam": "Malayalam", 
    "punjabi": "Punjabi", "urdu": "Urdu", "marathi": "Marathi", "odia": "Odia",
    
    # Asian Languages
    "chinese": "Chinese", "japanese": "Japanese", "korean": "Korean",
    "vietnamese": "Vietnamese", "thai": "Thai", "indonesian": "Indonesian",
    
    # European Languages
    "english": "English", "spanish": "Spanish", "french": "French", 
    "german": "German", "italian": "Italian", "portuguese": "Portuguese",
    "russian": "Russian", "dutch": "Dutch", "polish": "Polish",
    
    # Middle Eastern
    "arabic": "Arabic", "turkish": "Turkish", "hebrew": "Hebrew",
    
    # Others
    "filipino": "Filipino", "swahili": "Swahili"
}

@app.get("/")
def home():
    return {"message": "🚀 YouTube Summarizer API is running!"}

@app.get("/api/test")
def test():
    return {"message": "✅ API is working perfectly!"}

@app.get("/api/languages")
def get_languages():
    return {"languages": list(SUPPORTED_LANGUAGES.keys())}

@app.post("/api/summarize")
async def summarize_video(request: SummaryRequest):
    try:
        print(f"🎬 Processing: {request.video_url} in {request.language}")
        
        # Validate language
        if request.language not in SUPPORTED_LANGUAGES:
            raise HTTPException(status_code=400, detail="Language not supported")
        
        # Step 1: Download YouTube audio
        print("📥 Downloading audio...")
        from services.youtube_downloader import download_audio
        audio_path = download_audio(request.video_url)
        
        # Step 2: Get video info for demo
        import yt_dlp
        ydl_opts = {'quiet': True}
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(request.video_url, download=False)
            video_title = info.get('title', 'Unknown Title')
            duration = info.get('duration', 0)
        
        # Step 3: Generate meaningful demo summary
        from services.summarizer import summarize_text
        from services.translator import translate_text
        
        demo_transcript = f"""
        This video titled '{video_title}' has a duration of {duration} seconds.
        The content appears to be about technology and AI based on the metadata.
        In a production environment, this would be real transcribed audio content
        from the YouTube video, processed through speech recognition and AI summarization.
        """
        
        # Step 4: Generate summary
        print("📝 Generating summary...")
        english_summary = summarize_text(demo_transcript)
        
        # Step 5: Translate if needed
        final_summary = english_summary
        if request.language != "english":
            print(f"🌐 Translating to {request.language}...")
            final_summary = translate_text(english_summary, request.language)
        
        # Clean up audio file
        try:
            import os
            if os.path.exists(audio_path):
                os.remove(audio_path)
        except:
            pass
        
        return {
            "success": True,
            "summary": final_summary,
            "language": request.language,
            "video_title": video_title,
            "duration": duration,
            "note": "This is a demo. Add AI APIs for real summaries."
        }
        
    except Exception as e:
        # Clean up on error
        try:
            if 'audio_path' in locals() and audio_path and os.path.exists(audio_path):
                os.remove(audio_path)
        except:
            pass
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
@app.post("/api/register")
async def register(user_data: UserRegister):
    try:
        existing_user = get_user_by_email(user_data.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
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
        
        access_token = create_access_token(data={"sub": user.email})
        return {
            "access_token": access_token, 
            "token_type": "bearer",
            "username": user.username
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
async def get_history():
    return {
        "history": [
            {
                "id": 1,
                "title": "Sample Video",
                "url": "https://youtube.com/watch?v=demo",
                "summary": "This is a sample summary",
                "date": "2024-01-01",
                "language": "english"
            }
        ]
    }

if __name__ == "__main__":
    print("🚀 Starting YouTube Summarizer API...")
    print("📍 http://localhost:8000")
    print("📚 http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)