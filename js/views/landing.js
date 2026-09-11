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


          <!-- HERO DISCOVERY SEARCH CONSOLE -->
          <div class="max-w-5xl mx-auto bg-surface-container-lowest p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg border border-outline mt-6">
            <div class="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div class="md:col-span-4 p-2.5 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <label class="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1 font-semibold">
                  <span class="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                  <span>Location</span>
                </label>
                <input class="w-full bg-transparent text-on-surface font-title-md text-sm sm:text-base pt-1 focus:outline-none placeholder:text-on-surface-variant/60 font-semibold" id="hero-location-input" placeholder="City or neighborhood..." type="text" value="Karkala, Karnataka">
              </div>
              <div class="md:col-span-3 p-2.5 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <label class="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1 font-semibold">
                  <span class="material-symbols-outlined text-[16px] text-secondary">festival</span>
                  <span>Occasion</span>
                </label>
                <div class="relative">
                  <select id="hero-event-type" class="w-full bg-transparent text-on-surface font-title-md text-sm sm:text-base pt-1 focus:outline-none appearance-none cursor-pointer pr-6 font-semibold">
                    <option value="" selected>Wedding & Reception</option>
                    <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                    <option value="Corporate Summit">Corporate Summit</option>
                    <option value="Cultural Gathering">Cultural Gathering</option>
                  </select>
                  <span class="material-symbols-outlined text-on-surface-variant absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>
              <div class="md:col-span-3 p-2.5 px-3.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
                <label class="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-1 font-semibold">
                  <span class="material-symbols-outlined text-[16px] text-secondary">calendar_today</span>
                  <span>Event Date</span>
                </label>
                <input id="hero-date" class="w-full bg-transparent text-on-surface font-title-md text-sm sm:text-base pt-1 focus:outline-none cursor-pointer font-semibold" type="date">
              </div>
              <div class="md:col-span-2">
                <button type="button" onclick="LandingView.performHeroSearch()" class="w-full h-12 inline-flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-inverse-surface font-label-md text-xs uppercase tracking-wider rounded-xl shadow transition-all active:scale-[0.98] cursor-pointer">
                  <span class="material-symbols-outlined text-[18px]">search</span>
                  <span>Search</span>
                </button>
              </div>
            </div>
            
            <div class="mt-4 pt-3 border-t border-outline/50 flex flex-wrap items-center justify-between gap-3 text-on-surface-variant">
              <div class="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
                <span class="font-semibold text-on-surface-variant mr-1 shrink-0">Popular:</span>
                <button class="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer" onclick="LandingView.setSearchCity('Mangalore')" type="button">Mangalore</button>
                <button class="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer" onclick="LandingView.setSearchCity('Udupi')" type="button">Udupi</button>
                <button class="px-3 py-1 rounded-full bg-secondary text-white font-medium shadow-2xs cursor-pointer" onclick="LandingView.setSearchCity('Karkala')" type="button">Karkala</button>
                <button class="px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer" onclick="LandingView.setSearchCity('Bangalore')" type="button">Bangalore</button>
              </div>
              <div class="flex items-center gap-4 text-xs">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-emerald-600">verified</span>Verified Listings</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px] text-secondary">lock_clock</span>Zero Hidden Charges</span>
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

  setSearchCity(cityName) {
    const input = document.getElementById('hero-location-input');
    if (input) input.value = cityName;
    this.performHeroSearch();
  },

  updateFavorites() {
    const badge = document.getElementById('saved-count-badge');
    if (badge) badge.innerText = window.appStore.getFavorites().length;
    const container = document.getElementById('app-content');
    if (container && window.location.hash === '#/') {
      container.innerHTML = LandingView.render();
    }
  }
};

window.LandingView = LandingView;

