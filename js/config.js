// VenueLuxe Platform Global Configuration
// Centralized configuration for AI engines, OpenRouter, APIs, and Defaults

window.VENUELUXE_CONFIG = {
  // --- 1. ElevenLabs High-Fidelity Voice Synthesis ---
  // Tier 1 (Primary): Ultra-realistic AI concierge speech (https://elevenlabs.io)
  // Fallback Cascade Rule:
  // 1. ElevenLabs (High fidelity voice)
  // 2. OpenRouter (When ElevenLabs hits quota limit, rate limit, or 429)
  // 3. WebSpeech (When OpenRouter is exhausted - 100% Free local browser fallback)
  ELEVENLABS_API_KEY: localStorage.getItem('elevenlabs_api_key') || '',
  ELEVENLABS_VOICE_ID: 'EXAVITQu4vr4xnSDxMaL', // Bella (Verified working premade concierge voice)
  ELEVENLABS_MODEL_ID: 'eleven_multilingual_v2',

  // Verified working premade voices supported by ElevenLabs API tier
  VERIFIED_VOICE_MODELS: [
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella (Warm Concierge)', desc: 'Soft, gentle & welcoming female voice' },
    { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam (Deep Host)', desc: 'Rich, confident & articulate male voice' },
    { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni (Luxury Narration)', desc: 'Well-rounded, polished male voice' },
    { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice (Elegant British)', desc: 'Articulate, clear & refined female voice' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura (Friendly & Bright)', desc: 'Sunny, pleasant & upbeat female voice' },
    { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George (British Gentleman)', desc: 'Sophisticated, classic English accent' },
    { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica (Conversational)', desc: 'Youthful, energetic & clear female voice' },
    { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Authoritative)', desc: 'Deep, steady & clear news presenter' }
  ],

  // --- 2. OpenRouter AI Service Integration ---
  // Tier 2 Fallback & Primary NLU / Reasoning
  // Get a free key at https://openrouter.ai/keys (zero credit card required)
  OPENROUTER_API_KEY: localStorage.getItem('openrouter_api_key') || '',

  // Default Free Model:
  // 100% Free models curated for event & venue marketplaces:
  // 1. 'nvidia/nemotron-3.5-lightning:free' (Active & lightning speed)
  // 2. 'google/gemma-4-31b-it:free' (Advanced reasoning)
  // 3. 'liquid/lfm-2.5-2.6b:free' (Compact & zero-latency)
  // 4. 'minimax/minimax-m2.7:free' (High precision instruction following)
  // 5. 'meta-llama/llama-3.3-70b-instruct:free'
  DEFAULT_OPENROUTER_MODEL: 'nvidia/nemotron-3.5-lightning:free',

  // --- 3. Active AI Engine Defaults & Cascade Options ---
  DEFAULT_VOICE_ENGINE: 'elevenlabs', // Cascade: 'elevenlabs' -> 'openrouter' -> 'webspeech'
  DEFAULT_NLP_ENGINE: 'openrouter',   // 'openrouter' | 'builtin' | 'gemini' | 'groq' | 'openai'
  DEFAULT_STT_ENGINE: 'elevenlabs_scribe', // 'elevenlabs_scribe' (ElevenLabs Scribe STT) | 'webspeech' | 'whisper'
  DEFAULT_SORT_STRATEGY: 'ai_recommended', // 'ai_recommended' | 'compatibility' | 'value_for_money' | 'rating_desc'

  // Application Settings
  APP_NAME: 'VenueLuxe',
  PRIMARY_REGION: 'Karnataka, India',
  DEFAULT_CITIES: ['Karkala', 'Mangalore', 'Udupi', 'Manipal', 'Bangalore']
};
