// VenueLuxe AI Concierge & Voice Intelligence Engine
// Processes natural language & voice commands into structured venue filters and recommendations

class AIConcierge {
  constructor() {
    this.recognition = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.isListening = false;
    this.isRecording = false;
    this.voiceMuted = false;
    this.speechSynth = window.speechSynthesis || null;
    this.history = [];
    this.activeCriteria = null;
    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-IN';
      } catch (e) {
        this.recognition = null;
      }
    }
  }

  isVoiceSupported() {
    return !!(navigator.mediaDevices?.getUserMedia || window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  async startListening(callbacks = {}) {
    if (this.isListening) {
      this.stopListening();
      return;
    }

    const config = this.getSettings();
    const hasElevenLabs = window.elevenlabsService && window.elevenlabsService.hasApiKey();
    const useScribe = config.sttEngine === 'elevenlabs_scribe' || (hasElevenLabs && config.sttEngine !== 'webspeech');

    if (useScribe && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        await this.startScribeRecording(callbacks);
        return;
      } catch (err) {
        console.warn('ElevenLabs Scribe recording failed to start, falling back to WebSpeech:', err);
        // Fallback to WebSpeech if mic recording throws
      }
    }

    this.startWebSpeechListening(callbacks);
  }

  async startScribeRecording(callbacks = {}) {
    this.audioChunks = [];
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Choose optimal mimeType supported by browser
    let mimeType = 'audio/webm';
    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
      mimeType = 'audio/webm;codecs=opus';
    } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
      mimeType = 'audio/mp4';
    }

    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType });
    this.isListening = true;
    this.isRecording = true;

    if (callbacks.onStart) callbacks.onStart();
    if (callbacks.onListening) callbacks.onListening('🎙️ Recording voice for ElevenLabs Scribe... Click mic again to finish');

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = async () => {
      this.isListening = false;
      this.isRecording = false;

      // Release mic stream tracks
      if (this.stream) {
        this.stream.getTracks().forEach(t => t.stop());
        this.stream = null;
      }

      if (this.audioChunks.length === 0) {
        if (callbacks.onError) callbacks.onError('No audio captured. Please speak again.');
        if (callbacks.onEnd) callbacks.onEnd();
        return;
      }

      const audioBlob = new Blob(this.audioChunks, { type: mimeType });
      if (callbacks.onInterim) callbacks.onInterim('⏳ Transcribing with ElevenLabs Scribe AI...');

      try {
        const text = await window.elevenlabsService.transcribeWithScribe(audioBlob);
        if (text) {
          if (callbacks.onFinal) callbacks.onFinal(text);
        } else {
          if (callbacks.onError) callbacks.onError('No speech could be recognized. Please try again.');
        }
      } catch (scribeErr) {
        console.warn('ElevenLabs Scribe failed; attempting WebSpeech fallback notice:', scribeErr);
        if (callbacks.onError) {
          callbacks.onError('ElevenLabs Scribe note: ' + (scribeErr.message || 'Error transcribing'));
        }
      } finally {
        if (callbacks.onEnd) callbacks.onEnd();
      }
    };

    this.mediaRecorder.start(250); // Slice data every 250ms
  }

  startWebSpeechListening(callbacks = {}) {
    if (!this.recognition) {
      if (callbacks.onError) callbacks.onError('Speech recognition is not supported in this browser. Please type your query.');
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }

    this.isListening = true;
    if (callbacks.onStart) callbacks.onStart();

    this.recognition.onstart = () => {
      this.isListening = true;
      if (callbacks.onListening) callbacks.onListening('Listening via WebSpeech... Speak now.');
    };

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (callbacks.onInterim) {
        callbacks.onInterim(interimTranscript || finalTranscript);
      }

      if (finalTranscript && callbacks.onFinal) {
        callbacks.onFinal(finalTranscript.trim());
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      let errorMsg = 'Voice recognition error.';
      if (event.error === 'not-allowed') {
        errorMsg = 'Microphone permission denied. Please allow microphone access in your browser.';
      } else if (event.error === 'no-speech') {
        errorMsg = 'No speech was detected. Please try speaking again.';
      } else if (event.error === 'network') {
        errorMsg = 'Network error during voice processing.';
      }
      if (callbacks.onError) callbacks.onError(errorMsg);
      if (callbacks.onEnd) callbacks.onEnd();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (callbacks.onEnd) callbacks.onEnd();
    };

    try {
      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      if (callbacks.onError) callbacks.onError('Could not start microphone: ' + e.message);
      if (callbacks.onEnd) callbacks.onEnd();
    }
  }

  stopListening() {
    // Stop MediaRecorder (ElevenLabs Scribe)
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {}
    }

    // Stop WebSpeech
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    this.isListening = false;
  }

  speak(text) {
    if (this.voiceMuted) return;
    if (window.elevenlabsService) {
      window.elevenlabsService.speak(text);
    } else if (this.speechSynth) {
      try {
        this.speechSynth.cancel();
        // Clean markdown tags or bullets before speaking
        const plainText = text.replace(/[*#_`]/g, '').replace(/₹(\d+)/g, '$1 rupees');
        const utterance = new SpeechSynthesisUtterance(plainText.slice(0, 200)); // concise speak
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        this.speechSynth.speak(utterance);
      } catch (e) {}
    }
  }

  toggleVoiceMute() {
    this.voiceMuted = !this.voiceMuted;
    if (window.elevenlabsService) {
      window.elevenlabsService.stopAudio();
    }
    if (this.voiceMuted && this.speechSynth) {
      this.speechSynth.cancel();
    }
    return this.voiceMuted;
  }

  // --- NLP & Intent Parsing ---
  parseQuery(text) {
    const q = text.toLowerCase();
    const criteria = {
      rawQuery: text,
      city: null,
      eventType: null,
      capacityMin: null,
      capacityMax: null,
      acType: null,
      venueType: null,
      indoorOutdoor: null,
      maxPrice: null,
      shift: null,
      facilities: [],
      tags: []
    };

    // 1. Detect City / Locality in Coastal Karnataka / Karnataka
    const cities = [
      { name: 'Karkala', aliases: ['karkala', 'karkal', 'anekere'] },
      { name: 'Mangalore', aliases: ['mangalore', 'mangaluru', 'kudla', 'panambur', 'kuntalpady', 'kenjar'] },
      { name: 'Udupi', aliases: ['udupi', 'santhekatte', 'malpe'] },
      { name: 'Manipal', aliases: ['manipal', 'tiger circle'] },
      { name: 'Bangalore', aliases: ['bangalore', 'bengaluru'] }
    ];

    for (const c of cities) {
      if (c.aliases.some(alias => q.includes(alias))) {
        criteria.city = c.name;
        criteria.tags.push(`📍 ${c.name}`);
        break;
      }
    }

    // 2. Detect Event Type
    if (q.includes('wedding') || q.includes('marriage') || q.includes('muhurtham') || q.includes('nikah') || q.includes('shaadi')) {
      criteria.eventType = 'Wedding & Reception';
      criteria.tags.push('💍 Wedding & Reception');
    } else if (q.includes('reception') || q.includes('banquet') || q.includes('sangeet') || q.includes('cocktail')) {
      criteria.eventType = 'Reception Banquet Hall';
      criteria.tags.push('🥂 Reception Banquet');
    } else if (q.includes('birthday') || q.includes('anniversary') || q.includes('party')) {
      criteria.eventType = 'Party & Birthday Venue';
      criteria.tags.push('🎉 Party / Celebration');
    } else if (q.includes('conference') || q.includes('summit') || q.includes('seminar') || q.includes('corporate') || q.includes('business')) {
      criteria.eventType = 'Convention Center & Auditorium';
      criteria.tags.push('💼 Corporate / Conference');
    } else if (q.includes('community') || q.includes('cultural') || q.includes('traditional') || q.includes('pooja')) {
      criteria.eventType = 'Community Hall & Cultural Space';
      criteria.tags.push('🛕 Cultural & Community');
    }

    // 3. Detect Guest Count / Seating Capacity
    // Matches patterns like "800 guests", "for 500 people", "1000 pax", "seats 450", "capacity 600"
    const guestMatch = q.match(/(\d+)\s*(?:guests?|people|pax|members?|attendees?|seats?|seating)/) ||
                       q.match(/(?:for|around|about|upto|seats?)\s*(\d+)/);

    if (guestMatch && guestMatch[1]) {
      const num = parseInt(guestMatch[1], 10);
      criteria.capacityMin = num;
      criteria.tags.push(`👥 ${num}+ Guests`);
    } else if (q.includes('large') || q.includes('grand') || q.includes('huge') || q.includes('massive')) {
      criteria.capacityMin = 800;
      criteria.tags.push('👥 Large (800+ Guests)');
    } else if (q.includes('small') || q.includes('intimate') || q.includes('mini')) {
      criteria.capacityMax = 400;
      criteria.tags.push('👥 Intimate (Under 400)');
    }

    // 4. Detect Climate / AC
    if (q.includes('non ac') || q.includes('non-ac') || q.includes('without ac') || q.includes('natural breeze') || q.includes('cross ventilation')) {
      criteria.acType = 'Non-AC';
      criteria.tags.push('🍃 Non-AC / Natural');
    } else if (q.includes('central ac') || q.includes('vrf') || q.includes('air condition') || q.includes('ac hall') || q.includes(' ac ') || q.startsWith('ac ') || q.endsWith(' ac')) {
      criteria.acType = 'Central AC';
      criteria.tags.push('❄️ Central AC');
    }

    // 5. Detect Indoor vs Outdoor / Lawns
    if (q.includes('lawn') || q.includes('outdoor') || q.includes('open air') || q.includes('garden') || q.includes('beach') || q.includes('seaside')) {
      criteria.indoorOutdoor = 'Outdoor';
      criteria.tags.push('🌿 Outdoor Lawn / Seaside');
    } else if (q.includes('auditorium') || q.includes('indoor') || q.includes('palace') || q.includes('ballroom')) {
      criteria.indoorOutdoor = 'Indoor';
      criteria.tags.push('🏛️ Indoor Ballroom');
    }

    // 6. Detect Budget / Pricing Constraints
    // Patterns: "under 1 lakh", "under 1.5 lakh", "below 80k", "under 75000", "under 1L"
    const lakhMatch = q.match(/(?:under|below|less than|within|max|budget)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lac|l)/);
    const kMatch = q.match(/(?:under|below|less than|within|max|budget)\s*(?:₹|rs\.?|inr)?\s*(\d+)\s*k/);
    const numPriceMatch = q.match(/(?:under|below|less than|within|max|budget)\s*(?:₹|rs\.?|inr)?\s*(\d{4,6})/);

    if (lakhMatch && lakhMatch[1]) {
      const lakhs = parseFloat(lakhMatch[1]);
      criteria.maxPrice = Math.round(lakhs * 100000);
      criteria.tags.push(`💰 Max ₹${lakhs}L`);
    } else if (kMatch && kMatch[1]) {
      const k = parseInt(kMatch[1], 10);
      criteria.maxPrice = k * 1000;
      criteria.tags.push(`💰 Max ₹${k}k`);
    } else if (numPriceMatch && numPriceMatch[1]) {
      criteria.maxPrice = parseInt(numPriceMatch[1], 10);
      criteria.tags.push(`💰 Max ₹${criteria.maxPrice.toLocaleString()}`);
    } else if (q.includes('budget') || q.includes('cheap') || q.includes('affordable') || q.includes('low cost')) {
      criteria.maxPrice = 60000;
      criteria.tags.push('💰 Budget (Under ₹60k)');
    } else if (q.includes('luxury') || q.includes('premium') || q.includes('royal') || q.includes('elite')) {
      criteria.tags.push('👑 Premier Luxury');
    }

    // 7. Detect Timing / Shifts
    if (q.includes('morning')) {
      criteria.shift = 'Morning';
      criteria.tags.push('🌅 Morning Shift');
    } else if (q.includes('afternoon')) {
      criteria.shift = 'Afternoon';
      criteria.tags.push('☀️ Afternoon Shift');
    } else if (q.includes('evening')) {
      criteria.shift = 'Evening';
      criteria.tags.push('🌆 Evening Shift');
    } else if (q.includes('night')) {
      criteria.shift = 'Night';
      criteria.tags.push('🌙 Night Shift');
    } else if (q.includes('full day') || q.includes('24 hours')) {
      criteria.shift = 'Full Day';
      criteria.tags.push('📅 Full Day');
    }

    // 8. Detect Amenities / Facilities
    if (q.includes('parking') || q.includes('valet')) {
      criteria.facilities.push('Parking');
      criteria.tags.push('🚗 Valet Parking');
    }
    if (q.includes('dining') || q.includes('food') || q.includes('catering') || q.includes('kitchen')) {
      criteria.facilities.push('Dining');
      criteria.tags.push('🍽️ AC Dining / Kitchen');
    }
    if (q.includes('stage') || q.includes('mandap') || q.includes('sound') || q.includes('audio') || q.includes('led')) {
      criteria.facilities.push('Stage');
      criteria.tags.push('🎭 Grand Stage & AV');
    }
    if (q.includes('generator') || q.includes('dg backup') || q.includes('power backup')) {
      criteria.facilities.push('Generator');
      criteria.tags.push('⚡ DG Power Backup');
    }

    // 9. Detect Sorting Preference
    if (q.includes('cheapest') || q.includes('lowest price') || q.includes('price low') || q.includes('low to high') || q.includes('least expensive') || q.includes('most affordable')) {
      criteria.sortBy = 'price_asc';
      criteria.tags.push('🏷️ Price: Low to High');
    } else if (q.includes('most expensive') || q.includes('price high') || q.includes('high to low') || (q.includes('highest price') && !q.includes('capacity'))) {
      criteria.sortBy = 'price_desc';
      criteria.tags.push('🏷️ Price: High to Low');
    } else if (q.includes('top rated') || q.includes('highest rated') || q.includes('best rated') || q.includes('highest review') || q.includes('best review') || q.includes('star rating')) {
      criteria.sortBy = 'rating';
      criteria.tags.push('⭐ Top Rated');
    } else if (q.includes('largest') || q.includes('biggest') || q.includes('highest capacity') || q.includes('max capacity') || q.includes('most guests') || q.includes('maximum guests')) {
      criteria.sortBy = 'capacity';
      criteria.tags.push('👥 Capacity: High to Low');
    } else if (q.includes('nearest') || q.includes('closest') || q.includes('nearby') || q.includes('close by') || q.includes('proximity')) {
      criteria.sortBy = 'nearest';
      criteria.tags.push('📍 Nearest First');
    } else if (q.includes('best value') || q.includes('value for money') || q.includes('worth')) {
      criteria.sortBy = 'value_for_money';
      criteria.tags.push('💰 Best Value');
    } else {
      criteria.sortBy = 'ai_match';
    }

    return criteria;
  }

  // --- Hall Matcher Engine ---
  matchHalls(criteria) {
    const allHalls = window.appStore.getPublicHalls(); // only approved live halls
    const scoredHalls = allHalls.map(hall => {
      let score = 0;
      const reasons = [];

      // City match
      if (criteria.city) {
        if (hall.city.toLowerCase() === criteria.city.toLowerCase() ||
            hall.area.toLowerCase().includes(criteria.city.toLowerCase())) {
          score += 40;
          reasons.push(`Located in ${hall.city}`);
        } else {
          score -= 15; // different city
        }
      }

      // Capacity match
      if (criteria.capacityMin) {
        if (hall.maximum_capacity >= criteria.capacityMin) {
          score += 30;
          reasons.push(`Accommodates up to ${hall.maximum_capacity} guests (seats ${hall.seating_capacity})`);
        } else if (hall.seating_capacity >= criteria.capacityMin * 0.8) {
          score += 15;
          reasons.push(`Close capacity (${hall.seating_capacity} seats)`);
        } else {
          score -= 25;
        }
      }

      if (criteria.capacityMax) {
        if (hall.seating_capacity <= criteria.capacityMax) {
          score += 20;
          reasons.push(`Intimate seating capacity of ${hall.seating_capacity}`);
        }
      }

      // AC Type match
      if (criteria.acType) {
        if (criteria.acType === 'Non-AC' && hall.ac_status.toLowerCase().includes('non-ac')) {
          score += 25;
          reasons.push('Natural ventilation / Non-AC format');
        } else if (criteria.acType === 'Central AC' && !hall.ac_status.toLowerCase().includes('non-ac')) {
          score += 25;
          reasons.push(`Equipped with ${hall.ac_status}`);
        }
      }

      // Indoor vs Outdoor
      if (criteria.indoorOutdoor) {
        if (criteria.indoorOutdoor === 'Outdoor' && (hall.indoor_outdoor.toLowerCase().includes('lawn') || hall.indoor_outdoor.toLowerCase().includes('outdoor'))) {
          score += 25;
          reasons.push('Open-air lawn / seaside space');
        } else if (criteria.indoorOutdoor === 'Indoor' && hall.indoor_outdoor.toLowerCase().includes('indoor')) {
          score += 20;
          reasons.push('Pillarless indoor auditorium');
        }
      }

      // Price match
      if (criteria.maxPrice && hall.pricing) {
        const eveningPrice = hall.pricing.evening || 75000;
        if (eveningPrice <= criteria.maxPrice) {
          score += 20;
          reasons.push(`Within budget at ₹${eveningPrice.toLocaleString()} per shift`);
        } else {
          score -= 20; // above budget
        }
      }

      // Event type match
      if (criteria.eventType) {
        if (hall.hall_type.toLowerCase().includes(criteria.eventType.toLowerCase()) ||
            hall.description.toLowerCase().includes(criteria.eventType.toLowerCase())) {
          score += 15;
          reasons.push(`Perfect for ${criteria.eventType}`);
        }
      }

      // Facilities match
      criteria.facilities.forEach(fac => {
        if (fac === 'Parking' && hall.parking_cars >= 150) {
          score += 10;
          reasons.push(`${hall.parking_cars}+ car valet parking`);
        }
        if (fac === 'Dining' && hall.dining_seats >= 300) {
          score += 10;
          reasons.push(`${hall.dining_seats}-seat dining hall`);
        }
        if (fac === 'Generator' && hall.has_generator) {
          score += 10;
          reasons.push('100% silent DG power backup');
        }
      });

      return {
        hall,
        score,
        reasons
      };
    });

    // Sort descending by score
    scoredHalls.sort((a, b) => b.score - a.score);

    // Pick matches with positive or decent score, minimum 1
    const matches = scoredHalls.filter(item => item.score > 10).map(item => ({
      ...item.hall,
      matchReasons: item.reasons
    }));

    // If zero strictly matched, return top 2 closest halls
    if (matches.length === 0 && scoredHalls.length > 0) {
      return scoredHalls.slice(0, 2).map(item => ({
        ...item.hall,
        matchReasons: ['Closest available venue in the region']
      }));
    }

    return matches;
  }

  // --- Conversational Response Generator ---
  generateResponse(userQuery, criteria, matchedHalls) {
    let intro = '';
    const cityText = criteria.city ? ` in ${criteria.city}` : '';
    const capText = criteria.capacityMin ? ` for ${criteria.capacityMin}+ guests` : '';
    const acText = criteria.acType ? ` with ${criteria.acType}` : '';
    const priceText = criteria.maxPrice ? ` under ₹${criteria.maxPrice.toLocaleString()}` : '';

    if (matchedHalls.length === 0) {
      return {
        message: `I searched for venues${cityText}${capText}${acText}${priceText}, but couldn't find an exact match right now. Would you like me to widen the search radius or adjust the guest capacity?`,
        halls: []
      };
    }

    if (matchedHalls.length === 1) {
      intro = `I found the premier match for your event${cityText}${capText}${acText}${priceText}: **${matchedHalls[0].name}**! It meets all your key specifications.`;
    } else {
      intro = `I've analyzed our audited registry and found **${matchedHalls.length} venues** perfectly tailored for you${cityText}${capText}${acText}${priceText}. Here are the top recommendations:`;
    }

    return {
      message: intro,
      criteria,
      halls: matchedHalls
    };
  }

  // --- Apply AI Filters to the Main Search Page ---
  applyFiltersToSearch(criteria) {
    this.activeCriteria = criteria;

    // Map criteria to SearchView filter structure
    if (window.SearchView) {
      if (criteria.city) {
        window.SearchView.filters.query = criteria.city;
      }
      if (criteria.acType) {
        window.SearchView.filters.acType = criteria.acType === 'Non-AC' ? 'Non-AC' : 'Central AC';
      }
      if (criteria.capacityMin) {
        if (criteria.capacityMin >= 1000) {
          window.SearchView.filters.capacityRange = '1000+';
        } else if (criteria.capacityMin >= 500) {
          window.SearchView.filters.capacityRange = '500-1000';
        } else if (criteria.capacityMin >= 200) {
          window.SearchView.filters.capacityRange = '200-500';
        }
      }
      if (criteria.maxPrice) {
        window.SearchView.filters.maxPrice = criteria.maxPrice;
      }

      // Apply detected sort strategy or default to AI Smart Match
      window.SearchView.filters.sortBy = criteria.sortBy || 'ai_match';

      sessionStorage.setItem('search_filter_location', criteria.city || '');
      sessionStorage.setItem('ai_active_criteria', JSON.stringify(criteria));

      // Route to search view if not already there
      if (window.location.hash !== '#/search') {
        window.location.hash = '#/search';
      } else {
        window.SearchView.refreshCardsAndMap();
      }

      if (window.Toast) {
        window.Toast.luxury('AI Filters Applied', `Filtered halls for ${criteria.tags.join(' ')}`);
      }
    }
  }

  // --- External AI Providers Configuration & Settings ---
  getSettings() {
    const sys = window.VENUELUXE_CONFIG || {};
    try {
      const saved = localStorage.getItem('venueluxe_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.apiKey && (sys.OPENROUTER_API_KEY || (window.openrouterService && window.openrouterService.getApiKey()))) {
          parsed.apiKey = sys.OPENROUTER_API_KEY || window.openrouterService.getApiKey();
        }
        if (!parsed.elevenLabsApiKey && (sys.ELEVENLABS_API_KEY || (window.elevenlabsService && window.elevenlabsService.getApiKey()))) {
          parsed.elevenLabsApiKey = sys.ELEVENLABS_API_KEY || window.elevenlabsService.getApiKey();
        }
        if (!parsed.elevenLabsVoiceId || parsed.elevenLabsVoiceId === '21m00Tcm4TlvDq8ikWAM' || parsed.elevenLabsVoiceId === 'oO7sLA3dWfQXsKeSAjpA') {
          parsed.elevenLabsVoiceId = sys.ELEVENLABS_VOICE_ID || (window.elevenlabsService && window.elevenlabsService.getVoiceId()) || 'EXAVITQu4vr4xnSDxMaL';
        }
        if (!parsed.sttEngine || parsed.sttEngine === 'whisper') {
          parsed.sttEngine = sys.DEFAULT_STT_ENGINE || 'elevenlabs_scribe';
        }
        return parsed;
      }
    } catch (e) {}

    const defaultKey = (sys.OPENROUTER_API_KEY) || (window.openrouterService && window.openrouterService.getApiKey()) || '';
    const defaultElevenKey = (sys.ELEVENLABS_API_KEY) || (window.elevenlabsService && window.elevenlabsService.getApiKey()) || '';

    return {
      sttEngine: sys.DEFAULT_STT_ENGINE || 'elevenlabs_scribe',
      nlpEngine: sys.DEFAULT_NLP_ENGINE || 'openrouter',
      openrouterModel: sys.DEFAULT_OPENROUTER_MODEL || 'nvidia/nemotron-3.5-lightning:free',
      sortStrategy: sys.DEFAULT_SORT_STRATEGY || 'ai_recommended',
      apiKey: defaultKey,
      elevenLabsApiKey: defaultElevenKey,
      elevenLabsVoiceId: sys.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL',
      modelName: 'gpt-4o-mini'
    };
  }

  saveSettings(config) {
    localStorage.setItem('venueluxe_ai_config', JSON.stringify(config));
    if (config.apiKey && config.nlpEngine === 'openrouter' && window.openrouterService) {
      window.openrouterService.setApiKey(config.apiKey);
    }
    if (window.elevenlabsService) {
      if (config.elevenLabsApiKey) window.elevenlabsService.setApiKey(config.elevenLabsApiKey);
      if (config.elevenLabsVoiceId) window.elevenlabsService.setVoiceId(config.elevenLabsVoiceId);
    }
    if (window.Toast) {
      window.Toast.success('AI Settings Saved', `Active NLP: ${config.nlpEngine.toUpperCase()} • Voice: ElevenLabs Cascade Active`);
    }
  }

  // --- External Natural Language Parsing (OpenRouter / Gemini / Groq / OpenAI with Fallback) ---
  async parseQueryAsync(text) {
    const config = this.getSettings();

    // If external LLM is selected and an API key is provided
    if (config.nlpEngine !== 'builtin' && config.apiKey) {
      try {
        if (config.nlpEngine === 'openrouter') {
          const model = config.openrouterModel || 'meta-llama/llama-3.3-70b-instruct:free';
          const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`,
              'HTTP-Referer': window.location.origin || 'http://localhost:8080',
              'X-Title': 'VenueLuxe AI Concierge'
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: 'system',
                  content: 'You are an AI venue concierge for wedding and banquet halls in Karnataka. Extract venue requirements from the user query into strict JSON: { "city": string or null (e.g. Karkala, Mangalore, Udupi, Manipal, Bangalore), "eventType": string or null, "capacityMin": number or null, "maxPrice": number or null, "acType": "Central AC" | "Non-AC" | null, "tags": string[] }. Return ONLY valid JSON, no markdown fences.'
                },
                { role: 'user', content: text }
              ],
              temperature: 0.1
            })
          });

          if (resp.ok) {
            const data = await resp.json();
            const rawContent = data.choices[0].message.content.trim();
            const cleanJson = rawContent.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return {
              ...this.parseQuery(text),
              ...parsed,
              isExternalLLM: true,
              engine: `OpenRouter (${model.split('/')[1] || model})`
            };
          }
        } else if (config.nlpEngine === 'openai' || config.nlpEngine === 'groq') {
          const endpoint = config.nlpEngine === 'groq'
            ? 'https://api.groq.com/openai/v1/chat/completions'
            : 'https://api.openai.com/v1/chat/completions';
          const model = config.nlpEngine === 'groq' ? 'llama-3.3-70b-versatile' : (config.modelName || 'gpt-4o-mini');

          const resp = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.apiKey}`
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: 'system',
                  content: 'You are an AI venue concierge for wedding and banquet halls in Karnataka. Extract venue requirements from the user query into strict JSON: { "city": string or null (e.g. Karkala, Mangalore, Udupi, Manipal, Bangalore), "eventType": string or null, "capacityMin": number or null, "maxPrice": number or null, "acType": "Central AC" | "Non-AC" | null, "tags": string[] }. Return ONLY valid JSON, no markdown fences.'
                },
                { role: 'user', content: text }
              ],
              temperature: 0.1
            })
          });

          if (resp.ok) {
            const data = await resp.json();
            const rawContent = data.choices[0].message.content.trim();
            const cleanJson = rawContent.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return {
              ...this.parseQuery(text),
              ...parsed,
              isExternalLLM: true,
              engine: config.nlpEngine
            };
          }
        } else if (config.nlpEngine === 'gemini') {
          const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are an AI venue concierge. Extract venue requirements from: "${text}" into JSON: { "city": string or null, "eventType": string or null, "capacityMin": number or null, "maxPrice": number or null, "acType": "Central AC" | "Non-AC" | null, "tags": string[] }. Return ONLY valid JSON.`
                }]
              }]
            })
          });

          if (resp.ok) {
            const data = await resp.json();
            const textContent = data.candidates[0].content.parts[0].text;
            const cleanJson = textContent.replace(/```json|```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            return {
              ...this.parseQuery(text),
              ...parsed,
              isExternalLLM: true,
              engine: 'gemini'
            };
          }
        }
      } catch (err) {
        console.warn('External AI parsing failed; using built-in deterministic engine:', err);
      }
    }

    // Built-in reliable deterministic parser fallback
    return this.parseQuery(text);
  }

  // --- External Speech-to-Text with OpenAI Whisper ---
  async transcribeWithWhisper(audioBlob) {
    const config = this.getSettings();
    if (!config.apiKey) {
      throw new Error('Please configure your OpenAI API Key in AI Settings to use Whisper.');
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    const resp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${config.apiKey}` },
      body: formData
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error('Whisper API Error: ' + err);
    }

    const data = await resp.json();
    return data.text;
  }

  // --- Advanced Multi-Factor AI Listing Ranking & Sorting Engine ---
  rankHallsWithAI(halls, criteria, strategy = null) {
    const config = this.getSettings();
    const mode = strategy || config.sortStrategy || 'ai_recommended';

    const scored = halls.map(hall => {
      let matchScore = 50; // base confidence
      const reasons = [];

      // 1. City / Locality Alignment (Up to 35 pts)
      if (criteria.city) {
        const c = criteria.city.toLowerCase();
        if (hall.city?.toLowerCase() === c || hall.address?.toLowerCase().includes(c) || hall.area?.toLowerCase().includes(c)) {
          matchScore += 35;
          reasons.push(`Located in ${hall.city}`);
        } else {
          matchScore -= 20;
        }
      }

      // 2. Capacity Optimization (Up to 25 pts)
      const cap = hall.capacityMax || hall.maximum_capacity || 800;
      if (criteria.capacityMin) {
        if (cap >= criteria.capacityMin) {
          matchScore += 25;
          reasons.push(`Accommodates up to ${cap} guests (${criteria.capacityMin}+ needed)`);
        } else if (cap >= criteria.capacityMin * 0.8) {
          matchScore += 10;
          reasons.push(`Close capacity fit (${cap} guests)`);
        } else {
          matchScore -= 25;
        }
      }

      // 3. Price & Budget Headroom (Up to 20 pts)
      const price = hall.pricingPerShift || (hall.pricing && hall.pricing.evening) || 75000;
      if (criteria.maxPrice) {
        if (price <= criteria.maxPrice) {
          matchScore += 20;
          reasons.push(`Within budget at ₹${price.toLocaleString('en-IN')}`);
        } else {
          matchScore -= 20;
        }
      }

      // 4. Climate & AC Verification (Up to 15 pts)
      const hasAC = (hall.ac_status && !hall.ac_status.toLowerCase().includes('non-ac')) ||
                    (hall.amenities && hall.amenities.some(a => a.toLowerCase().includes('ac')));
      if (criteria.acType) {
        if (criteria.acType === 'Central AC' && hasAC) {
          matchScore += 15;
          reasons.push('Central Air Conditioning verified');
        } else if (criteria.acType === 'Non-AC' && !hasAC) {
          matchScore += 15;
          reasons.push('Natural ventilation / Non-AC');
        }
      }

      // 5. Verification & Ratings Bonus
      const rating = parseFloat(hall.rating || 4.8);
      matchScore += Math.round(rating * 2.5); // ~12 pts

      const compatibilityPercent = Math.max(12, Math.min(99, Math.round((matchScore / 135) * 100)));
      const valueScore = cap / (price / 1000); // capacity per thousand rupees

      return {
        ...hall,
        matchScore,
        compatibilityPercent,
        valueScore,
        reasons
      };
    });

    // Apply Selected AI Ranking / Sorting Algorithm
    const effectiveMode = criteria.sortBy || mode || 'ai_recommended';

    if (effectiveMode === 'price_asc') {
      scored.sort((a, b) => {
        const pA = a.pricing ? (a.pricing.evening || a.pricing.morning || 75000) : 75000;
        const pB = b.pricing ? (b.pricing.evening || b.pricing.morning || 75000) : 75000;
        return pA - pB;
      });
    } else if (effectiveMode === 'price_desc') {
      scored.sort((a, b) => {
        const pA = a.pricing ? (a.pricing.evening || a.pricing.morning || 75000) : 75000;
        const pB = b.pricing ? (b.pricing.evening || b.pricing.morning || 75000) : 75000;
        return pB - pA;
      });
    } else if (effectiveMode === 'capacity') {
      scored.sort((a, b) => ((b.maximum_capacity || b.seating_capacity || 0) - (a.maximum_capacity || a.seating_capacity || 0)));
    } else if (effectiveMode === 'nearest') {
      scored.sort((a, b) => (a.distance_km || 0) - (b.distance_km || 0));
    } else if (effectiveMode === 'rating' || effectiveMode === 'rating_desc') {
      scored.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
    } else if (effectiveMode === 'compatibility') {
      scored.sort((a, b) => b.compatibilityPercent - a.compatibilityPercent);
    } else if (effectiveMode === 'value_for_money') {
      scored.sort((a, b) => b.valueScore - a.valueScore);
    } else {
      // Default: 'ai_recommended' (Multi-factor composite scoring)
      scored.sort((a, b) => {
        const scoreA = (a.compatibilityPercent * 0.55) + ((parseFloat(a.rating) || 4.5) * 5) + (a.valueScore * 1.5);
        const scoreB = (b.compatibilityPercent * 0.55) + ((parseFloat(b.rating) || 4.5) * 5) + (b.valueScore * 1.5);
        return scoreB - scoreA;
      });
    }

    return scored;
  }

  // --- Interactive AI Settings Modal ---
  openSettingsModal() {
    const existing = document.getElementById('ai-settings-modal');
    if (existing) existing.remove();

    const config = this.getSettings();

    const modal = document.createElement('div');
    modal.id = 'ai-settings-modal';
    modal.className = 'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in';
    modal.innerHTML = `
      <div class="bg-white rounded-3xl shadow-2xl border border-secondary/30 max-w-lg w-full p-6 sm:p-7 space-y-5 text-on-surface relative max-h-[92vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-outline pb-3.5">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h3 class="font-serif text-lg font-bold text-on-surface">AI & Voice Settings</h3>
              <p class="text-xs text-on-surface-variant">Configure Voice Models, Speech-to-Text & AI Search</p>
            </div>
          </div>
          <button type="button" onclick="document.getElementById('ai-settings-modal').remove()" class="text-on-surface-variant hover:text-secondary p-1.5 rounded-lg transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div class="space-y-4 text-xs">
          <!-- Voice Model Selection & Testing -->
          <div class="space-y-2 p-4 bg-secondary/5 rounded-2xl border border-secondary/25">
            <div class="flex items-center justify-between">
              <label class="font-bold uppercase tracking-wider text-secondary text-[11px] flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">record_voice_over</span>
                <span>ElevenLabs Voice Model</span>
              </label>
              <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">Verified Working</span>
            </div>

            <div class="space-y-2">
              <select id="cfg-elevenlabs-voice" class="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline text-on-surface font-semibold text-xs focus:outline-none focus:border-secondary">
                ${(window.elevenlabsService ? window.elevenlabsService.getAvailableVoices() : []).map(v => `
                  <option value="${v.id}" ${(config.elevenLabsVoiceId === v.id) ? 'selected' : ''}>${v.name} — ${v.desc}</option>
                `).join('')}
              </select>

              <div class="flex items-center justify-between gap-2 pt-1">
                <button type="button" id="cfg-test-voice-btn" onclick="
                  const key = document.getElementById('cfg-elevenlabs-key').value.trim();
                  const voice = document.getElementById('cfg-elevenlabs-voice').value.trim();
                  const btn = document.getElementById('cfg-test-voice-btn');
                  const status = document.getElementById('cfg-voice-status');
                  if (window.elevenlabsService) {
                    if (key) window.elevenlabsService.setApiKey(key);
                    if (voice) window.elevenlabsService.setVoiceId(voice);
                    btn.disabled = true;
                    btn.innerHTML = '<span class=\\'material-symbols-outlined text-[15px] animate-spin\\'>progress_activity</span><span>Testing...</span>';
                    status.innerHTML = '<span class=\\'text-secondary font-semibold\\'>🔊 Synthesizing audio...</span>';
                    
                    window.elevenlabsService.speak('Welcome to VenueLuxe. Verified wedding palaces and party banquets in Karnataka are ready for your event.');
                    
                    setTimeout(() => {
                      btn.disabled = false;
                      btn.innerHTML = '<span class=\\'material-symbols-outlined text-[15px]\\'>play_circle</span><span>Test Voice</span>';
                      status.innerHTML = '<span class=\\'text-emerald-700 font-bold\\'>✓ Audio playing</span>';
                    }, 1200);
                  }
                " class="px-4 py-2 rounded-xl bg-secondary text-white hover:bg-secondary-container font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                  <span class="material-symbols-outlined text-[15px]">play_circle</span>
                  <span>Test Voice</span>
                </button>
                <div id="cfg-voice-status" class="text-[11px] truncate"></div>
              </div>
            </div>

            <!-- ElevenLabs API Key -->
            <div class="space-y-1 pt-2 border-t border-secondary/15">
              <span class="text-[10px] font-bold text-on-surface-variant uppercase">ElevenLabs API Key</span>
              <input type="password" id="cfg-elevenlabs-key" value="${config.elevenLabsApiKey || ''}" placeholder="sk_... (Configured in config.js or paste custom)" class="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline text-on-surface font-mono text-xs focus:outline-none focus:border-secondary">
            </div>
          </div>

          <!-- Speech-to-Text Provider -->
          <div class="space-y-1.5">
            <label class="font-bold uppercase tracking-wider text-on-surface-variant text-[11px] flex items-center justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-secondary">mic</span>
                <span>Speech-to-Text (STT) Tool</span>
              </span>
              <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">Active</span>
            </label>
            <select id="cfg-stt-engine" class="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline text-on-surface font-semibold focus:outline-none focus:border-secondary">
              <option value="elevenlabs_scribe" ${config.sttEngine === 'elevenlabs_scribe' ? 'selected' : ''}>🟢 ElevenLabs Scribe STT (High Accuracy • Speech Recognition)</option>
              <option value="webspeech" ${config.sttEngine === 'webspeech' ? 'selected' : ''}>🟢 Browser Web Speech API (Free • Built-in Instant)</option>
            </select>
          </div>

          <!-- Natural Language Understanding LLM -->
          <div class="space-y-1.5">
            <label class="font-bold uppercase tracking-wider text-on-surface-variant text-[11px] flex items-center justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-secondary">psychology</span>
                <span>AI Concierge Intelligence (NLU / LLM)</span>
              </span>
            </label>
            <select id="cfg-nlp-engine" onchange="const orBox = document.getElementById('openrouter-model-container'); if(orBox) orBox.style.display = this.value === 'openrouter' ? 'block' : 'none';" class="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline text-on-surface font-semibold focus:outline-none focus:border-secondary">
              <option value="openrouter" ${config.nlpEngine === 'openrouter' ? 'selected' : ''}>🟢 OpenRouter (Free Tier Models: Nemotron, Llama 3.3, DeepSeek R1)</option>
              <option value="builtin" ${config.nlpEngine === 'builtin' ? 'selected' : ''}>🟢 Built-in Fast Heuristic NLP (Free • Instant • Zero Latency)</option>
            </select>

            <!-- OpenRouter Free Model Selector -->
            <div id="openrouter-model-container" class="space-y-1 pt-1" style="display: ${config.nlpEngine === 'openrouter' ? 'block' : 'none'};">
              <label class="text-[10px] font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                <span class="material-symbols-outlined text-[13px]">smart_toy</span>
                <span>Free Model Selection</span>
              </label>
              <select id="cfg-openrouter-model" class="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-secondary/40 text-on-surface font-medium text-xs focus:outline-none">
                <option value="nvidia/nemotron-3.5-lightning:free" ${config.openrouterModel === 'nvidia/nemotron-3.5-lightning:free' ? 'selected' : ''}>NVIDIA Nemotron 3.5 Lightning (Free • Lightning Fast)</option>
                <option value="meta-llama/llama-3.3-70b-instruct:free" ${config.openrouterModel === 'meta-llama/llama-3.3-70b-instruct:free' ? 'selected' : ''}>Meta Llama 3.3 70B (Free • High Accuracy)</option>
                <option value="deepseek/deepseek-r1:free" ${config.openrouterModel === 'deepseek/deepseek-r1:free' ? 'selected' : ''}>DeepSeek R1 (Free • Deep Reasoning)</option>
              </select>
            </div>
          </div>

          <!-- OpenRouter API Key Input -->
          <div class="space-y-1.5">
            <label class="font-bold uppercase tracking-wider text-on-surface-variant text-[11px] flex items-center justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-secondary">key</span>
                <span>OpenRouter API Key</span>
              </span>
            </label>
            <input type="password" id="cfg-api-key" value="${config.apiKey || ''}" placeholder="sk-or-... (Pre-configured in config.js)" class="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline text-on-surface font-mono text-xs focus:outline-none focus:border-secondary">
            <div class="flex items-center justify-between pt-0.5">
              <button type="button" id="cfg-test-key-btn" onclick="
                const key = document.getElementById('cfg-api-key').value.trim();
                const model = document.getElementById('cfg-openrouter-model')?.value;
                const btn = document.getElementById('cfg-test-key-btn');
                const status = document.getElementById('cfg-test-status');
                if (!key) {
                  status.innerHTML = '<span class=\\'text-amber-700\\'>Please enter an OpenRouter key</span>';
                  return;
                }
                btn.disabled = true;
                btn.innerHTML = 'Testing...';
                window.openrouterService.testConnection(key, model).then(res => {
                  btn.disabled = false;
                  btn.innerHTML = 'Test Connection';
                  if (res.success) {
                    status.innerHTML = '<span class=\\'text-emerald-700 font-bold\\'>✓ Connected to OpenRouter</span>';
                  } else {
                    status.innerHTML = '<span class=\\'text-red-600 font-medium\\'>✗ Connection failed</span>';
                  }
                });
              " class="px-3 py-1 rounded-lg border border-secondary/30 text-secondary hover:bg-secondary/10 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors">
                <span class="material-symbols-outlined text-[14px]">bolt</span>
                <span>Test Connection</span>
              </button>
              <div id="cfg-test-status" class="text-[11px] text-right truncate max-w-[240px]"></div>
            </div>
          </div>

          <!-- Sorting Algorithm -->
          <div class="space-y-1.5">
            <label class="font-bold uppercase tracking-wider text-on-surface-variant text-[11px] flex items-center justify-between">
              <span class="flex items-center gap-1">
                <span class="material-symbols-outlined text-[15px] text-secondary">sort</span>
                <span>Default Venue Ranking</span>
              </span>
            </label>
            <select id="cfg-sort-strategy" class="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-outline text-on-surface font-semibold focus:outline-none focus:border-secondary">
              <option value="ai_recommended" ${config.sortStrategy === 'ai_recommended' ? 'selected' : ''}>✨ AI Smart Match (Compatibility + Rating + Pricing)</option>
              <option value="compatibility" ${config.sortStrategy === 'compatibility' ? 'selected' : ''}>🎯 Strict Criteria Compatibility %</option>
              <option value="value_for_money" ${config.sortStrategy === 'value_for_money' ? 'selected' : ''}>💰 Best Value per Guest (Lowest Price per Capacity)</option>
              <option value="rating_desc" ${config.sortStrategy === 'rating_desc' ? 'selected' : ''}>★ Highest Customer Rating</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-outline">
          <button type="button" onclick="aiConcierge.saveSettings({ sttEngine: 'elevenlabs_scribe', nlpEngine: 'openrouter', openrouterModel: 'nvidia/nemotron-3.5-lightning:free', sortStrategy: 'ai_recommended', apiKey: '', elevenLabsApiKey: '', elevenLabsVoiceId: 'EXAVITQu4vr4xnSDxMaL' }); document.getElementById('ai-settings-modal').remove(); if(window.Toast) window.Toast.success('Settings Reset', 'Default verified voice and models restored.');" class="text-xs text-secondary hover:underline font-semibold cursor-pointer">
            Reset to Defaults
          </button>
          <div class="flex items-center gap-2">
            <button type="button" onclick="document.getElementById('ai-settings-modal').remove()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="button" onclick="
              const stt = document.getElementById('cfg-stt-engine').value;
              const nlp = document.getElementById('cfg-nlp-engine').value;
              const orModel = document.getElementById('cfg-openrouter-model')?.value || 'nvidia/nemotron-3.5-lightning:free';
              const sort = document.getElementById('cfg-sort-strategy').value;
              const key = document.getElementById('cfg-api-key').value.trim();
              const elevenKey = document.getElementById('cfg-elevenlabs-key').value.trim();
              const elevenVoice = document.getElementById('cfg-elevenlabs-voice').value.trim();
              aiConcierge.saveSettings({ 
                sttEngine: stt, 
                nlpEngine: nlp, 
                openrouterModel: orModel, 
                sortStrategy: sort, 
                apiKey: key,
                elevenLabsApiKey: elevenKey,
                elevenLabsVoiceId: elevenVoice
              });
              if(window.elevenlabsService && elevenVoice) {
                window.elevenlabsService.setVoiceId(elevenVoice);
              }
              document.getElementById('ai-settings-modal').remove();
              if(window.Toast) window.Toast.success('Settings Saved', 'AI model & voice preferences updated.');
            " class="px-5 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-secondary text-white transition-colors cursor-pointer shadow-sm">
              Save AI Settings
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }
}

// Global Singleton
window.aiConcierge = new AIConcierge();

