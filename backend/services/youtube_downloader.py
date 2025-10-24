import yt_dlp
import os
import time

def download_audio(video_url: str) -> str:
    """
    Download audio from YouTube video using yt-dlp
    Why yt-dlp? It's more reliable than pytube and handles various YouTube formats better
    """
    try:
        print(f"🎬 Processing YouTube URL: {video_url}")
        
        # Create downloads directory
        os.makedirs("downloads", exist_ok=True)
        
        # Configure yt-dlp options
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': 'downloads/audio_%(id)s_%(timestamp)s',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            audio_filename = ydl.prepare_filename(info)
            audio_path = audio_filename.replace('.webm', '.mp3').replace('.m4a', '.mp3')
            
        print(f"✅ Audio downloaded: {audio_path}")
        return audio_path
        
    except Exception as e:
        raise Exception(f"YouTube download failed: {str(e)}")