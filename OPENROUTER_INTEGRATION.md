# OpenRouter Integration Guide for VenueLuxe

VenueLuxe natively integrates with **OpenRouter**, providing immediate access to top-tier, **100% Free AI models** for natural language venue search, conversational concierge advisory, and multi-factor hall ranking.

---

## 1. Supported 100% Free Models

The platform is pre-configured with curated free models from OpenRouter (zero token fees):

| Model ID | Provider | Strengths | Best Used For |
| :--- | :--- | :--- | :--- |
| `meta-llama/llama-3.3-70b-instruct:free` | Meta | Ultra-fast, high precision | **Default**: Intent parsing & criteria extraction |
| `deepseek/deepseek-r1:free` | DeepSeek | Chain-of-thought reasoning | Complex scheduling, multi-tier budget math |
| `google/gemini-2.0-flash-exp:free` | Google | Extreme throughput, low latency | Rapid conversational replies & summaries |
| `mistralai/mistral-small-24b-instruct-2501:free` | Mistral AI | Compact & instruction-tuned | Quick query normalization |
| `qwen/qwen-2.5-72b-instruct:free` | Alibaba | High benchmark accuracy | Comparative venue matrix ranking |

---

## 2. Configuration Options

You can configure your OpenRouter API key in any of the following 3 ways:

### Method A: Directly in the Codebase (`js/config.js`)
Edit `js/config.js`:
```javascript
window.VENUELUXE_CONFIG = {
  OPENROUTER_API_KEY: 'sk-or-v1-...', // Paste your key here
  DEFAULT_OPENROUTER_MODEL: 'meta-llama/llama-3.3-70b-instruct:free',
  DEFAULT_NLP_ENGINE: 'openrouter',
  ...
};
```

### Method B: In-App UI (AI Settings Modal)
1. Click the **tune icon (`tune`)** in the hero chat controls.
2. Select your desired free model from the dropdown.
3. Paste your OpenRouter key into the **API Key** input.
4. Click **Test Connection** to verify live communication with OpenRouter.
5. Click **Save AI Settings**. (Stored securely in `localStorage`).

### Method C: Browser Console
```javascript
// Set key
window.openrouterService.setApiKey('sk-or-v1-...');

// Test connection
await window.openrouterService.testConnection();
```

---

## 3. Getting a Free Key
1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys).
2. Sign in with Google / GitHub.
3. Create a free key (no credit card or billing details required).
4. Models with `:free` suffix have zero usage cost.

---

## 4. Architecture & Code Structure

- **`js/config.js`**: Central application & AI engine defaults.
- **`js/services/openrouterService.js`**: Core client for OpenRouter API completions:
  - `parseVenuePrompt(userPrompt)`: Extracts venue location, guest capacity, AC requirements, and price budget into structured JSON.
  - `chatWithConcierge(userMessage, context)`: Conversational luxury advisor grounded in live venue registry.
  - `rankListingsWithLLM(halls, query)`: Multi-factor ranking of hall candidates.
  - `testConnection(key, model)`: Instant health check against OpenRouter endpoints.
- **`js/aiConcierge.js`**: Orchestration engine combining Speech-to-Text (STT), OpenRouter NLU, and fallback rule heuristics.
- **`js/views/landing.js`**: Interactive hero AI chat with command palette, live thinking indicator, OpenRouter assessment bubble, and ranked hall cards.

---

## 5. Multi-Tier AI Voice Cascade Fallback

VenueLuxe implements a 3-tier resilience cascade for voice synthesis and AI audio interaction:

```
┌────────────────────────────────────────────────────────┐
│  Tier 1: ElevenLabs Ultra-Realistic AI Voice           │
│  (Custom voice model / studio quality audio)          │
└──────────────────────────┬─────────────────────────────┘
                           │ (on 429 rate limit or quota exceeded)
                           ▼
┌────────────────────────────────────────────────────────┐
│  Tier 2: OpenRouter Tier                              │
│  (Cloud intelligence fallback & speech synthesis)      │
└──────────────────────────┬─────────────────────────────┘
                           │ (when OpenRouter key/quota exhausted)
                           ▼
┌────────────────────────────────────────────────────────┐
│  Tier 3: Browser WebSpeech API                         │
│  (100% Free, local, unlimited browser fallback)       │
└────────────────────────────────────────────────────────┘
```

- **Automatic Fail-Over**: If ElevenLabs returns `429 Too Many Requests` or quota depleted, the service logs the incident and immediately cascades down to OpenRouter. If OpenRouter is depleted, it instantly falls back to WebSpeech with zero interrupted audio.
- **Visual Tier Badge**: The current active tier (`ELEVENLABS`, `OPENROUTER`, or `WEBSPEECH`) is displayed live in the AI Settings Modal with a 1-click "Reset Cascade" button.

---

## 6. Fail-Safe Guarantee
If no API key is supplied or all cloud rate limits are reached, VenueLuxe automatically and silently falls back to its built-in client-side NLP engine and browser WebSpeech. The user interface remains responsive and fully operational at all times.
