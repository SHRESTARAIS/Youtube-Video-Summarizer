from transformers import pipeline

# Load summarization model
print("🔄 Loading summarization model...")
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def summarize_text(text: str) -> str:
    """
    Summarize text using Hugging Face BART model
    Why BART? It's good for abstractive summarization and free to use
    """
    try:
        print(f"📝 Summarizing text (length: {len(text)})")
        
        # If text is too long, split it (Whisper limit is 512 tokens)
        if len(text) > 1000:
            text = text[:1000] + "..."
        
        # Generate summary
        summary = summarizer(text, max_length=150, min_length=30, do_sample=False)
        
        print("✅ Summary generated")
        return summary[0]['summary_text']
        
    except Exception as e:
        raise Exception(f"Summarization failed: {str(e)}")