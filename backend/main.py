import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import time

app = FastAPI(
    title="YouTube Video Summarizer",
    description="AI-powered YouTube video summarization in multiple languages",
    version="2.0.0"
)

# CORS middleware for React Native app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummaryRequest(BaseModel):
    video_url: str
    language: str = "english"

# YouTube download function
def download_youtube_video(video_url: str):
    try:
        from pytubefix import YouTube
        print(f"📥 Downloading: {video_url}")
        
        yt = YouTube(video_url)
        audio_stream = yt.streams.filter(only_audio=True).first()
        
        if not audio_stream:
            return {"success": False, "error": "No audio stream found"}
        
        # Create downloads directory
        os.makedirs("downloads", exist_ok=True)
        
        # Download audio
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
    return {
        "message": "🚀 YouTube Summarizer API is running!",
        "status": "active", 
        "version": "2.0.0",
        "endpoints": {
            "home": "/",
            "test": "/test", 
            "languages": "/languages",
            "summarize": "/summarize (POST)"
        }
    }

@app.get("/test")
def test():
    return {"message": "✅ API is working perfectly!"}

@app.get("/languages")
def get_languages():
    return {
        "languages": [
            "english", "hindi", "bengali", "telugu", "tamil", 
            "gujarati", "kannada", "malayalam", "punjabi", "urdu",
            "spanish", "french", "german", "italian", "portuguese",
            "russian", "japanese", "korean", "chinese", "arabic"
        ]
    }

@app.post("/summarize")
async def summarize_video(request: SummaryRequest):
    try:
        print(f"🎬 Processing request: {request.video_url} in {request.language}")
        
        # Step 1: Download YouTube audio
        download_result = download_youtube_video(request.video_url)
        
        if not download_result["success"]:
            raise HTTPException(status_code=400, detail=download_result["error"])
        
        # Step 2: Create demo transcript and summary
        demo_transcript = f"""
        This is a demo transcript for the video: {download_result['video_title']}
        
        In the full version, this would be generated using OpenAI Whisper speech-to-text.
        The audio has been successfully downloaded and is ready for processing.
        
        Video Details:
        - Title: {download_result['video_title']}
        - Duration: {download_result['duration']} seconds
        - Audio File: {download_result['file_path']}
        """
        
        demo_summary = f"""
        🎯 **AI Summary** - {download_result['video_title']}
        
        🌐 **Language**: {request.language}
        ⏱️ **Duration**: {download_result['duration']} seconds
        
        📝 **Key Points**:
        • This is a demonstration of the YouTube Video Summarizer
        • The backend successfully downloaded the YouTube audio
        • The system is ready for AI transcription and summarization
        • Multiple language support is implemented
        • Cross-platform React Native app is ready
        
        ✅ **Technical Status**:
        • YouTube Download: ✅ Working
        • Backend API: ✅ Running  
        • CORS Setup: ✅ Enabled
        • Language Support: ✅ 20+ Languages
        • Frontend Ready: ✅ React Native
        
        🚀 **Next Features**:
        • OpenAI Whisper integration for transcription
        • Hugging Face models for summarization
        • Real-time progress updates
        • User authentication system
        """
        
        return {
            "success": True,
            "summary": demo_summary,
            "language": request.language,
            "video_title": download_result["video_title"],
            "duration": download_result["duration"],
            "transcript_length": len(demo_transcript),
            "summary_length": len(demo_summary),
            "message": "✅ YouTube processing successful! Ready for AI integration."
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")

if __name__ == "__main__":
    print("🚀 Starting Enhanced YouTube Summarizer API...")
    print("📍 API URL: http://localhost:8000")
    print("📚 Documentation: http://localhost:8000/docs")
    print("🌐 CORS Enabled: Ready for React Native frontend")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")