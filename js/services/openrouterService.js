// OpenRouter AI Service for VenueLuxe Platform
// Unified integration for 100% Free models (Llama 3.3 70B, DeepSeek R1, Gemini 2.0 Flash)

class OpenRouterService {
  constructor() {
    this.endpoint = 'https://openrouter.ai/api/v1/chat/completions';
    this.defaultModel = 'nvidia/nemotron-3.5-lightning:free';
    
    // Curated catalog of 100% Free OpenRouter models
    this.freeModels = [
      {
        id: 'nvidia/nemotron-3.5-lightning:free',
        name: 'NVIDIA Nemotron 3.5 Lightning',
        desc: 'Top active recommendation: ultra-fast, high precision entity extraction and reasoning.',
        speed: 'Ultra Fast',
        isDefault: true
      },
      {
        id: 'liquid/lfm-2.5-2.6b:free',
        name: 'Liquid LFM 2.5',
        desc: 'High speed, zero-latency instruction following model.',
        speed: 'Ultra Fast',
        isDefault: false
      },
      {
        id: 'google/gemma-4-31b-it:free',
        name: 'Google Gemma 4 31B',
        desc: 'Advanced instruction-tuned reasoning model by Google.',
        speed: 'Fast',
        isDefault: false
      },
      {
        id: 'minimax/minimax-m2.7:free',
        name: 'MiniMax M2.7',
        desc: 'High benchmark performance for complex tabular criteria and budget math.',
        speed: 'Fast',
        isDefault: false
      },
      {
        id: 'meta-llama/llama-3.3-70b-instruct:free',
        name: 'Meta Llama 3.3 70B',
        desc: 'Meta benchmark model.',
        speed: 'Fast',
        isDefault: false
      }
    ];
  }

  // --- API Key Management ---
  getApiKey() {
    // 1. Check window.VENUELUXE_CONFIG (codebase configuration in js/config.js)
    if (window.VENUELUXE_CONFIG && window.VENUELUXE_CONFIG.OPENROUTER_API_KEY) {
      const key = window.VENUELUXE_CONFIG.OPENROUTER_API_KEY.trim();
      if (key) return key;
    }

    // 2. Check dedicated openrouter key in localStorage
    const directKey = localStorage.getItem('openrouter_api_key');
    if (directKey) return directKey.trim();

    // 3. Fallback to general AI config
    try {
      const cfg = JSON.parse(localStorage.getItem('venueluxe_ai_config') || '{}');
      if (cfg.apiKey) return cfg.apiKey.trim();
    } catch (e) {}

    // 4. Optional global constant
    if (window.OPENROUTER_API_KEY) return window.OPENROUTER_API_KEY.trim();

    return '';
  }

  setApiKey(key) {
    if (key) {
      localStorage.setItem('openrouter_api_key', key.trim());
      // Also update general config
      try {
        const cfg = JSON.parse(localStorage.getItem('venueluxe_ai_config') || '{}');
        cfg.apiKey = key.trim();
        cfg.nlpEngine = 'openrouter';
        localStorage.setItem('venueluxe_ai_config', JSON.stringify(cfg));
      } catch (e) {}
    } else {
      localStorage.removeItem('openrouter_api_key');
    }
  }

  hasApiKey() {
    return !!this.getApiKey();
  }

  getActiveModel() {
    try {
      const cfg = JSON.parse(localStorage.getItem('venueluxe_ai_config') || '{}');
      if (cfg.openrouterModel) return cfg.openrouterModel;
    } catch (e) {}

    if (window.VENUELUXE_CONFIG && window.VENUELUXE_CONFIG.DEFAULT_OPENROUTER_MODEL) {
      return window.VENUELUXE_CONFIG.DEFAULT_OPENROUTER_MODEL;
    }

    return this.defaultModel;
  }

  setActiveModel(modelId) {
    try {
      const cfg = JSON.parse(localStorage.getItem('venueluxe_ai_config') || '{}');
      cfg.openrouterModel = modelId;
      localStorage.setItem('venueluxe_ai_config', JSON.stringify(cfg));
    } catch (e) {}
  }

