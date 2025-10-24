import whisper
import os

# Load Whisper model once (it's large ~1.4GB)
print("🔄 Loading Whisper model...")
whisper_model = whisper.load_model("base")  # Use "base" for faster processing

def transcribe_audio(audio_path: str) -> str:
    """
    Convert speech to text using OpenAI Whisper
    Why Whisper? It's free, open-source, and very accurate for multiple languages
    """
    try:
        print(f"🎤 Transcribing audio: {audio_path}")
        
        if not os.path.exists(audio_path):
            raise Exception("Audio file not found")
        
        # Transcribe audio using Whisper
        result = whisper_model.transcribe(audio_path)
        transcript = result["text"]
        
        print(f"✅ Transcription completed: {len(transcript)} characters")
        return transcript
        
    except Exception as e:
        raise Exception(f"Transcription failed: {str(e)}")