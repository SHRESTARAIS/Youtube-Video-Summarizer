from transformers import MarianMTModel, MarianTokenizer

# Language support - 20+ languages
LANGUAGE_MODELS = {
    # Indian Languages
    'hindi': 'Helsinki-NLP/opus-mt-en-hi',
    'bengali': 'Helsinki-NLP/opus-mt-en-bn',
    'telugu': 'Helsinki-NLP/opus-mt-en-te',
    'tamil': 'Helsinki-NLP/opus-mt-en-ta',
    'gujarati': 'Helsinki-NLP/opus-mt-en-gu',
    'kannada': 'Helsinki-NLP/opus-mt-en-kn',
    'malayalam': 'Helsinki-NLP/opus-mt-en-ml',
    'punjabi': 'Helsinki-NLP/opus-mt-en-pa',
    'urdu': 'Helsinki-NLP/opus-mt-en-ur',
    
    # European Languages
    'spanish': 'Helsinki-NLP/opus-mt-en-es',
    'french': 'Helsinki-NLP/opus-mt-en-fr',
    'german': 'Helsinki-NLP/opus-mt-en-de',
    'italian': 'Helsinki-NLP/opus-mt-en-it',
    'portuguese': 'Helsinki-NLP/opus-mt-en-pt',
    'russian': 'Helsinki-NLP/opus-mt-en-ru',
    
    # Asian Languages
    'japanese': 'Helsinki-NLP/opus-mt-en-ja',
    'korean': 'Helsinki-NLP/opus-mt-en-ko',
    'chinese': 'Helsinki-NLP/opus-mt-en-zh',
    'arabic': 'Helsinki-NLP/opus-mt-en-ar',
}

# Cache for loaded models
translation_models = {}
translation_tokenizers = {}

def translate_text(text: str, target_language: str) -> str:
    """
    Translate text using MarianMT models
    Why MarianMT? It's free, open-source, and supports many languages
    """
    try:
        # Return original if English or language not supported
        if target_language == 'english' or target_language not in LANGUAGE_MODELS:
            return text
        
        model_name = LANGUAGE_MODELS[target_language]
        
        # Load model and tokenizer if not already loaded
        if target_language not in translation_models:
            print(f"🔄 Loading translation model for {target_language}...")
            translation_models[target_language] = MarianMTModel.from_pretrained(model_name)
            translation_tokenizers[target_language] = MarianTokenizer.from_pretrained(model_name)
            print(f"✅ {target_language} translation model loaded!")
        
        tokenizer = translation_tokenizers[target_language]
        model = translation_models[target_language]
        
        # Tokenize and translate
        tokens = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
        translated_tokens = model.generate(**tokens)
        translated_text = tokenizer.decode(translated_tokens[0], skip_special_tokens=True)
        
        print(f"🌐 Translated to {target_language}: {len(translated_text)} chars")
        return translated_text
        
    except Exception as e:
        print(f"❌ Translation failed for {target_language}: {e}")
        return text  # Return original text if translation fails