  // --- Test API Key & Model Health ---
  async testConnection(testKey = null, model = null) {
    const key = testKey || this.getApiKey();
    if (!key) {
      return { success: false, message: 'No OpenRouter API key provided.' };
    }
    const targetModel = model || this.getActiveModel();

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': window.location.origin || 'http://localhost:8080',
          'X-Title': 'VenueLuxe Marketplace Platform'
        },
        body: JSON.stringify({
          model: targetModel,
          messages: [{ role: 'user', content: 'Respond with the word "CONNECTED"' }],
          max_tokens: 10
        })
      });

      if (!response.ok) {
        const err = await response.text();
        return { success: false, status: response.status, message: err };
      }

      const data = await response.json();
      return {
        success: true,
        model: data.model || targetModel,
        reply: data.choices?.[0]?.message?.content || 'OK'
      };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  // --- Core Fetch Wrapper ---
  async callChatCompletion(messages, options = {}) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenRouter API key is missing. Configure your free key in AI Settings or call openrouterService.setApiKey(key).');
    }

    const model = options.model || this.getActiveModel();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin || 'http://localhost:8080',
      'X-Title': 'VenueLuxe Marketplace Platform'
    };

    const payload = {
      model,
      messages,
      temperature: options.temperature !== undefined ? options.temperature : 0.2,
      max_tokens: options.max_tokens || 800
    };

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsedMsg = errorText;
      try {
        const jsonErr = JSON.parse(errorText);
        parsedMsg = jsonErr.error?.message || errorText;
      } catch (e) {}
      throw new Error(`OpenRouter API error (${response.status}): ${parsedMsg}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Malformed response from OpenRouter API.');
    }

    return {
      content: data.choices[0].message.content,
      model: data.model || model,
      usage: data.usage || null
    };
  }

  // --- 1. Natural Language Requirements Extraction ---
  async parseVenuePrompt(userPrompt) {
    const systemPrompt = `
You are an expert AI wedding & banquet venue concierge in Karnataka, India (Karkala, Mangalore, Udupi, Manipal, Bangalore).
Analyze the user's natural language event query and extract the criteria into strict JSON format.

JSON schema:
{
  "city": string or null (e.g. "Karkala", "Mangalore", "Udupi", "Manipal", "Bangalore"),
  "eventType": string or null (e.g. "Wedding & Reception", "Reception Banquet", "Birthday & Anniversary", "Corporate Conference", "Cultural Space"),
  "capacityMin": number or null (minimum guest count),
  "capacityMax": number or null (maximum guest count),
  "maxPrice": number or null (budget ceiling in Indian Rupees),
  "acType": "Central AC" | "Non-AC" | null,
  "indoorOutdoor": "Indoor" | "Outdoor" | null,
  "shift": "Morning" | "Afternoon" | "Evening" | "Night" | "Full Day" | null,
  "facilities": string[] (e.g. ["Parking", "Dining", "Stage", "Generator"]),
  "tags": string[],
  "summary": string (brief 1-sentence friendly confirmation)
}

CRITICAL: Return ONLY valid parseable JSON. Do not include markdown formatting or backticks.
`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    try {
      const result = await this.callChatCompletion(messages, { temperature: 0.1 });
      const cleanJson = result.content.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      return {
        ...parsed,
        source: 'openrouter',
        modelUsed: result.model
      };
    } catch (err) {
      console.warn('OpenRouter parseVenuePrompt failed:', err);
      throw err;
    }
  }

  // --- 2. Conversational Concierge Chat Response ---
  async chatWithConcierge(userMessage, context = {}) {
    // Retrieve live venue catalogue summary for grounding
    const halls = (window.appStore && window.appStore.getHalls()) || [];
    const hallSummaries = halls.slice(0, 8).map(h => 
      `- ${h.name} (${h.city}): max ${h.capacityMax || 800} guests, ₹${h.pricingPerShift || 75000}/shift, AC: ${h.ac_status || 'Central AC'}, Rating: ${h.rating || 4.9}★, Amenities: ${(h.amenities || []).join(', ')}`
    ).join('\n');

    const systemPrompt = `
You are the luxury AI Concierge for VenueLuxe — Karnataka's premier wedding palace and banquet hall booking marketplace.
You assist customers with finding wedding halls, planning shift timings (Morning Muhurtham vs Evening Reception), estimating guest capacities, catering dining sizes, and pricing.

Context on available premier halls in registry:
${hallSummaries}

Tone Guidelines:
- Warm, polite, hospitable, and knowledgeable about Indian wedding customs (Tulu, Kannada, Konkani traditions in Coastal Karnataka).
- Give concise, helpful bullet points. Mention specific hall names when they fit the criteria.
- Always mention shift availability (Morning / Evening) and audited safety.
- Keep response under 120 words.
`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (context.history && Array.isArray(context.history)) {
      messages.push(...context.history.slice(-4));
    }

    messages.push({ role: 'user', content: userMessage });

    const result = await this.callChatCompletion(messages, { temperature: 0.7, max_tokens: 300 });
    return {
      reply: result.content,
      modelUsed: result.model
    };
  }

  // --- 3. AI Hall Sorting & Multi-Factor Ranking ---
  async rankListingsWithLLM(halls, userQuery) {
    if (!halls || halls.length === 0) return [];
    
    // Prepare concise metadata for candidate venues
    const candidateData = halls.slice(0, 6).map(h => ({
      id: h.id,
      name: h.name,
      city: h.city,
      capacity: h.capacityMax || 800,
      price: h.pricingPerShift || 75000,
      ac: h.ac_status,
      rating: h.rating
    }));

    const systemPrompt = `
Given user query: "${userQuery}", score each hall from 1 to 100 based on how well it fits.
Candidate Halls:
${JSON.stringify(candidateData)}

Output JSON array strictly in this format:
[
  { "id": string, "score": number, "reason": string }
]
`;

    try {
      const result = await this.callChatCompletion([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Rank the halls now.' }
      ], { temperature: 0.1 });

      const cleanJson = result.content.replace(/```json|```/g, '').trim();
      const ranking = JSON.parse(cleanJson);
      
      // Merge rankings back with full hall objects
      const rankedHalls = halls.map(hall => {
        const r = ranking.find(item => item.id === hall.id);
        return {
          ...hall,
          compatibilityPercent: r ? r.score : 70,
          aiRecommendationReason: r ? r.reason : 'Audited premier hall in region'
        };
      });

      rankedHalls.sort((a, b) => (b.compatibilityPercent || 0) - (a.compatibilityPercent || 0));
      return rankedHalls;
    } catch (err) {
      console.warn('OpenRouter LLM listing ranking failed, using rule-based ranker:', err);
      // Graceful fallback to rule-based ranking in aiConcierge
      if (window.aiConcierge) {
        return window.aiConcierge.rankHallsWithAI(halls, window.aiConcierge.parseQuery(userQuery));
      }
      return halls;
    }
  }
}

// Global Singleton Instance
window.openrouterService = new OpenRouterService();
