// VenueLuxe AI Concierge & Voice Assistant Widget
// Built in the aesthetic of 21st.dev Modern AI Chatbot / Command Dock Templates
// Blends 21st.dev clean minimalism with the VenueLuxe luxury design system
// Colors: Royal Midnight Navy (#0F172A), Warm Champagne Gold (#B45309), Emerald (#10B981)
// Typography: Playfair Display + Plus Jakarta Sans

const AIChatWidget = {
  isOpen: false,
  isListening: false,
  isModalMode: false,
  messages: [],
  container: null,

  init() {
    if (!document.getElementById('ai-chat-root')) {
      const el = document.createElement('div');
      el.id = 'ai-chat-root';
      el.className = 'fixed inset-0 pointer-events-none z-[95] flex flex-col justify-end items-end p-3 sm:p-5';
      document.body.appendChild(el);
      this.container = el;

      // Seed 21st.dev style welcome message
      this.messages = [
        {
          sender: 'ai',
          text: "Hello! I am your **VenueLuxe AI Concierge**. Speak or type what you're imagining for your event—location, guest count, AC, or budget—and I'll surface matching verified halls in real time.",
          criteria: null,
          tags: ['✨ Natural Speech', '📍 Coastal Karnataka', '⚡ Real-time Availability'],
          halls: []
        }
      ];

      this.render();
    }
  },

  toggleChat() {
    this.isOpen = !this.isOpen;
    this.render();

    if (this.isOpen) {
      setTimeout(() => {
        const input = document.getElementById('widget-chat-input');
        if (input) input.focus();
        this.scrollToBottom();
      }, 120);
    }
  },

  toggleModalMode() {
    this.isModalMode = !this.isModalMode;
    this.render();
    setTimeout(() => this.scrollToBottom(), 50);
  },

  openWithQuery(query) {
    if (!this.isOpen) this.isOpen = true;
    this.render();
    this.handleUserQuery(query, false);
  },

  openWithPrompt(query) {
    this.openWithQuery(query);
  },

  toggleVoiceListening() {
    if (this.isListening) {
      this.stopVoiceCommand();
    } else {
      this.startVoiceCommand();
    }
  },

  startVoiceCommand() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.render();
    }

    const input = document.getElementById('widget-chat-input');
    const statusText = document.getElementById('ai-voice-status');

    if (!window.aiConcierge) {
      if (window.Notification) window.Notification.show('AI Concierge initializing...', 'info');
      return;
    }

    window.aiConcierge.startListening({
      onStart: () => {
        this.isListening = true;
        this.renderVoiceState(true);
      },
      onListening: () => {
        if (statusText) statusText.innerText = 'Listening to your voice... Speak now.';
      },
      onInterim: (text) => {
        if (input) input.value = text;
        if (statusText) statusText.innerText = `Hearing: "${text}"`;
      },
      onFinal: (finalText) => {
        this.isListening = false;
        this.renderVoiceState(false);
        if (input) input.value = finalText;
        this.handleUserQuery(finalText, true);
      },
      onError: (err) => {
        this.isListening = false;
        this.renderVoiceState(false);
        if (window.Notification) window.Notification.show(err, 'error');
        if (statusText) statusText.innerText = '';
      },
      onEnd: () => {
        this.isListening = false;
        this.renderVoiceState(false);
      }
    });
  },

  stopVoiceCommand() {
    if (window.aiConcierge) {
      window.aiConcierge.stopListening();
    }
    this.isListening = false;
    this.renderVoiceState(false);
  },

  renderVoiceState(listening) {
    const micBtn = document.getElementById('widget-mic-btn');
    const waveEl = document.getElementById('ai-voice-waves');
    const statusEl = document.getElementById('ai-voice-status');

    if (micBtn) {
      if (listening) {
        micBtn.classList.remove('bg-amber-600', 'text-white');
        micBtn.classList.add('bg-red-600', 'text-white', 'animate-pulse');
      } else {
        micBtn.classList.remove('bg-red-600', 'animate-pulse');
        micBtn.classList.add('bg-amber-600', 'text-white');
      }
    }

    if (waveEl) {
      waveEl.style.display = listening ? 'flex' : 'none';
    }

    if (statusEl) {
      statusEl.style.display = listening ? 'block' : 'none';
      if (!listening) statusEl.innerText = '';
    }
  },

  submitInput() {
    const input = document.getElementById('widget-chat-input');
    if (input && input.value.trim()) {
      const val = input.value.trim();
      input.value = '';
      this.handleUserQuery(val, false);
    }
  },

  handleUserQuery(rawText, isVoice = false) {
    if (!rawText || !rawText.trim()) return;
    const query = rawText.trim();

    // 1. Append User Message
    this.messages.push({
      sender: 'user',
      text: query,
      isVoice
    });

    const input = document.getElementById('widget-chat-input');
    if (input) input.value = '';
    this.renderMessages();
    this.scrollToBottom();

    // 2. Process query with AI Concierge Engine
    const criteria = window.aiConcierge.parseQuery(query);
    const matches = window.aiConcierge.matchHalls(criteria);
    const response = window.aiConcierge.generateResponse(query, criteria, matches);

    // 3. Natural AI typing delay
    setTimeout(() => {
      this.messages.push({
        sender: 'ai',
        text: response.message,
        criteria,
        tags: criteria.tags,
        halls: matches
      });

      this.renderMessages();
      this.scrollToBottom();

      // Speak response if unmuted
      if (window.aiConcierge && !window.aiConcierge.voiceMuted) {
        window.aiConcierge.speak(response.message);
      }
    }, 400);
  },

  applyFilters(criteriaIndex) {
    const msg = this.messages[criteriaIndex];
    if (msg && msg.criteria) {
      window.aiConcierge.applyFiltersToSearch(msg.criteria);
      this.toggleChat(); // Close drawer so user sees search results
    }
  },

  clearChat() {
    this.messages = [
      {
        sender: 'ai',
        text: "Conversation reset! Tell me what venue you're searching for and I'll find it instantly.",
        criteria: null,
        tags: ['✨ Voice Search Ready', '📍 Coastal Karnataka'],
        halls: []
      }
    ];
    this.renderMessages();
  },

  scrollToBottom() {
    const stream = document.getElementById('ai-chat-stream');
    if (stream) {
      stream.scrollTop = stream.scrollHeight;
    }
  },

  render() {
    if (!this.container) return;

    // 21st.dev Sizing: Centered Command Modal vs Floating Compact Island
    const panelClasses = this.isModalMode
      ? 'fixed inset-4 sm:inset-10 md:inset-20 max-w-3xl max-h-[800px] m-auto w-full h-[88vh] rounded-3xl'
      : 'w-[94vw] sm:w-[440px] max-w-[460px] h-[580px] max-h-[82vh] rounded-3xl mb-3 origin-bottom-right';

    this.container.innerHTML = `
      <!-- Backdrop Dimmer for Modal Mode -->
      ${this.isOpen && this.isModalMode ? `
        <div class="fixed inset-0 bg-black/50 backdrop-blur-md z-[92] pointer-events-auto transition-opacity" onclick="AIChatWidget.toggleModalMode()"></div>
      ` : ''}

      <!-- 1. 21st.dev Style Floating AI Card -->
      <div id="ai-chat-panel" class="pointer-events-auto chat-21st-glass ${panelClasses} overflow-hidden flex flex-col z-[96] transition-all duration-300 relative ${this.isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none hidden'}">
        
        <!-- Subtle Ambient Background Glow -->
        <div class="absolute -top-24 -right-24 w-64 h-64 rounded-full ai-aura-glow pointer-events-none animate-aura"></div>
        <div class="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>

        <!-- 21st.dev Header: Minimalist, Refined, Clean -->
        <header class="flex items-center justify-between px-5 py-3.5 border-b border-zinc-200/70 bg-white/70 backdrop-blur-md shrink-0 relative z-10">
          <div class="flex items-center gap-3">
            <!-- Glowing Avatar Orb -->
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-white">
                <span class="material-symbols-outlined text-[17px]">auto_awesome</span>
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>

            <div>
              <div class="flex items-center gap-1.5">
                <h2 class="font-['Playfair_Display'] text-sm sm:text-base font-bold text-zinc-900 tracking-tight">VenueLuxe Concierge</h2>
                <span class="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[10px] font-semibold">AI 2.0</span>
              </div>
              <p class="text-[11px] text-zinc-500 font-medium">Voice & Smart Discovery</p>
            </div>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-0.5 text-zinc-500">
            <!-- Voice Mute -->
            <button class="p-1.5 hover:bg-zinc-100 hover:text-zinc-900 rounded-full transition-colors cursor-pointer" onclick="AIChatWidget.toggleMute(this)" title="Toggle Voice Output">
              <span class="material-symbols-outlined text-[18px]" id="ai-voice-mute-icon">${window.aiConcierge.voiceMuted ? 'volume_off' : 'volume_up'}</span>
            </button>
            
            <!-- Expand to Center Modal -->
            <button class="hidden sm:flex p-1.5 hover:bg-zinc-100 hover:text-zinc-900 rounded-full transition-colors cursor-pointer" onclick="AIChatWidget.toggleModalMode()" title="${this.isModalMode ? 'Dock to corner' : 'Expand window'}">
              <span class="material-symbols-outlined text-[18px]">${this.isModalMode ? 'close_fullscreen' : 'open_in_full'}</span>
            </button>

            <!-- Reset Chat -->
            <button class="p-1.5 hover:bg-zinc-100 hover:text-zinc-900 rounded-full transition-colors cursor-pointer" onclick="AIChatWidget.clearChat()" title="Reset Conversation">
              <span class="material-symbols-outlined text-[18px]">restart_alt</span>
            </button>

            <!-- Close -->
            <button class="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors cursor-pointer ml-1" onclick="AIChatWidget.toggleChat()" title="Close Assistant">
              <span class="material-symbols-outlined text-[19px]">close</span>
            </button>
          </div>
        </header>

        <!-- 21st.dev Suggestion Strip: Horizontal Floating Pills -->
        <div class="px-4 py-2 border-b border-zinc-100 bg-zinc-50/70 overflow-x-auto whitespace-nowrap no-scrollbar shrink-0 flex items-center gap-1.5 relative z-10">
          <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 shrink-0 mr-1">Suggestions:</span>
          
          <button class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium transition-all border border-zinc-200/80 shadow-2xs shrink-0 cursor-pointer hover:border-amber-400" onclick="AIChatWidget.openWithQuery('AC wedding hall in Karkala for 800 guests')">
            <span>💍</span>
            <span>AC Hall in Karkala 800+</span>
          </button>
          
          <button class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium transition-all border border-zinc-200/80 shadow-2xs shrink-0 cursor-pointer hover:border-amber-400" onclick="AIChatWidget.openWithQuery('Outdoor lawn in Mangalore under 1.5L')">
            <span>🌿</span>
            <span>Outdoor Lawn Mangalore</span>
          </button>

          <button class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white hover:bg-zinc-100 text-zinc-700 text-[11px] font-medium transition-all border border-zinc-200/80 shadow-2xs shrink-0 cursor-pointer hover:border-amber-400" onclick="AIChatWidget.openWithQuery('Non-AC community hall in Udupi for 400 people')">
            <span>🏛️</span>
            <span>Udupi Community Hall</span>
          </button>
        </div>

        <!-- 21st.dev Conversation Stream -->
        <main id="ai-chat-stream" class="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3.5 relative z-10">
          ${this.renderMessagesHTML()}
        </main>

        <!-- Active Voice Recording Waves & Status -->
        <div id="ai-voice-status" class="hidden px-4 py-1.5 bg-amber-500/10 border-t border-amber-500/20 text-amber-900 text-[11px] font-semibold text-center shrink-0"></div>

        <div id="ai-voice-waves" class="hidden px-4 py-2 bg-amber-500/5 items-center justify-center gap-2 border-t border-amber-500/20 shrink-0">
          <span class="text-xs font-bold text-amber-800 flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px] text-amber-600">mic</span>
            Listening...
          </span>
          <div class="voice-waveform-active">
            <span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>

        <!-- 21st.dev Floating Input Dock: Modern, Elevated, Tactile -->
        <footer class="p-3 sm:p-4 bg-white/85 backdrop-blur-md border-t border-zinc-200/70 shrink-0 relative z-10">
          <form onsubmit="event.preventDefault(); AIChatWidget.submitInput();" class="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-2xl p-1.5 shadow-inner focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10 transition-all">
            
            <!-- Voice Dictation Button with Circular Pulse -->
            <button type="button" id="widget-mic-btn" class="w-9 h-9 rounded-xl bg-amber-600 hover:bg-amber-700 text-white flex items-center justify-center shrink-0 transition-all shadow-sm cursor-pointer" onclick="AIChatWidget.toggleVoiceListening()" title="Click to Speak">
              <span class="material-symbols-outlined text-[19px]">mic</span>
            </button>

            <!-- Input Field -->
            <input type="text" id="widget-chat-input" class="flex-1 bg-transparent text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 font-medium focus:outline-none px-2" placeholder="Ask or speak: 'AC hall in Karkala for 800 guests under 1L'...">

            <!-- Send Action Button -->
            <button type="submit" class="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-black text-white flex items-center justify-center shrink-0 transition-all shadow-xs cursor-pointer" title="Send (Enter)">
              <span class="material-symbols-outlined text-[17px]">arrow_upward</span>
            </button>
          </form>

          <div class="flex items-center justify-between text-[10px] text-zinc-400 px-1 mt-1.5">
            <span>Click 🎙️ to use speech-to-text</span>
            <span>Press ↵ Enter</span>
          </div>
        </footer>

      </div>

      <!-- 2. Modern 21st.dev Floating Pill Trigger -->
      <button onclick="AIChatWidget.toggleChat()" class="pointer-events-auto group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-zinc-900 text-white hover:bg-black shadow-xl border border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer">
        <div class="relative flex items-center justify-center">
          <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center text-xs shadow-xs">
            <span class="material-symbols-outlined text-[14px]">auto_awesome</span>
          </div>
          <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span class="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>

        <span class="font-bold text-xs text-white tracking-wide">Ask AI Concierge</span>
        <span class="material-symbols-outlined text-[14px] text-amber-400">mic</span>
      </button>
    `;
  },

  renderMessages() {
    const stream = document.getElementById('ai-chat-stream');
    if (stream) {
      stream.innerHTML = this.renderMessagesHTML();
    }
  },

  renderMessagesHTML() {
    return this.messages.map((m, idx) => {
      if (m.sender === 'user') {
        return `
          <!-- 21st.dev User Message: Sleek Dark Bubble -->
          <div class="flex flex-col items-end self-end max-w-[85%] animate-fadeIn">
            <div class="bg-zinc-900 text-white rounded-2xl rounded-br-xs px-4 py-2.5 text-xs sm:text-sm font-medium shadow-sm leading-relaxed">
              ${m.text}
            </div>
            ${m.isVoice ? `
              <div class="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5 pr-1">
                <span class="material-symbols-outlined text-[12px] text-amber-500">mic</span>
                <span>Voice input</span>
              </div>
            ` : ''}
          </div>
        `;
      } else {
        return `
          <!-- 21st.dev AI Message: Clean, Modern, Card-Based -->
          <div class="flex flex-col items-start self-start w-full space-y-2.5 animate-fadeIn">
            
            <div class="bg-white border border-zinc-200/80 rounded-2xl rounded-tl-xs p-3.5 shadow-2xs w-full">
              <!-- AI text -->
              <p class="text-xs sm:text-sm text-zinc-800 font-normal leading-relaxed">
                ${this.formatMarkdown(m.text)}
              </p>

              <!-- Extracted Filters as 21st.dev Pill Badges -->
              ${m.criteria && (m.criteria.city || m.criteria.capacityMin || m.criteria.acType || m.criteria.maxPrice || m.criteria.indoorOutdoor) ? `
                <div class="mt-3 pt-2.5 border-t border-zinc-100 flex flex-wrap items-center gap-1.5">
                  <span class="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mr-1">Parsed:</span>
                  ${m.criteria.city ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-semibold border border-zinc-200/60">📍 ${m.criteria.city}</span>` : ''}
                  ${m.criteria.capacityMin ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-semibold border border-zinc-200/60">👥 ${m.criteria.capacityMin}+ Pax</span>` : ''}
                  ${m.criteria.acType ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200/60">❄️ ${m.criteria.acType}</span>` : ''}
                  ${m.criteria.maxPrice ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[11px] font-semibold border border-amber-200/60">💰 ≤ ₹${Math.round(m.criteria.maxPrice / 1000)}k</span>` : ''}
                  ${m.criteria.indoorOutdoor ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-semibold border border-zinc-200/60">🌿 ${m.criteria.indoorOutdoor}</span>` : ''}
                </div>
              ` : ''}

              <!-- One-Click Apply to Split Map / Search -->
              ${m.criteria ? `
                <div class="mt-3">
                  <button onclick="AIChatWidget.applyFilters(${idx})" class="w-full py-2 px-3 bg-zinc-900 hover:bg-black text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer">
                    <span class="material-symbols-outlined text-[15px] text-amber-400">map</span>
                    <span>Apply Filters & Explore on Map</span>
                  </button>
                </div>
              ` : ''}
            </div>

            <!-- Sleek 21st.dev Mini Venue Cards -->
            ${m.halls && m.halls.length ? `
              <div class="space-y-2 w-full pt-1">
                <div class="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <span class="material-symbols-outlined text-[14px] text-amber-600">verified</span>
                  Matched Halls (${m.halls.length}):
                </div>

                <div class="grid grid-cols-1 gap-2">
                  ${m.halls.slice(0, 3).map(h => `
                    <div class="group bg-white border border-zinc-200 rounded-xl p-2.5 flex items-center gap-3 hover:border-zinc-400 transition-all shadow-2xs">
                      <img src="${h.cover_image}" class="w-16 h-16 rounded-lg object-cover shrink-0 bg-zinc-100 group-hover:scale-105 transition-transform duration-300" alt="${h.name}">
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-1">
                          <h4 class="font-bold text-xs text-zinc-900 truncate group-hover:text-amber-700 transition-colors">${h.name}</h4>
                          <span class="flex items-center text-[11px] font-bold text-zinc-800 shrink-0">
                            <span class="material-symbols-outlined text-[13px] text-amber-500" style="font-variation-settings: 'FILL' 1;">star</span>
                            ${h.rating || 4.9}
                          </span>
                        </div>
                        <div class="text-[11px] text-zinc-500 truncate mt-0.5">
                          ${h.city} • Seats ${h.seating_capacity} • ${h.ac_status}
                        </div>
                        <div class="flex items-center justify-between mt-1 pt-1 border-t border-zinc-100">
                          <span class="font-bold text-xs text-zinc-900">₹${(h.pricing?.evening || 75000).toLocaleString()}<span class="text-[9px] font-normal text-zinc-400">/shift</span></span>
                          <a href="#/hall/${h.id}" onclick="AIChatWidget.toggleChat()" class="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-0.5">
                            <span>View</span>
                            <span class="material-symbols-outlined text-[13px]">chevron_right</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

          </div>
        `;
      }
    }).join('');
  },

  formatMarkdown(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  },

  submitInput() {
    const input = document.getElementById('ai-chat-input');
    if (input && input.value.trim()) {
      this.handleUserQuery(input.value.trim(), false);
    }
  },

  toggleMute(btn) {
    const muted = window.aiConcierge.toggleVoiceMute();
    const icon = document.getElementById('ai-voice-mute-icon');
    if (icon) {
      icon.innerText = muted ? 'volume_off' : 'volume_up';
    }
    if (window.Notification) {
      window.Notification.show(muted ? 'Voice audio muted.' : 'Voice audio enabled.', 'info');
    }
  }
};

window.AIChatWidget = AIChatWidget;
