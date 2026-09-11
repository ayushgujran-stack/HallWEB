// Hall Details & Booking Experience
// Refined luxury presentation with accessible shift calendar, sticky desktop card & mobile bottom bar

const DetailsView = {
  currentHallId: null,
  selectedDate: '2025-11-20',
  selectedSlot: 'Evening (4PM - 11PM)',
  selectedPrice: 95000,
  activeBookingTab: 'direct', // 'direct' or 'enquiry'

  render(hallId) {
    this.currentHallId = hallId || 'hall-grand-monarch';
    const hall = window.appStore.getHallById(this.currentHallId) || window.appStore.getHalls()[0];
    this.currentHallId = hall.id;

    const reviews = window.appStore.getReviewsByHallId(hall.id);
    const isFav = window.appStore.isFavorite(hall.id);
    const fallbackUrl = window.appStore.getPlaceholderImage(hall.name);

    if (!this.selectedPrice && hall.pricing) {
      this.selectedPrice = hall.pricing.evening || 95000;
    }

    const amenitiesWithIcons = [
      { name: hall.ac_status || 'Central AC', icon: 'mode_fan' },
      { name: `${hall.dining_seats || 400} Seat Dining Pavilion`, icon: 'restaurant' },
      { name: 'Commercial Catering Kitchen', icon: 'kitchen' },
      { name: `${hall.parking_cars || 200}+ Cars & Valet`, icon: 'local_parking' },
      { name: hall.stage_dimensions || 'Elevated Teak Stage', icon: 'theater_comedy' },
      { name: `${hall.green_rooms || 3} Deluxe AC Green Suites`, icon: 'meeting_room' },
      { name: `${hall.generator_kva || '100 kVA'} Generator Backup`, icon: 'bolt' },
      { name: 'Wheelchair Ramp Access', icon: 'accessible' },
      { name: 'CCTV Security & Surveillance', icon: 'security' },
      { name: 'High-Speed Guest Wi-Fi', icon: 'wifi' }
    ];

    return `
      <div class="flex flex-col w-full bg-surface pb-24 lg:pb-12">
        
        <!-- Top Breadcrumb & Quick Actions Bar -->
        <section class="w-full bg-surface-container-lowest border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <nav class="flex items-center gap-1.5 font-body-sm text-xs text-on-surface-variant flex-wrap" aria-label="Breadcrumb">
              <a class="hover:text-on-surface transition-colors" href="#/">Home</a>
              <span class="text-outline-variant">/</span>
              <a class="hover:text-on-surface transition-colors" href="#/search">Halls in ${hall.city}</a>
              <span class="text-outline-variant">/</span>
              <span class="text-on-surface font-bold truncate max-w-xs">${hall.name}</span>
            </nav>

            <div class="flex items-center gap-2 shrink-0">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container text-tertiary font-label-md text-xs rounded-full font-bold border border-outline">
                <span class="material-symbols-outlined text-[15px]">verified</span>
                <span>${hall.verification_badge || 'Verified Luxury Hall'}</span>
              </span>

              <button class="inline-flex items-center gap-1 px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-lg transition-all font-semibold" onclick="Modals.openShareModal('${hall.id}')">
                <span class="material-symbols-outlined text-[15px]">share</span>
                <span>Share</span>
              </button>

              <button class="w-8 h-8 flex items-center justify-center bg-surface-container hover:bg-surface-container-high ${isFav ? 'text-secondary' : 'text-on-surface-variant'} rounded-lg transition-all" onclick="window.appStore.toggleFavorite('${hall.id}'); DetailsView.updateFavoriteState();" title="Save to Favorites">
                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${isFav ? '1' : '0'};">favorite</span>
              </button>

              <button class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-surface-container rounded-lg transition-colors" onclick="Modals.openReportModal('${hall.id}')" title="Report Incorrect Details">
                <span class="material-symbols-outlined text-[18px]">flag</span>
              </button>
            </div>

          </div>
        </section>

        <!-- Header Title Section -->
        <section class="w-full bg-surface-container-lowest py-4 md:py-6 border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span class="text-[11px] uppercase tracking-wider px-2.5 py-0.5 bg-surface-container text-on-surface font-bold rounded-md">
                    ${hall.hall_type}
                  </span>
                  <span class="text-xs text-on-surface-variant flex items-center gap-1">
                    <span class="material-symbols-outlined text-[15px] text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>
                    <strong class="text-on-surface">${hall.rating || 5.0}</strong>
                    <span>(${hall.reviews_count || reviews.length} Reviews)</span>
                  </span>
                  <span class="text-xs text-on-surface-variant">•</span>
                  <span class="text-xs text-on-surface-variant">${hall.indoor_outdoor}</span>
                </div>
                <h1 class="font-headline-lg text-2xl md:text-3xl lg:text-4xl text-on-surface tracking-tight font-serif font-bold">
                  ${hall.name}
                </h1>
                <p class="font-body-md text-xs md:text-sm text-on-surface-variant flex items-center gap-1.5 mt-1.5">
                  <span class="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                  <span>${hall.address || hall.area + ', ' + hall.city}</span>
                </p>
              </div>

              <!-- Top Direct Contact Bar -->
              <div class="flex items-center gap-2 shrink-0 flex-wrap">
                <a class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-lg transition-colors font-semibold" href="#venue-map">
                  <span class="material-symbols-outlined text-[16px]">near_me</span>
                  <span>Directions</span>
                </a>
                <a class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-lg transition-colors font-semibold" href="tel:${hall.contact?.phone || '+918258229988'}">
                  <span class="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Desk</span>
                </a>
                <a class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white hover:bg-inverse-surface font-label-md text-xs rounded-lg transition-colors font-bold" href="https://wa.me/${hall.contact?.whatsapp?.replace(/[^0-9]/g, '') || '918258229988'}" target="_blank">
                  <span class="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Polished Photo Showcase Gallery -->
        <section class="w-full bg-surface-container-lowest py-4 md:py-6 border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 h-auto md:h-[440px]">
              
              <!-- Large Primary Image Showcase -->
              <div class="md:col-span-2 lg:col-span-4 relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container min-h-[260px] md:min-h-0" onclick="Modals.openLightbox('${hall.cover_image}', '${hall.name} - Main Ballroom')">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.cover_image}" alt="${hall.name} Main Ballroom" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div class="text-white">
                    <span class="font-label-sm text-[10px] uppercase tracking-wider px-2 py-0.5 bg-black/60 backdrop-blur rounded font-semibold">Grand Ballroom</span>
                    <p class="font-title-lg text-base md:text-lg text-white font-bold mt-1">${hall.name}</p>
                  </div>
                  <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur rounded-lg text-primary font-label-sm text-xs font-bold shadow-sm">
                    <span class="material-symbols-outlined text-[15px]">zoom_in</span>
                    <span>Enlarge</span>
                  </span>
                </div>
              </div>

              <!-- Satellite Thumbnail Grid -->
              <div class="hidden md:grid md:col-span-2 grid-cols-2 gap-3">
                <div class="relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container" onclick="Modals.openLightbox('${hall.images?.dining || hall.cover_image}', 'Dining Hall Pavilion')">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.images?.dining || hall.cover_image}" alt="Dining Hall" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                  <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                    Dining Pavilion
                  </div>
                </div>

                <div class="relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container" onclick="Modals.openLightbox('${hall.images?.courtyard || hall.cover_image}', 'Courtyard Garden Lawn')">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.images?.courtyard || hall.cover_image}" alt="Courtyard" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                  <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                    Courtyard Lawn
                  </div>
                </div>

                <div class="relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container" onclick="Modals.openLightbox('${hall.images?.suite || hall.cover_image}', 'VIP Bridal Suite')">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.images?.suite || hall.cover_image}" alt="VIP Suite" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                  <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                    VIP Green Suite
                  </div>
                </div>

                <div class="relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container" onclick="Modals.openLightbox('${hall.images?.exterior || hall.cover_image}', 'Campus Facade')">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.images?.exterior || hall.cover_image}" alt="Exterior Facade" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                  <div class="absolute inset-0 bg-primary/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-white group-hover:bg-primary/60 transition-colors">
                    <span class="material-symbols-outlined text-[24px]">photo_library</span>
                    <span class="font-title-md text-xs font-bold mt-1">View Full Gallery</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Specifications Strip -->
        <section class="w-full bg-surface-container border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-3">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[18px]">groups</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Guest Capacity</span>
                  <span class="text-xs font-bold text-on-surface">Seats ${hall.seating_capacity} • Max ${hall.maximum_capacity}</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[18px]">straighten</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Hall Dimensions</span>
                  <span class="text-xs font-bold text-on-surface">${hall.size_sqft.toLocaleString()} sq ft • ${hall.length_ft}×${hall.width_ft} ft</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[18px]">mode_fan</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Climate Control</span>
                  <span class="text-xs font-bold text-on-surface">${hall.ac_status}</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[18px]">local_parking</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Parking</span>
                  <span class="text-xs font-bold text-on-surface">${hall.parking_cars}+ Cars & Valet</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Main Content (Left: Details, Calendar, Amenities, Reviews; Right: Sticky Booking Card) -->
        <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            <!-- Left 7 Columns -->
            <div class="lg:col-span-7 space-y-6 md:space-y-8">
              
              <!-- 1. Description & Architecture -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-3">
                <div class="flex items-center justify-between pb-2 border-b border-outline">
                  <h2 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif">Hall Overview & Sightlines</h2>
                  <span class="text-[11px] font-bold text-secondary bg-surface-container px-2.5 py-1 rounded-md">
                    Pillarless Sightlines
                  </span>
                </div>
                <p class="font-body-md text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  ${hall.description}
                </p>
                <div class="grid grid-cols-3 gap-3 pt-2">
                  <div class="p-3 bg-surface-container-low rounded-lg text-center border border-outline">
                    <span class="font-title-md text-sm font-bold text-on-surface block">${hall.ceiling_height_ft || 24} ft</span>
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">Ceiling Height</span>
                  </div>
                  <div class="p-3 bg-surface-container-low rounded-lg text-center border border-outline">
                    <span class="font-title-md text-sm font-bold text-on-surface block">Zero</span>
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">Pillars</span>
                  </div>
                  <div class="p-3 bg-surface-container-low rounded-lg text-center border border-outline">
                    <span class="font-title-md text-sm font-bold text-on-surface block">${hall.generator_kva || '100 kVA'}</span>
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">Power Backup</span>
                  </div>
                </div>
              </div>

              <!-- 2. Clean Amenities Grid -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4">
                <h2 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif pb-2 border-b border-outline">Facilities & Amenities</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  ${amenitiesWithIcons.map(a => `
                    <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold">
                      <span class="material-symbols-outlined text-secondary text-[18px] shrink-0">${a.icon}</span>
                      <span>${a.name}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- 3. ACCESSIBLE AVAILABILITY CALENDAR -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4" id="availability-section">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline gap-2">
                  <div>
                    <span class="text-[11px] font-bold text-secondary uppercase tracking-widest">Master Ledger</span>
                    <h3 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif">Shift Availability Schedule</h3>
                  </div>

                  ${hall.public_availability ? `
                    <span class="px-3 py-1 rounded-full bg-status-available-bg text-status-available text-xs font-bold flex items-center gap-1.5 border border-status-available-border w-max">
                      <span class="w-2 h-2 rounded-full bg-status-available animate-pulse"></span>
                      <span>Live Public Calendar</span>
                    </span>
                  ` : `
                    <span class="px-3 py-1 rounded-full bg-status-pending-bg text-status-pending text-xs font-bold flex items-center gap-1.5 border border-status-pending-border w-max">
                      <span class="w-2 h-2 rounded-full bg-status-pending"></span>
                      <span>Private Calendar Maintained</span>
                    </span>
                  `}
                </div>

                ${!hall.public_availability ? `
                  <div class="p-6 bg-surface-container-low rounded-xl border border-dashed border-outline text-center space-y-3">
                    <span class="material-symbols-outlined text-[36px] text-secondary">event_busy</span>
                    <h4 class="font-title-md text-sm font-bold text-on-surface">Private Calendar Mode</h4>
                    <p class="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                      The proprietor of ${hall.name} keeps exact slot dates private. Please submit an inquiry or call the venue directly to confirm shift availability.
                    </p>
                    <button class="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-inverse-surface transition-all" onclick="DetailsView.focusEnquiry()">
                      Contact Hall Owner for Availability
                    </button>
                  </div>
                ` : `
                  <!-- Accessible Shift Grid -->
                  <div class="space-y-3">
                    <!-- Date Range & Accessible Legend -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                      <span class="font-bold text-on-surface">November 17 – November 23, 2025</span>
                      <div class="flex items-center gap-3 text-[11px] flex-wrap">
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-available"></span> Available</span>
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-error"></span> Booked</span>
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-pending"></span> Pending</span>
                        <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Blocked</span>
                      </div>
                    </div>

                    <!-- Horizontally scrollable calendar table with non-color indicators -->
                    <div class="overflow-x-auto pb-1 no-scrollbar">
                      <div class="grid grid-cols-7 gap-1.5 min-w-[560px]">
                        
                        <!-- Day Headers -->
                        <div class="text-center font-bold text-xs text-on-surface-variant pb-1">Mon 17</div>
                        <div class="text-center font-bold text-xs text-on-surface-variant pb-1">Tue 18</div>
                        <div class="text-center font-bold text-xs text-on-surface-variant pb-1">Wed 19</div>
                        <div class="text-center font-bold text-xs text-secondary pb-1">Thu 20</div>
                        <div class="text-center font-bold text-xs text-on-surface-variant pb-1">Fri 21</div>
                        <div class="text-center font-bold text-xs text-on-surface-variant pb-1">Sat 22</div>
                        <div class="text-center font-bold text-xs text-on-surface-variant pb-1">Sun 23</div>

                        <!-- Mon 17 -->
                        <div class="p-1 rounded-lg bg-surface-container-low flex flex-col gap-1">
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Morn: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Aft: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-17', 'Evening (4PM - 11PM)', ${hall.pricing?.evening || 95000})">Eve: ₹95k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-17', 'Night (7PM - 1AM)', ${hall.pricing?.night || 75000})">Night: ₹75k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-slate-200 text-slate-700">Full: Blocked</div>
                        </div>

                        <!-- Tue 18 -->
                        <div class="p-1 rounded-lg bg-surface-container-low flex flex-col gap-1">
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-18', 'Morning (7AM - 2PM)', ${hall.pricing?.morning || 85000})">Morn: ₹85k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-18', 'Afternoon (12PM - 4PM)', ${hall.pricing?.afternoon || 60000})">Aft: ₹60k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-pending-bg text-status-pending border border-status-pending-border font-semibold">Eve: Pending</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-18', 'Night (7PM - 1AM)', ${hall.pricing?.night || 75000})">Night: ₹75k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-slate-200 text-slate-700">Full: Blocked</div>
                        </div>

                        <!-- Wed 19 -->
                        <div class="p-1 rounded-lg bg-surface-container-low flex flex-col gap-1">
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Morn: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Aft: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Eve: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Night: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-bold">Full: Sold Out</div>
                        </div>

                        <!-- Thu 20 (Target Day) -->
                        <div class="p-1 rounded-lg bg-surface-container-high ring-1 ring-secondary flex flex-col gap-1">
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-20', 'Morning (7AM - 2PM)', ${hall.pricing?.morning || 85000})">Morn: ₹85k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-20', 'Afternoon (12PM - 4PM)', ${hall.pricing?.afternoon || 60000})">Aft: ₹60k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border-2 border-secondary font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-20', 'Evening (4PM - 11PM)', ${hall.pricing?.evening || 95000})">Eve: ₹95k ★</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-20', 'Night (7PM - 1AM)', ${hall.pricing?.night || 75000})">Night: ₹75k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-20', 'Full Day (24 Hours)', ${hall.pricing?.full_day || 210000})">Full: ₹2.1L</div>
                        </div>

                        <!-- Fri 21 -->
                        <div class="p-1 rounded-lg bg-surface-container-low flex flex-col gap-1">
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-pending-bg text-status-pending border border-status-pending-border font-semibold">Morn: Pending</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-slate-200 text-slate-700">Aft: Blocked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Eve: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Night: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-slate-200 text-slate-700">Full: Blocked</div>
                        </div>

                        <!-- Sat 22 -->
                        <div class="p-1 rounded-lg bg-surface-container-low flex flex-col gap-1">
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Morn: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Aft: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Eve: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Night: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-bold">Full: Sold Out</div>
                        </div>

                        <!-- Sun 23 -->
                        <div class="p-1 rounded-lg bg-surface-container-low flex flex-col gap-1">
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Morn: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-23', 'Afternoon (12PM - 4PM)', ${hall.pricing?.afternoon || 60000})">Aft: ₹60k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-error-bg text-status-error font-semibold">Eve: Booked</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-status-available-bg text-status-available border border-status-available-border font-bold cursor-pointer hover:bg-emerald-100" onclick="DetailsView.selectSlot('2025-11-23', 'Night (7PM - 1AM)', ${hall.pricing?.night || 75000})">Night: ₹75k</div>
                          <div class="slot-pill p-1 rounded text-center text-[10px] bg-slate-200 text-slate-700">Full: Blocked</div>
                        </div>

                      </div>
                    </div>

                    <div class="p-2.5 bg-surface-container-low rounded-lg text-xs text-on-surface-variant flex items-center justify-between border border-outline">
                      <span>Standard Shifts: Morning (7 AM – 2 PM) | Evening (4 PM – 11 PM) | Full Day (24 hrs)</span>
                      <span class="font-bold text-on-surface">Click any green slot to hold</span>
                    </div>
                  </div>
                `}
              </div>

              <!-- 4. Location Map -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-3" id="venue-map">
                <div class="flex items-center justify-between pb-2 border-b border-outline">
                  <div>
                    <h3 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif">Location & Access</h3>
                    <p class="text-xs text-on-surface-variant">${hall.address || hall.area + ', ' + hall.city}</p>
                  </div>
                  <a class="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-bold flex items-center gap-1" href="https://maps.google.com/?q=${hall.latitude},${hall.longitude}" target="_blank">
                    <span class="material-symbols-outlined text-[15px]">navigation</span>
                    <span>Get Directions</span>
                  </a>
                </div>
                <div id="hall-leaflet-map" class="w-full h-64 rounded-xl border border-outline overflow-hidden"></div>
              </div>

              <!-- 5. Reviews -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4">
                <div class="flex items-center justify-between pb-2 border-b border-outline">
                  <div>
                    <h3 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif">Guest Reviews & Ratings</h3>
                    <p class="text-xs text-on-surface-variant">Feedback from verified celebration hosts</p>
                  </div>
                  <button class="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-inverse-surface" onclick="Modals.openReviewModal('${hall.id}')">
                    Write Review
                  </button>
                </div>

                <div class="space-y-3">
                  ${reviews.length ? reviews.map(r => `
                    <div class="p-3.5 bg-surface-container-low rounded-lg border border-outline space-y-1.5">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-xs text-on-surface">${r.customer_name}</span>
                          <span class="text-[10px] px-1.5 py-0.5 rounded bg-status-available-bg text-status-available font-bold flex items-center gap-0.5">
                            <span class="material-symbols-outlined text-[12px]">verified</span> Verified Event
                          </span>
                        </div>
                        <div class="text-secondary text-xs">★★★★★</div>
                      </div>
                      <p class="text-xs text-on-surface-variant leading-relaxed">${r.text}</p>
                      <div class="text-[10px] text-on-surface-variant/70">${r.date}</div>
                    </div>
                  `).join('') : `
                    <p class="text-xs text-on-surface-variant text-center py-4">No reviews yet. Be the first to write a review!</p>
                  `}
                </div>
              </div>

            </div>

            <!-- Right 5 Columns: Desktop Sticky Booking & Enquiry Card -->
            <div class="lg:col-span-5" id="booking-panel">
              <div class="sticky top-28 bg-surface-container-lowest rounded-xl border border-outline shadow-md overflow-hidden p-5 md:p-6 space-y-4">
                
                <!-- Segmented Tabs: Direct Slot Hold vs Custom Enquiry -->
                <div class="flex items-center p-1 bg-surface-container rounded-lg border border-outline">
                  <button class="flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${this.activeBookingTab === 'direct' ? 'bg-white text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'}" onclick="DetailsView.setBookingTab('direct')">
                    Direct Slot Hold
                  </button>
                  <button class="flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${this.activeBookingTab === 'enquiry' ? 'bg-white text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'}" onclick="DetailsView.setBookingTab('enquiry')">
                    Custom Enquiry
                  </button>
                </div>

                ${this.activeBookingTab === 'direct' ? `
                  <!-- Direct Hold Form -->
                  <form onsubmit="event.preventDefault(); DetailsView.submitDirectBooking();" class="space-y-3 text-left">
                    <div>
                      <span class="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider block">Selected Slot:</span>
                      <div class="p-3 bg-surface-container-low rounded-lg border border-outline flex items-center justify-between mt-1">
                        <div>
                          <div class="font-bold text-xs text-on-surface" id="selected-slot-display">${this.selectedDate} • ${this.selectedSlot}</div>
                          <div class="text-[11px] text-secondary font-bold" id="selected-price-display">₹${this.selectedPrice.toLocaleString()} Shift Tariff</div>
                        </div>
                        <a href="#availability-section" class="text-xs text-secondary font-bold hover:underline">Change</a>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Occasion *</label>
                        <select id="dt-occasion" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary">
                          <option>Wedding & Reception</option>
                          <option>Birthday / Anniversary</option>
                          <option>Corporate Summit</option>
                          <option>Cultural Gathering</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Guests *</label>
                        <input type="number" id="dt-guests" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-bold focus:outline-none focus:border-secondary" value="500" min="50">
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Your Name *</label>
                        <input type="text" id="dt-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="Ayush Poojary" required>
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Phone *</label>
                        <input type="tel" id="dt-phone" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="+91 98450 12345" required>
                      </div>
                    </div>

                    <div>
                      <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Email *</label>
                      <input type="email" id="dt-email" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="ayush@example.com" required>
                    </div>

                    <div>
                      <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Special Requirements (Optional)</label>
                      <textarea id="dt-notes" rows="2" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface focus:outline-none focus:border-secondary" placeholder="Stage decor setup time, mandap timings, catering notes..."></textarea>
                    </div>

                    <button type="submit" id="btn-submit-hold" class="w-full py-3 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-inverse-surface transition-all flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[17px]">lock</span>
                      <span>Request Direct Slot Hold</span>
                    </button>

                    <p class="text-[11px] text-on-surface-variant text-center leading-tight">
                      ✓ Instant 48-Hour hold sent to ${hall.contact?.owner_name || 'Hall Owner'}. No cancellation penalty.
                    </p>
                  </form>
                ` : `
                  <!-- Custom Enquiry Form -->
                  <form onsubmit="event.preventDefault(); DetailsView.submitEnquiry();" class="space-y-3 text-left">
                    <p class="text-xs text-on-surface-variant leading-relaxed">
                      Schedule an in-person property tour, arrange food tastings, or request custom multi-day wedding packages.
                    </p>

                    <div>
                      <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Target Event Window *</label>
                      <input type="text" id="enq-dates" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="November 2025 (Flexible)" required>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Your Name *</label>
                        <input type="text" id="enq-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="Ayush Poojary" required>
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">WhatsApp / Phone *</label>
                        <input type="tel" id="enq-phone" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="+91 98450 12345" required>
                      </div>
                    </div>

                    <div>
                      <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Walkthrough / Question Details *</label>
                      <textarea id="enq-notes" rows="3" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface focus:outline-none focus:border-secondary" placeholder="e.g. Would like to schedule an in-person walkthrough this Sunday at 11 AM..." required></textarea>
                    </div>

                    <button type="submit" class="w-full py-3 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-secondary-container transition-all flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[17px]">send</span>
                      <span>Send Custom Enquiry</span>
                    </button>
                  </form>
                `}

                <!-- Host Contact Pill -->
                <div class="p-3 bg-surface-container-low rounded-lg border border-outline flex items-center justify-between text-xs">
                  <div>
                    <span class="text-[10px] text-on-surface-variant uppercase font-bold block">Venue Desk</span>
                    <span class="font-bold text-on-surface">${hall.contact?.owner_name || 'Vikram Hegde'}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <a href="tel:${hall.contact?.phone || '+918258229988'}" class="p-2 rounded-md bg-white hover:bg-surface-container text-on-surface border border-outline transition-colors" title="Call">
                      <span class="material-symbols-outlined text-[16px]">call</span>
                    </a>
                    <a href="https://wa.me/${hall.contact?.whatsapp?.replace(/[^0-9]/g, '') || '918258229988'}" target="_blank" class="p-2 rounded-md bg-primary text-white hover:bg-inverse-surface transition-colors" title="WhatsApp">
                      <span class="material-symbols-outlined text-[16px]">chat</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- Sticky Bottom Action Bar for Mobile (Requirement: Accessible Booking on Mobile) -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline px-4 py-2.5 flex items-center justify-between shadow-lg">
          <div>
            <div class="text-[10px] text-on-surface-variant font-medium">Starting shift price</div>
            <div class="font-bold text-sm text-on-surface">
              ₹${(this.selectedPrice || 75000).toLocaleString()}
              <span class="text-[10px] font-normal text-on-surface-variant">/shift</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <a href="https://wa.me/${hall.contact?.whatsapp?.replace(/[^0-9]/g, '') || '918258229988'}" target="_blank" class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container border border-outline text-on-surface" title="WhatsApp">
              <span class="material-symbols-outlined text-[18px]">chat</span>
            </a>
            <a href="#booking-panel" class="px-4 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm" onclick="document.getElementById('booking-panel').scrollIntoView({behavior: 'smooth'})">
              Request Hold
            </a>
          </div>
        </div>

      </div>
    `;
  },

  postRender() {
    this.initMap();
  },

  initMap() {
    const mapEl = document.getElementById('hall-leaflet-map');
    if (!mapEl || typeof L === 'undefined') return;

    const hall = window.appStore.getHallById(this.currentHallId);
    if (!hall || !hall.latitude || !hall.longitude) return;

    const map = L.map('hall-leaflet-map', {
      scrollWheelZoom: false
    }).setView([hall.latitude, hall.longitude], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap & CARTO',
      maxZoom: 18
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-pin-wrapper',
      html: `
        <div class="custom-map-pin active">
          <span class="material-symbols-outlined pin-icon">castle</span>
          <span>${hall.name.split(' ')[0]}</span>
        </div>
      `,
      iconSize: [64, 26],
      iconAnchor: [32, 13]
    });

    L.marker([hall.latitude, hall.longitude], { icon: customIcon }).addTo(map)
      .bindPopup(`<strong>${hall.name}</strong><br>${hall.address || hall.city}`)
      .openPopup();
  },

  selectSlot(date, slot, price) {
    this.selectedDate = date;
    this.selectedSlot = slot;
    this.selectedPrice = price;

    const slotDisp = document.getElementById('selected-slot-display');
    const priceDisp = document.getElementById('selected-price-display');
    if (slotDisp) slotDisp.innerText = `${date} • ${slot}`;
    if (priceDisp) priceDisp.innerText = `₹${price.toLocaleString()} Shift Tariff`;

    Toast.info('Slot Selected', `Configured reservation for ${date} (${slot}).`);
  },

  setBookingTab(tab) {
    this.activeBookingTab = tab;
    const container = document.getElementById('app-content');
    if (container) {
      container.innerHTML = this.render(this.currentHallId);
      this.postRender();
    }
  },

  focusEnquiry() {
    this.setBookingTab('enquiry');
    const bp = document.getElementById('booking-panel');
    if (bp) bp.scrollIntoView({ behavior: 'smooth' });
  },

  submitDirectBooking() {
    const hall = window.appStore.getHallById(this.currentHallId);
    const occasion = document.getElementById('dt-occasion')?.value || 'Wedding & Reception';
    const guests = Number(document.getElementById('dt-guests')?.value) || 500;
    const name = document.getElementById('dt-name')?.value || 'Ayush Poojary';
    const phone = document.getElementById('dt-phone')?.value || '+91 98450 12345';
    const email = document.getElementById('dt-email')?.value || 'ayush@example.com';
    const notes = document.getElementById('dt-notes')?.value || '';

    const newBooking = window.appStore.createBooking({
      hall_id: hall.id,
      hall_name: hall.name,
      customer_id: window.appStore.getCurrentUser().id,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      event_type: occasion,
      date: this.selectedDate,
      slot: this.selectedSlot,
      guests,
      notes,
      amount: this.selectedPrice
    });

    Toast.success('Booking Request Transmitted', `Reference ${newBooking.id} submitted for ${hall.name}. Status: PENDING sign-off.`);
    window.location.hash = '#/customer';
  },

  submitEnquiry() {
    const hall = window.appStore.getHallById(this.currentHallId);
    const name = document.getElementById('enq-name')?.value || '';
    const phone = document.getElementById('enq-phone')?.value || '';

    window.appStore.addNotification(
      'New Custom Enquiry',
      `Walkthrough / Enquiry request from ${name} (${phone}) for "${hall.name}".`,
      '#/owner'
    );

    Toast.success('Enquiry Sent', `Your enquiry has been transmitted to ${hall.contact?.owner_name || 'the hall owner'}.`);
    window.location.hash = '#/customer';
  },

  updateFavoriteState() {
    const container = document.getElementById('app-content');
    if (container) {
      container.innerHTML = this.render(this.currentHallId);
      this.postRender();
    }
  }
};

window.DetailsView = DetailsView;
