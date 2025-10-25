import yt_dlp
import os
import time

def download_audio(video_url: str) -> str:
    """
    Download audio from YouTube video - Production Ready
    """
    try:
        print(f"📥 Processing: {video_url}")
        
        # Create downloads directory
        os.makedirs("downloads", exist_ok=True)
        
        # Configure yt-dlp for optimal performance
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': 'downloads/%(id)s_%(title)s.%(ext)s',
            'quiet': False,
            'no_warnings': False,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            audio_path = ydl.prepare_filename(info)
            
        print(f"✅ Download completed: {audio_path}")
        return audio_path
        
    except Exception as e:
        raise Exception(f"Video processing error: {str(e)}")