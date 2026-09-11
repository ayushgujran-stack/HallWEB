// Landing Page View Component for VenueLuxe
// Polished Indian wedding & event venue marketplace design

const LandingView = {
  render() {
    const publicHalls = window.appStore.getPublicHalls();
    const featuredHalls = publicHalls.slice(0, 4);

    return `
      <div class="flex flex-col w-full bg-surface">
        
        <!-- Owner Quick Gateway Banner -->
        <aside class="w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop pt-4" id="role-gateway-modal">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-container-low py-2 px-4 rounded-xl border border-outline">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-secondary shrink-0 animate-pulse"></span>
              <p class="font-body-sm text-xs text-on-surface-variant">
                <strong class="text-on-surface">Banquet or Hall Owner?</strong> Reach verified wedding families and event planners directly.
              </p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <button class="font-label-sm text-xs uppercase font-bold text-secondary hover:text-secondary-container flex items-center gap-1" onclick="Modals.openAddHallWizard()">
                <span>List Your Hall</span>
                <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
              <button class="text-on-surface-variant hover:text-on-surface p-1 rounded-md" onclick="document.getElementById('role-gateway-modal').style.display='none'" aria-label="Dismiss banner">
                <span class="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- 1. HERO SECTION & PREMIUM SEARCH CONSOLE -->
        <section class="relative w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop pt-8 md:pt-14 pb-12 md:pb-20">
          
          <!-- Hero Text Content -->
          <div class="text-center max-w-2xl mx-auto mb-8 md:mb-12">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full border border-outline mb-4">
              <span class="material-symbols-outlined text-secondary text-[16px]">verified</span>
              <span class="font-label-sm text-xs font-semibold text-on-surface uppercase tracking-wider">Curated & Audited Premier Venues</span>
            </div>
            <h1 class="font-display-lg text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-on-surface tracking-tight leading-tight font-serif">
              Find the Perfect Hall for Your <span class="text-secondary italic">Perfect Event</span>
            </h1>
            <p class="font-body-lg text-sm sm:text-base md:text-lg text-on-surface-variant mt-3 max-w-xl mx-auto leading-relaxed">
              Discover luxury wedding palaces, party banquets, and function spaces with verified shift availability, transparent pricing, and instant holds.
            </p>
          </div>


          <!-- Themed AI Venue Concierge Chat (Directly inside Hero - Replaces boxed console) -->
          <div id="ai-chat-section" class="max-w-4xl mx-auto relative mt-6">
            
            <!-- Soft Warm Ambient Glow Behind the Card -->
            <div class="absolute -inset-2 rounded-3xl bg-gradient-to-r from-secondary/15 via-amber-400/10 to-orange-300/10 blur-2xl -z-10 opacity-70 pointer-events-none"></div>

            <!-- Main Luxury Glassmorphic Card (Matches Website Aesthetic) -->
            <div class="relative rounded-3xl bg-white/95 backdrop-blur-2xl text-on-surface p-5 sm:p-8 md:p-10 border border-secondary/25 shadow-[0_20px_50px_rgba(166,91,43,0.08),0_4px_16px_rgba(17,24,39,0.04)] overflow-hidden">
              
              <!-- Subtle Inner Radial Highlight -->
              <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-secondary/8 via-transparent to-transparent rounded-full pointer-events-none -z-0"></div>

              <!-- Interactive Mouse Glow -->
              <div id="ai-mouse-glow" class="absolute w-[24rem] h-[24rem] rounded-full pointer-events-none z-0 opacity-0 transition-opacity duration-300 bg-gradient-to-r from-secondary/15 via-amber-300/15 to-orange-200/10 blur-[70px]" style="transform: translate(-50%, -50%);"></div>

              <div class="w-full relative z-10 space-y-6">
                
                <!-- Card Header -->
                <div class="text-center space-y-2">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-xs font-bold text-secondary tracking-wide uppercase">
                    <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                    <span>AI Venue Concierge</span>
                  </div>
                  <h2 class="text-2xl sm:text-3xl md:text-4xl font-serif text-on-surface font-semibold tracking-tight">
                    How can I help plan your event today?
                  </h2>
                  <p class="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
                    Type a command like <span class="px-1.5 py-0.5 rounded bg-surface-container font-mono text-secondary font-bold text-[11px]">/wedding</span>, <span class="px-1.5 py-0.5 rounded bg-surface-container font-mono text-secondary font-bold text-[11px]">/ac</span>, <span class="px-1.5 py-0.5 rounded bg-surface-container font-mono text-secondary font-bold text-[11px]">/lawn</span>, or speak your event requirements in natural English
                  </p>
                </div>

                <!-- Chat Input Container -->
                <div class="relative bg-surface-container-lowest rounded-2xl border-2 border-outline hover:border-secondary/40 focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/10 transition-all shadow-sm">
                  
                  <!-- Floating Command Palette -->
                  <div id="ai-cmd-palette" class="hidden absolute left-3 right-3 bottom-full mb-2 bg-white/98 backdrop-blur-2xl rounded-2xl z-50 shadow-2xl border border-outline overflow-hidden">
                    <div class="p-2 divide-y divide-outline/50 max-h-60 overflow-y-auto" id="ai-cmd-items"></div>
                  </div>

                  <!-- Textarea -->
                  <div class="p-3 sm:p-4">
                    <textarea
                      id="ai-chat-input"
                      rows="1"
                      placeholder="Ask VenueLuxe AI Concierge about hall pricing, guest capacities, AC options, or say 'AC hall in Karkala for 800 guests'..."
                      class="w-full px-2 py-1 resize-none bg-transparent border-none text-on-surface text-sm sm:text-base font-medium focus:outline-none placeholder:text-on-surface-variant/40 min-h-[58px] max-h-[180px]"
                      style="overflow: hidden;"
                    ></textarea>
                  </div>

                  <!-- Bottom Bar Controls -->
                  <div class="p-3 sm:p-3.5 border-t border-outline bg-surface-container-low/40 rounded-b-2xl flex items-center justify-between gap-3">
                    <div class="flex items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        id="ai-mic-btn"
                        title="Voice Search (Speak requirements)"
                        onclick="LandingView.startVoiceSearch()"
                        class="p-2 text-on-surface-variant hover:text-secondary rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        <span class="material-symbols-outlined text-[20px]">mic</span>
                      </button>
                      <button
                        type="button"
                        data-command-button
                        id="ai-cmd-btn"
                        title="Venue command shortcuts (/)"
                        onclick="LandingView.toggleCommandPalette()"
                        class="p-2 text-on-surface-variant hover:text-secondary rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        <span class="material-symbols-outlined text-[20px]">terminal</span>
                      </button>
                      <button
                        type="button"
                        id="ai-settings-btn"
                        title="AI Voice Models & Search Settings"
                        onclick="if(window.aiConcierge) window.aiConcierge.openSettingsModal();"
                        class="p-2 text-on-surface-variant hover:text-secondary rounded-xl hover:bg-surface-container transition-colors cursor-pointer"
                      >
                        <span class="material-symbols-outlined text-[20px]">tune</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      id="ai-send-btn"
                      onclick="LandingView.handleSendAIChat()"
                      class="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 bg-primary hover:bg-secondary text-white shadow-md shadow-primary/10 active:scale-[0.98] cursor-pointer"
                    >
                      <span id="ai-send-spinner" class="hidden material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                      <span id="ai-send-icon" class="material-symbols-outlined text-[16px]">send</span>
                      <span>Send</span>
                    </button>
                  </div>
                </div>

                <!-- Quick Command Suggestion Pills -->
                <div class="flex flex-wrap items-center justify-center gap-2" id="ai-command-pills">
                  <button type="button" onclick="LandingView.applyCommandPill('/wedding AC hall in Karkala for 800 guests')" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface-container rounded-full text-xs font-semibold text-on-surface hover:text-secondary transition-all border border-outline hover:border-secondary shadow-2xs cursor-pointer">
                    <span class="material-symbols-outlined text-[15px] text-secondary">favorite</span>
                    <span>Wedding in Karkala</span>
                  </button>
                  <button type="button" onclick="LandingView.applyCommandPill('/lawn Outdoor seaside lawn in Mangalore for reception')" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface-container rounded-full text-xs font-semibold text-on-surface hover:text-secondary transition-all border border-outline hover:border-secondary shadow-2xs cursor-pointer">
                    <span class="material-symbols-outlined text-[15px] text-tertiary">nature_people</span>
                    <span>Seaside Party Lawn</span>
                  </button>
                  <button type="button" onclick="LandingView.applyCommandPill('/budget Banquet hall under ₹50,000 for 250 guests')" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface-container rounded-full text-xs font-semibold text-on-surface hover:text-secondary transition-all border border-outline hover:border-secondary shadow-2xs cursor-pointer">
                    <span class="material-symbols-outlined text-[15px] text-amber-600">payments</span>
                    <span>Banquet under ₹50,000</span>
                  </button>
                  <button type="button" onclick="LandingView.applyCommandPill('/ac Centrally AC Convention center in Udupi')" class="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-surface-container rounded-full text-xs font-semibold text-on-surface hover:text-secondary transition-all border border-outline hover:border-secondary shadow-2xs cursor-pointer">
                    <span class="material-symbols-outlined text-[15px] text-cyan-600">ac_unit</span>
                    <span>Central AC Convention</span>
                  </button>
                </div>

                <!-- Thinking Indicator -->
                <div id="ai-thinking-pill" class="hidden flex items-center justify-center pt-2">
                  <div class="backdrop-blur-xl bg-white border border-secondary/30 rounded-full px-4 py-2 shadow-md flex items-center gap-2.5">
                    <div class="w-6 h-6 rounded-full bg-secondary/15 flex items-center justify-center text-center">
                      <span class="material-symbols-outlined text-[14px] text-secondary">sparkles</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs font-semibold text-on-surface">
                      <span>Thinking</span>
                      <div class="flex items-center ml-0.5">
                        <span class="w-1.5 h-1.5 bg-secondary rounded-full mx-0.5 animate-typing-1"></span>
                        <span class="w-1.5 h-1.5 bg-secondary rounded-full mx-0.5 animate-typing-2"></span>
                        <span class="w-1.5 h-1.5 bg-secondary rounded-full mx-0.5 animate-typing-3"></span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Live Recommendations Box -->
                <div id="ai-recommendations-box" class="hidden pt-2 space-y-4"></div>

              </div>
            </div>
          </div>
        </section>

        <!-- 3. POPULAR CATEGORIES SECTION -->
        <section class="w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-10 md:py-16">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-3">
            <div>
              <span class="font-label-md text-xs uppercase tracking-wider text-secondary font-bold">Categories</span>
              <h2 class="font-headline-lg text-2xl md:text-3xl text-on-surface mt-1 font-serif">Browse by Celebration Type</h2>
              <p class="text-xs md:text-sm text-on-surface-variant mt-1">Explore dedicated spaces tailored to your gathering size and traditions.</p>
            </div>
            <a class="inline-flex items-center gap-1 font-label-md text-xs font-bold text-on-surface hover:text-secondary transition-colors uppercase tracking-wider shrink-0" href="#/search">
              <span>View All Venues</span>
              <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
            </a>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            
            <a class="group bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline hover:border-secondary hover:shadow-md transition-all flex flex-col justify-between" href="#/search">
              <div class="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-[22px]">castle</span>
              </div>
              <div class="mt-4">
                <h3 class="font-title-md text-sm md:text-base text-on-surface font-bold group-hover:text-secondary transition-colors">Wedding Halls</h3>
                <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">140+ Grand palaces & mandaps</p>
              </div>
            </a>

            <a class="group bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline hover:border-secondary hover:shadow-md transition-all flex flex-col justify-between" href="#/search">
              <div class="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-[22px]">dinner_dining</span>
              </div>
              <div class="mt-4">
                <h3 class="font-title-md text-sm md:text-base text-on-surface font-bold group-hover:text-secondary transition-colors">Reception Banquets</h3>
                <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">110+ Dedicated dining halls</p>
              </div>
            </a>

            <a class="group bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline hover:border-secondary hover:shadow-md transition-all flex flex-col justify-between" href="#/search">
              <div class="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-[22px]">park</span>
              </div>
              <div class="mt-4">
                <h3 class="font-title-md text-sm md:text-base text-on-surface font-bold group-hover:text-secondary transition-colors">Lawns & Resorts</h3>
                <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">35+ Open-air twilight banquets</p>
              </div>
            </a>

            <a class="group bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline hover:border-secondary hover:shadow-md transition-all flex flex-col justify-between" href="#/search">
              <div class="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white transition-colors">
                <span class="material-symbols-outlined text-[22px]">domain</span>
              </div>
              <div class="mt-4">
                <h3 class="font-title-md text-sm md:text-base text-on-surface font-bold group-hover:text-secondary transition-colors">Convention Centers</h3>
                <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">28+ Multi-thousand expo spaces</p>
              </div>
            </a>

          </div>
        </section>

        <!-- 3. FEATURED VENUES (4 Cols Desktop, 2 Tablet, 1 Mobile) -->
        <section class="w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-10 md:py-16">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-3">
            <div>
              <span class="font-label-md text-xs uppercase tracking-wider text-secondary font-bold">Featured Venues</span>
              <h2 class="font-headline-lg text-2xl md:text-3xl text-on-surface mt-1 font-serif">Explore Premier Halls Near You</h2>
              <p class="text-xs md:text-sm text-on-surface-variant mt-1">Verified properties with clear sightlines and live shift holds.</p>
            </div>
            <a class="inline-flex items-center gap-1.5 font-label-md text-xs font-bold text-on-surface hover:text-secondary transition-colors uppercase tracking-wider" href="#/search">
              <span class="material-symbols-outlined text-[16px]">map</span>
              <span>Interactive Map View</span>
            </a>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            ${featuredHalls.map(hall => {
              const isFav = window.appStore.isFavorite(hall.id);
              const fallbackUrl = window.appStore.getPlaceholderImage(hall.name);
              return `
                <div class="group bg-surface-container-lowest rounded-xl border border-outline shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                  
                  <!-- Cover Image with Fallback & Badges -->
                  <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container cursor-pointer" onclick="window.location.hash='#/hall/${hall.id}'">
                    <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.cover_image}" alt="${hall.name}" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                    
                    <button class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur ${isFav ? 'text-secondary' : 'text-on-surface-variant'} hover:text-secondary flex items-center justify-center transition-colors shadow-sm z-10" onclick="event.stopPropagation(); window.appStore.toggleFavorite('${hall.id}'); LandingView.updateFavorites();" title="Save Hall">
                      <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${isFav ? '1' : '0'};">favorite</span>
                    </button>

                    <!-- Availability Badge (Non-color reliant) -->
                    <div class="absolute bottom-2 left-2 flex items-center gap-1.5">
                      ${hall.public_availability ? `
                        <span class="px-2 py-0.5 rounded bg-status-available-bg text-status-available text-[10px] font-bold flex items-center gap-1 border border-status-available-border shadow-sm">
                          <span class="w-1.5 h-1.5 rounded-full bg-status-available animate-pulse"></span>
                          <span>Available</span>
                        </span>
                      ` : `
                        <span class="px-2 py-0.5 rounded bg-status-pending-bg text-status-pending text-[10px] font-bold flex items-center gap-1 border border-status-pending-border shadow-sm">
                          <span class="w-1.5 h-1.5 rounded-full bg-status-pending"></span>
                          <span>Private Calendar</span>
                        </span>
                      `}
                    </div>
                  </div>

                  <!-- Details Container -->
                  <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div class="space-y-1">
                      <div class="flex items-center justify-between text-on-surface-variant font-body-sm text-xs">
                        <span>${hall.city} • ${hall.distance_km} km away</span>
                        <span class="flex items-center gap-0.5 text-on-surface font-bold">
                          <span class="material-symbols-outlined text-[15px] text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>
                          ${hall.rating || 4.9}
                        </span>
                      </div>

                      <h3 class="font-title-md text-sm md:text-base font-bold text-on-surface group-hover:text-secondary transition-colors line-clamp-1 cursor-pointer" onclick="window.location.hash='#/hall/${hall.id}'">
                        ${hall.name}
                      </h3>

                      <p class="font-body-sm text-xs text-on-surface-variant">
                        Seats ${hall.seating_capacity} • Max ${hall.maximum_capacity} Pax
                      </p>
                    </div>

                    <div class="pt-3 flex items-center justify-between border-t border-outline">
                      <div>
                        <span class="font-title-md text-sm font-bold text-on-surface">₹${hall.pricing ? hall.pricing.evening.toLocaleString() : '75,000'}</span>
                        <span class="font-body-sm text-[11px] text-on-surface-variant"> /shift</span>
                      </div>
                      <div class="flex items-center gap-1">
                        <button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" onclick="Modals.openShareModal('${hall.id}')" title="Share">
                          <span class="material-symbols-outlined text-[16px]">share</span>
                        </button>
                        <a class="px-3 py-1.5 bg-primary text-white hover:bg-inverse-surface rounded-lg font-label-md text-xs uppercase tracking-wider transition-colors font-bold" href="#/hall/${hall.id}">
                          View Venue
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </section>

        <!-- 4. DIRECT BOOKING VS BESPOKE ENQUIRY (Two-Card Comparison) -->
        <section class="w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-10 md:py-16">
          <div class="bg-surface-container rounded-2xl p-6 md:p-10 border border-outline">
            <div class="max-w-xl mb-8">
              <span class="font-label-md text-xs uppercase tracking-wider text-secondary font-bold">Booking Options</span>
              <h2 class="font-headline-lg text-2xl md:text-3xl text-on-surface mt-1 font-serif">Two Ways to Secure Your Hall</h2>
              <p class="font-body-md text-xs md:text-sm text-on-surface-variant mt-1.5">
                Choose the booking flow that fits your planning stage: fixed dates or custom packages.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              
              <!-- Direct Booking Card -->
              <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline flex flex-col justify-between">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="w-10 h-10 rounded-lg bg-status-available-bg text-status-available flex items-center justify-center">
                      <span class="material-symbols-outlined text-[24px]">event_seat</span>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-status-available-bg text-status-available font-label-sm text-[10px] font-bold uppercase tracking-wider border border-status-available-border">Direct Slot Hold</span>
                  </div>
                  <h3 class="font-headline-sm text-base md:text-lg font-bold text-on-surface">When Your Date & Shift Are Fixed</h3>
                  <p class="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Lock in your wedding, reception, or corporate date directly against the hall's live master calendar.
                  </p>
                  <ul class="space-y-2 font-body-sm text-xs text-on-surface-variant pt-2">
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-status-available text-[16px]">check_circle</span>
                      <span>Instant 48-Hour slot hold pending owner sign-off</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-status-available text-[16px]">check_circle</span>
                      <span>Guaranteed fixed tariff protection</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-status-available text-[16px]">check_circle</span>
                      <span>Direct WhatsApp and owner contact receipt</span>
                    </li>
                  </ul>
                </div>
                <div class="mt-6 pt-4 border-t border-outline flex items-center justify-between">
                  <span class="font-label-sm text-xs text-on-surface font-semibold">Best for: Known Event Dates</span>
                  <a class="font-label-sm text-xs uppercase font-bold text-secondary flex items-center gap-1 hover:underline" href="#/search">
                    <span>Explore Halls</span>
                    <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </a>
                </div>
              </div>

              <!-- Custom Enquiry Card -->
              <div class="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline flex flex-col justify-between">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
                      <span class="material-symbols-outlined text-[24px]">mark_chat_unread</span>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] font-bold uppercase tracking-wider">Custom Enquiry</span>
                  </div>
                  <h3 class="font-headline-sm text-base md:text-lg font-bold text-on-surface">When You Need Walkthroughs & Custom Quotes</h3>
                  <p class="font-body-md text-xs text-on-surface-variant leading-relaxed">
                    Connect directly with venue managers to arrange physical visits, food tastings, and multi-day packages.
                  </p>
                  <ul class="space-y-2 font-body-sm text-xs text-on-surface-variant pt-2">
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Free on-site walkthrough scheduling</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Custom multi-day wedding negotiations</span>
                    </li>
                    <li class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                      <span>Direct phone and WhatsApp assistance</span>
                    </li>
                  </ul>
                </div>
                <div class="mt-6 pt-4 border-t border-outline flex items-center justify-between">
                  <span class="font-label-sm text-xs text-on-surface font-semibold">Best for: Tours & Negotiations</span>
                  <a class="font-label-sm text-xs uppercase font-bold text-secondary flex items-center gap-1 hover:underline" href="#/search">
                    <span>Contact Venues</span>
                    <span class="material-symbols-outlined text-[15px]">arrow_forward</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- 5. HOW IT WORKS -->
        <section class="w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-10 md:py-16" id="how-it-works">
          <div class="text-center max-w-xl mx-auto mb-8 md:mb-12">
            <span class="font-label-md text-xs uppercase tracking-wider text-secondary font-bold">Simple Process</span>
            <h2 class="font-headline-lg text-2xl md:text-3xl text-on-surface font-serif mt-1">How VenueLuxe Works</h2>
            <p class="font-body-md text-xs md:text-sm text-on-surface-variant mt-1.5">Straightforward workflows for celebration hosts and hall proprietors.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            <!-- Customer Steps -->
            <div class="p-6 bg-surface-container-lowest rounded-xl border border-outline space-y-4">
              <div class="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <span class="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</span>
                <span>For Customers & Families</span>
              </div>
              <ol class="space-y-3 text-xs text-on-surface-variant">
                <li class="flex gap-2.5">
                  <span class="font-bold text-on-surface shrink-0">1.</span>
                  <div><strong class="text-on-surface">Search & Filter:</strong> Find halls by city, guest capacity, shift tariff, and AC facilities.</div>
                </li>
                <li class="flex gap-2.5">
                  <span class="font-bold text-on-surface shrink-0">2.</span>
                  <div><strong class="text-on-surface">Review Specifications:</strong> Check pillarless sightlines, stage sizes, dining capacity, and parking.</div>
                </li>
                <li class="flex gap-2.5">
                  <span class="font-bold text-on-surface shrink-0">3.</span>
                  <div><strong class="text-on-surface">Check Live Shifts:</strong> View availability across Morning, Afternoon, Evening, Night, and Full Day slots.</div>
                </li>
                <li class="flex gap-2.5">
                  <span class="font-bold text-on-surface shrink-0">4.</span>
                  <div><strong class="text-on-surface">Hold or Inquire:</strong> Request an immediate 48-hour hold or chat with the venue manager on WhatsApp.</div>
                </li>
              </ol>
            </div>

            <!-- Owner Steps -->
            <div class="p-6 bg-surface-container-lowest rounded-xl border border-outline space-y-4">
              <div class="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-wider">
                <span class="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs">2</span>
                <span>For Hall Owners</span>
              </div>
              <ol class="space-y-3 text-xs text-on-surface-variant">
                <li class="flex gap-2.5">
                  <span class="font-bold text-on-surface shrink-0">1.</span>
                  <div><strong class="text-on-surface">List Your Hall:</strong> Add dimensions, dining seats, parking slots, photos, and shift pricing.</div>
                </li>
                <li class="flex gap-2.5">
                  <span class="font-bold text-on-surface shrink-0">2.</span>
                  <div><strong class="text-on-surface">Admin Verification:</strong> Our platform verifies property compliance and certificates before going live.</div>
                </li>
                <li class="flex gap-2.5">
                  <span class="font-bold text-on-surface shrink-0">3.</span>
                  <div><strong class="text-on-surface">Privacy Controls:</strong> Toggle public calendar availability and contact visibility at any time.</div>
                </li>
                <li class="flex gap-2.5">
                  <span class="font-bold text-on-surface shrink-0">4.</span>
                  <div><strong class="text-on-surface">Manage Requests:</strong> Accept, confirm, or manage incoming booking holds with zero commission.</div>
                </li>
              </ol>
            </div>

          </div>
        </section>

        <!-- 6. TESTIMONIALS (3 Clean Cards) -->
        <section class="w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-10 md:py-16">
          <div class="text-center max-w-xl mx-auto mb-8">
            <span class="font-label-md text-xs uppercase tracking-wider text-secondary font-bold">Reviews</span>
            <h2 class="font-headline-lg text-2xl md:text-3xl text-on-surface font-serif mt-1">Trusted by Wedding Families</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-5 bg-surface-container-lowest rounded-xl border border-outline shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div class="flex text-secondary text-sm">★★★★★</div>
                <p class="font-body-sm text-xs text-on-surface mt-2 leading-relaxed italic">
                  "Booking The Grand Monarch Palace gave our family total peace of mind. Checking the 24-ft clear ceiling and 250-car parking beforehand saved us weeks of traveling for visits."
                </p>
              </div>
              <div class="pt-3 border-t border-outline flex items-center justify-between text-xs">
                <span class="font-bold text-on-surface">Anirudh & Deepa Rao</span>
                <span class="text-tertiary font-semibold flex items-center gap-0.5"><span class="material-symbols-outlined text-[14px]">verified</span> Verified Event</span>
              </div>
            </div>

            <div class="p-5 bg-surface-container-lowest rounded-xl border border-outline shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div class="flex text-secondary text-sm">★★★★★</div>
                <p class="font-body-sm text-xs text-on-surface mt-2 leading-relaxed italic">
                  "The live shift availability matrix is brilliant. We saw that Saturday evening was already booked, so we grabbed Sunday morning instantly for our muhurtham ceremony."
                </p>
              </div>
              <div class="pt-3 border-t border-outline flex items-center justify-between text-xs">
                <span class="font-bold text-on-surface">Suresh Bhat</span>
                <span class="text-tertiary font-semibold flex items-center gap-0.5"><span class="material-symbols-outlined text-[14px]">verified</span> Verified Event</span>
              </div>
            </div>

            <div class="p-5 bg-surface-container-lowest rounded-xl border border-outline shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <div class="flex text-secondary text-sm">★★★★★</div>
                <p class="font-body-sm text-xs text-on-surface mt-2 leading-relaxed italic">
                  "As a hall owner in Karkala, the streamlined listing engine and private calendar toggle allow me full control over my bookings and direct customer calls without high commissions."
                </p>
              </div>
              <div class="pt-3 border-t border-outline flex items-center justify-between text-xs">
                <span class="font-bold text-on-surface">Vikram Hegde</span>
                <span class="text-secondary font-semibold">Hall Proprietor</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 7. FREQUENTLY ASKED QUESTIONS (Accordion with Chevrons) -->
        <section class="w-full max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-10 md:py-16 pb-20">
          <div class="text-center max-w-xl mx-auto mb-8">
            <span class="font-label-md text-xs uppercase tracking-wider text-secondary font-bold">Help & FAQ</span>
            <h2 class="font-headline-lg text-2xl md:text-3xl text-on-surface font-serif mt-1">Frequently Asked Questions</h2>
          </div>

          <div class="max-w-3xl mx-auto space-y-3">
            <details class="p-4 bg-surface-container-lowest rounded-xl border border-outline group cursor-pointer">
              <summary class="font-title-md text-xs md:text-sm font-bold text-on-surface flex items-center justify-between list-none">
                <span>How does shift booking work? Can another customer book the same date?</span>
                <span class="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">expand_more</span>
              </summary>
              <p class="text-xs text-on-surface-variant mt-2.5 leading-relaxed">
                VenueLuxe divides daily availability into 5 standard shift blocks: Morning (7 AM – 2 PM), Afternoon (12 PM – 4 PM), Evening (4 PM – 11 PM), Night (7 PM – 1 AM), and Full Day (24 hrs). Once a booking is confirmed by the hall owner, the slot is locked to prevent double-booking.
              </p>
            </details>

            <details class="p-4 bg-surface-container-lowest rounded-xl border border-outline group cursor-pointer">
              <summary class="font-title-md text-xs md:text-sm font-bold text-on-surface flex items-center justify-between list-none">
                <span>Can hall owners keep their availability calendar private?</span>
                <span class="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">expand_more</span>
              </summary>
              <p class="text-xs text-on-surface-variant mt-2.5 leading-relaxed">
                Yes! When listing or editing a hall, owners can turn off public calendar availability. When turned off, visitors see a "Contact owner for availability" notice with inquiry and WhatsApp actions.
              </p>
            </details>

            <details class="p-4 bg-surface-container-lowest rounded-xl border border-outline group cursor-pointer">
              <summary class="font-title-md text-xs md:text-sm font-bold text-on-surface flex items-center justify-between list-none">
                <span>Why does a newly submitted hall show 'Pending Approval'?</span>
                <span class="material-symbols-outlined group-open:rotate-180 transition-transform text-on-surface-variant">expand_more</span>
              </summary>
              <p class="text-xs text-on-surface-variant mt-2.5 leading-relaxed">
                To guarantee safety, guest capacity ratings, and verified ownership, every submitted hall is checked by Super Admin before being published to public search.
              </p>
            </details>
          </div>
        </section>

      </div>
    `;
  },

  setCity(cityName) {
    const input = document.getElementById('hero-location-input');
    if (input) input.value = `${cityName}, Karnataka`;
  },

  useMyLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const input = document.getElementById('hero-location-input');
          if (input) input.value = 'Karkala (Current Geolocation)';
          Toast.success('Location Detected', 'Set search coordinates to your location.');
        },
        (err) => {
          Toast.info('Location Access', 'Defaulted to Karkala & Mangalore Coastal Region.');
        }
      );
    } else {
      Toast.info('Geolocation', 'Browser does not support geolocation.');
    }
  },

  performHeroSearch() {
    const loc = document.getElementById('hero-location-input')?.value || '';
    const occ = document.getElementById('hero-event-type')?.value || '';
    const date = document.getElementById('hero-date')?.value || '';

    sessionStorage.setItem('search_filter_location', loc);
    sessionStorage.setItem('search_filter_occasion', occ);
    sessionStorage.setItem('search_filter_date', date);

    window.location.hash = '#/search';
  },

  submitAIVoiceQuery() {
    const input = document.getElementById('hero-ai-voice-input');
    const text = input ? input.value.trim() : '';

    if (!text) {
      if (window.AIChatWidget) {
        window.AIChatWidget.startVoiceCommand();
      }
      return;
    }

    if (window.AIChatWidget) {
      window.AIChatWidget.openWithQuery(text);
    }
  },

  runVoiceSuggestion(text) {
    const input = document.getElementById('hero-ai-voice-input');
    if (input) input.value = text;
    this.submitAIVoiceQuery();
  },

  updateFavorites() {
    const badge = document.getElementById('saved-count-badge');
    if (badge) badge.innerText = window.appStore.getFavorites().length;
    const container = document.getElementById('app-content');
    if (container && window.location.hash === '#/') {
      container.innerHTML = LandingView.render();
      if (LandingView.postRender) LandingView.postRender();
    }
  },

  aiState: {
    isTyping: false,
    activeSuggestion: -1,
    showCommandPalette: false,
    commands: [
      { prefix: '/wedding', label: 'Wedding Halls', desc: 'Grand AC wedding halls with mandap & dining', icon: 'favorite' },
      { prefix: '/ac', label: 'Central AC Halls', desc: 'Climate-controlled halls with backup power', icon: 'ac_unit' },
      { prefix: '/lawn', label: 'Outdoor Lawns', desc: 'Open-air lush party lawns & seaside venues', icon: 'nature_people' },
      { prefix: '/budget', label: 'Budget Friendly', desc: 'Top verified halls under ₹1,00,000 per shift', icon: 'payments' },
      { prefix: '/reception', label: 'Reception Banquets', desc: 'Evening cocktail & banquet celebration spaces', icon: 'celebration' },
      { prefix: '/dining', label: 'Dining & Kitchen', desc: 'Dedicated veg/non-veg kitchen & dining pavilions', icon: 'restaurant' },
      { prefix: '/convention', label: 'Convention Auditoriums', desc: 'Large 1,000+ guest auditoriums with acoustic staging', icon: 'theater_comedy' }
    ]
  },

  postRender() {
    this.initAIChatListeners();
  },

  initAIChatListeners() {
    const textarea = document.getElementById('ai-chat-input');
    const glow = document.getElementById('ai-mouse-glow');
    const chatSection = document.getElementById('ai-chat-section');

    if (textarea) {
      textarea.addEventListener('input', () => {
        textarea.style.height = '60px';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        const val = textarea.value;
        if (val.startsWith('/') && !val.includes(' ')) {
          this.toggleCommandPalette(true);
        } else {
          this.toggleCommandPalette(false);
        }
      });

      textarea.addEventListener('focus', () => {
        if (glow) glow.style.opacity = '0.35';
      });

      textarea.addEventListener('blur', () => {
        if (glow) glow.style.opacity = '0';
      });

      textarea.addEventListener('keydown', (e) => this.handleAIChatKeyDown(e));
    }

    if (chatSection && glow) {
      chatSection.addEventListener('mousemove', (e) => {
        const rect = chatSection.getBoundingClientRect();
        glow.style.left = (e.clientX - rect.left) + 'px';
        glow.style.top = (e.clientY - rect.top) + 'px';
      });
    }

    // Close command palette on click outside
    document.addEventListener('click', (e) => {
      const palette = document.getElementById('ai-cmd-palette');
      const btn = document.getElementById('ai-cmd-btn');
      if (palette && !palette.contains(e.target) && !btn?.contains(e.target)) {
        this.toggleCommandPalette(false);
      }
    });

    this.renderCommandPalette();
  },

  toggleCommandPalette(force) {
    const palette = document.getElementById('ai-cmd-palette');
    if (!palette) return;
    const show = (typeof force === 'boolean') ? force : palette.classList.contains('hidden');
    if (show) {
      palette.classList.remove('hidden');
      this.aiState.showCommandPalette = true;
      this.renderCommandPalette();
    } else {
      palette.classList.add('hidden');
      this.aiState.showCommandPalette = false;
      this.aiState.activeSuggestion = -1;
    }
  },

  renderCommandPalette() {
    const container = document.getElementById('ai-cmd-items');
    if (!container) return;
    const input = document.getElementById('ai-chat-input');
    const query = input ? input.value.trim().toLowerCase() : '';

    const matches = this.aiState.commands.filter(cmd => {
      if (!query.startsWith('/')) return true;
      return cmd.prefix.toLowerCase().startsWith(query);
    });

    if (matches.length === 0) {
      container.innerHTML = `<div class="px-3 py-2 text-xs text-on-surface-variant/60">No matching commands found</div>`;
      return;
    }

    container.innerHTML = matches.map((cmd, idx) => `
      <div
        class="flex items-center gap-2.5 px-3 py-2 text-xs transition-colors cursor-pointer rounded-xl ${idx === this.aiState.activeSuggestion ? 'bg-secondary/15 text-secondary font-bold' : 'text-on-surface hover:bg-surface-container'}"
        onclick="LandingView.selectCommand('${cmd.prefix}')"
      >
        <div class="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
          <span class="material-symbols-outlined text-[15px]">${cmd.icon}</span>
        </div>
        <div class="font-semibold text-on-surface">${cmd.label}</div>
        <div class="text-secondary text-[11px] font-mono font-bold">${cmd.prefix}</div>
        <div class="text-on-surface-variant/70 text-[11px] ml-auto hidden sm:block">${cmd.desc}</div>
      </div>
    `).join('');
  },

  handleAIChatKeyDown(e) {
    const palette = document.getElementById('ai-cmd-palette');
    const isPaletteOpen = palette && !palette.classList.contains('hidden');

    if (isPaletteOpen) {
      const count = this.aiState.commands.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.aiState.activeSuggestion = (this.aiState.activeSuggestion + 1) % count;
        this.renderCommandPalette();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.aiState.activeSuggestion = (this.aiState.activeSuggestion - 1 + count) % count;
        this.renderCommandPalette();
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (this.aiState.activeSuggestion >= 0 && this.aiState.activeSuggestion < count) {
          e.preventDefault();
          const chosen = this.aiState.commands[this.aiState.activeSuggestion];
          this.selectCommand(chosen.prefix);
          return;
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        this.toggleCommandPalette(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSendAIChat();
    }
  },

  selectCommand(prefix) {
    const textarea = document.getElementById('ai-chat-input');
    if (textarea) {
      textarea.value = prefix + ' ';
      textarea.focus();
      textarea.style.height = '60px';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
    this.toggleCommandPalette(false);
  },

  applyCommandPill(promptText) {
    const textarea = document.getElementById('ai-chat-input');
    if (textarea) {
      textarea.value = promptText;
      textarea.style.height = '60px';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
      this.handleSendAIChat();
    }
  },

  startVoiceSearch() {
    const micBtn = document.getElementById('ai-mic-btn');
    const textarea = document.getElementById('ai-chat-input');

    if (!window.aiConcierge) {
      if (window.Toast) window.Toast.info('AI Concierge', 'Initializing AI engine, please wait...');
      return;
    }

    if (window.aiConcierge.isListening) {
      window.aiConcierge.stopListening();
      if (micBtn) {
        micBtn.classList.remove('bg-red-600', 'text-white', 'animate-pulse');
        micBtn.innerHTML = '<span class="material-symbols-outlined text-[19px]">mic</span>';
      }
      return;
    }

    if (micBtn) {
      micBtn.classList.add('bg-red-600', 'text-white', 'animate-pulse');
      micBtn.innerHTML = '<span class="material-symbols-outlined text-[19px]">stop_circle</span>';
      micBtn.title = 'Click to finish recording';
    }

    if (textarea) {
      textarea.placeholder = '🎙️ Listening to your voice... Speak your venue, location, guests, and budget.';
    }

    if (window.Toast) {
      const config = window.aiConcierge.getSettings();
      const engineName = config.sttEngine === 'elevenlabs_scribe' ? 'ElevenLabs Scribe AI' : 'Browser Web Speech';
      window.Toast.info(`🎙️ ${engineName}`, 'Speak now! Click the red button when done speaking.');
    }

    window.aiConcierge.startListening({
      onListening: (msg) => {
        if (textarea && !textarea.value) {
          textarea.placeholder = msg || '🎙️ Speak now: e.g. "AC wedding hall in Karkala for 800 guests"...';
        }
      },
      onInterim: (text) => {
        if (textarea) {
          textarea.value = text;
          textarea.style.height = '60px';
          textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        }
      },
      onFinal: (finalText) => {
        if (micBtn) {
          micBtn.classList.remove('bg-red-600', 'text-white', 'animate-pulse');
          micBtn.innerHTML = '<span class="material-symbols-outlined text-[19px]">mic</span>';
          micBtn.title = 'Voice Command';
        }
        if (textarea) {
          textarea.value = finalText;
          textarea.style.height = '60px';
          textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
        }
        this.handleSendAIChat();
      },
      onError: (err) => {
        if (micBtn) {
          micBtn.classList.remove('bg-red-600', 'text-white', 'animate-pulse');
          micBtn.innerHTML = '<span class="material-symbols-outlined text-[19px]">mic</span>';
          micBtn.title = 'Voice Command';
        }
        if (textarea && !textarea.value) {
          textarea.placeholder = "Ask VenueLuxe AI Concierge about hall pricing, guest capacities, AC options, or say 'AC hall in Karkala for 800 guests'...";
        }
        if (window.Toast) window.Toast.warning('Voice Input Note', err);
      },
      onEnd: () => {
        if (micBtn) {
          micBtn.classList.remove('bg-red-600', 'text-white', 'animate-pulse');
          micBtn.innerHTML = '<span class="material-symbols-outlined text-[19px]">mic</span>';
          micBtn.title = 'Voice Command';
        }
        if (textarea && !textarea.value) {
          textarea.placeholder = "Ask VenueLuxe AI Concierge about hall pricing, guest capacities, AC options, or say 'AC hall in Karkala for 800 guests'...";
        }
      }
    });
  },

  handleSendAIChat() {
    const textarea = document.getElementById('ai-chat-input');
    const query = textarea ? textarea.value.trim() : '';
    if (!query) return;

    const sendBtn = document.getElementById('ai-send-btn');
    const sendSpinner = document.getElementById('ai-send-spinner');
    const sendIcon = document.getElementById('ai-send-icon');
    const thinkingPill = document.getElementById('ai-thinking-pill');
    const resultsBox = document.getElementById('ai-recommendations-box');

    // UI Loading State
    if (sendBtn) sendBtn.disabled = true;
    if (sendSpinner) sendSpinner.classList.remove('hidden');
    if (sendIcon) sendIcon.classList.add('hidden');
    if (thinkingPill) thinkingPill.classList.remove('hidden');
    if (resultsBox) resultsBox.classList.add('hidden');

    setTimeout(() => {
      if (sendBtn) sendBtn.disabled = false;
      if (sendSpinner) sendSpinner.classList.add('hidden');
      if (sendIcon) sendIcon.classList.remove('hidden');
      if (thinkingPill) thinkingPill.classList.add('hidden');

      // Process query with NLP engine
      this.processAndShowRecommendations(query);
    }, 500);
  },

  async processAndShowRecommendations(queryText) {
    const resultsBox = document.getElementById('ai-recommendations-box');
    if (!resultsBox) return;

    let parsed = { location: null, occasion: null, guests: null, maxBudget: null, acOnly: false };
    let aiConciergeReply = null;

    if (window.aiConcierge) {
      parsed = await window.aiConcierge.parseQueryAsync(queryText);
    }

    // Try fetching conversational note from OpenRouter if available
    if (window.openrouterService && window.openrouterService.hasApiKey()) {
      try {
        const chatRes = await window.openrouterService.chatWithConcierge(queryText);
        if (chatRes && chatRes.reply) {
          aiConciergeReply = {
            text: chatRes.reply,
            model: chatRes.modelUsed || 'NVIDIA Nemotron 3.5 Lightning (Free)'
          };
        }
      } catch (e) {
        console.warn('OpenRouter concierge commentary notice:', e);
      }
    }

    // Only approved & live halls from public registry
    const allHalls = window.appStore.getPublicHalls();
    
    // Sort and rank listings using our AI multi-factor compatibility & ranking engine
    const sortMode = parsed.sortBy || 'ai_recommended';
    const rankedHalls = window.aiConcierge 
      ? window.aiConcierge.rankHallsWithAI(allHalls, parsed, sortMode)
      : allHalls;

    const matched = rankedHalls.filter(h => (h.compatibilityPercent || 50) >= 35).slice(0, 3);
    const displayHalls = matched.length > 0 ? matched : rankedHalls.slice(0, 3);

    // Prepare Spoken Audio Response
    let speechReplyText = '';
    if (aiConciergeReply && aiConciergeReply.text) {
      speechReplyText = aiConciergeReply.text;
    } else if (displayHalls.length > 0) {
      const topHall = displayHalls[0];
      const cityText = parsed.city ? ` in ${parsed.city}` : '';
      const sortLabel = parsed.sortBy === 'price_asc' ? ', sorted by lowest price' : (parsed.sortBy === 'rating' ? ', sorted by top customer rating' : (parsed.sortBy === 'capacity' ? ', sorted by highest capacity' : ''));
      speechReplyText = `I found ${displayHalls.length} verified venues${cityText}${sortLabel}. Top recommendation is ${topHall.name} with ${topHall.compatibilityPercent || 96}% compatibility.`;
    } else {
      speechReplyText = `I have searched the registry for your requirements. Here are the closest available verified venues.`;
    }

    // Vocalize Speech Response immediately
    if (window.aiConcierge && !window.aiConcierge.voiceMuted) {
      window.aiConcierge.speak(speechReplyText);
    }

    resultsBox.classList.remove('hidden');
    resultsBox.innerHTML = `
      <div class="bg-surface-container-lowest border border-secondary/20 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline pb-3">
          <div class="flex items-center gap-2 text-xs font-bold text-on-surface">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
            <span>Concierge Recommendations (${displayHalls.length} Curated Venues)</span>
          </div>
          <div class="flex items-center gap-1.5 flex-wrap text-[11px]">
            ${parsed.city ? `<span class="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold">📍 ${parsed.city}</span>` : ''}
            ${parsed.capacityMin ? `<span class="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold">👥 ${parsed.capacityMin}+ Guests</span>` : ''}
            ${parsed.maxPrice ? `<span class="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold">💰 ≤ ₹${parsed.maxPrice.toLocaleString('en-IN')}</span>` : ''}
            ${parsed.acType ? `<span class="px-2.5 py-0.5 rounded-full bg-secondary/15 text-secondary font-bold">❄️ ${parsed.acType}</span>` : ''}
          </div>
        </div>

        <!-- Luxury Concierge Advisory Note with Voice Playback Controls -->
        <div class="p-3.5 bg-gradient-to-r from-secondary/10 via-amber-500/5 to-transparent border border-secondary/25 rounded-xl flex items-start justify-between gap-3">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <span class="material-symbols-outlined text-[18px]">auto_awesome</span>
            </div>
            <div class="space-y-1 text-xs">
              <div class="flex items-center gap-2">
                <span class="font-bold text-on-surface font-serif">Concierge Voice Note</span>
                <span class="text-[10px] text-secondary font-mono font-bold bg-white/80 px-2 py-0.2 rounded-full border border-secondary/20">AI Audio Active</span>
              </div>
              <p class="text-on-surface-variant leading-relaxed font-medium">${speechReplyText}</p>
            </div>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button type="button" title="Replay voice audio" onclick="if(window.aiConcierge) window.aiConcierge.speak('${speechReplyText.replace(/'/g, "\\'")}');" class="p-1.5 rounded-lg text-secondary hover:bg-secondary/10 cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">volume_up</span>
            </button>
            <button type="button" title="Mute/Unmute speech" onclick="if(window.aiConcierge) { const m = window.aiConcierge.toggleVoiceMute(); this.querySelector('span').innerText = m ? 'volume_off' : 'volume_up'; if(window.Toast) window.Toast.info('Voice Audio', m ? 'AI voice muted' : 'AI voice unmuted'); }" class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface cursor-pointer">
              <span class="material-symbols-outlined text-[18px]">volume_up</span>
            </button>
          </div>
        </div>

        <!-- Ranked Listing Cards (Sorted by AI Compatibility) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          ${displayHalls.map(h => {
            const coverUrl = h.cover_image || (h.images && (h.images.main || Object.values(h.images)[0])) || window.appStore.getPlaceholderImage(h.name);
            const price = h.pricing ? (h.pricing.evening || h.pricing.morning) : 75000;
            const matchScore = h.compatibilityPercent || 95;
            return `
              <div class="bg-surface-container-low/40 border border-outline rounded-xl overflow-hidden hover:border-secondary hover:shadow-md transition-all flex flex-col justify-between group">
                <div class="relative h-36 w-full overflow-hidden bg-surface-container cursor-pointer" onclick="window.location.hash='#/hall/${h.id}'">
                  <img src="${coverUrl}" alt="${h.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.onerror=null;this.src='${window.appStore.getPlaceholderImage(h.name)}'">
                  <div class="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-surface/95 backdrop-blur-md text-[10px] font-bold text-secondary shadow-xs border border-secondary/20 flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px]">auto_awesome</span>
                    <span>${matchScore}% Match</span>
                  </div>
                  <div class="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-surface/90 backdrop-blur-md text-[10px] font-bold text-secondary shadow-xs flex items-center gap-0.5">
                    <span class="material-symbols-outlined text-[12px]">star</span>
                    <span>${h.rating || '4.9'}</span>
                  </div>
                </div>
                <div class="p-3.5 space-y-2.5">
                  <div>
                    <h4 class="font-bold text-sm text-on-surface line-clamp-1 font-serif cursor-pointer hover:text-secondary" onclick="window.location.hash='#/hall/${h.id}'">${h.name}</h4>
                    <p class="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                      <span class="material-symbols-outlined text-[13px] text-secondary">location_on</span>
                      <span>${h.city || 'Karnataka'} • ${h.ac_status || 'Central AC'}</span>
                    </p>
                  </div>
                  <div class="flex items-center justify-between text-xs text-on-surface-variant pt-2 border-t border-outline">
                    <span>Seats ${h.seating_capacity || 400} • Max ${h.maximum_capacity || 800}</span>
                    <span class="font-bold text-secondary text-sm">₹${price.toLocaleString('en-IN')}</span>
                  </div>
                  <a href="#/hall/${h.id}" class="block w-full py-2 text-center bg-primary hover:bg-secondary text-white font-bold rounded-lg text-xs transition-colors shadow-2xs">
                    View Hall Details
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="flex items-center justify-between pt-1 text-xs">
          <span class="text-on-surface-variant text-[11px]">Query: "${queryText}"</span>
          <button type="button" onclick="window.aiConcierge.applyFiltersToSearch(window.aiConcierge.parseQuery('${queryText.replace(/'/g, "\\'")}'))" class="text-secondary hover:underline font-bold flex items-center gap-1 cursor-pointer">
            <span>Explore all filtered venues in search</span>
            <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>
      </div>
    `;

    resultsBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
};

window.LandingView = LandingView;

