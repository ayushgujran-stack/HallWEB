// Venue Search & Discovery Page with Interactive Map & Faceted Filtering
// Refined 3-area layout with responsive mobile bottom sheet drawer and map toggle

const SearchView = {
  mapInstance: null,
  currentLayout: 'grid', // 'grid' is the sole default view

  // GPS Geolocation state
  userLocation: null,
  isNearMeActive: false,
  userLocationMarker: null,

  calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 5.0;
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round((R * c) * 10) / 10;
  },

  detectUserLocation() {
    if (!navigator.geolocation) {
      if (typeof Toast !== 'undefined') Toast.error('Unsupported', 'Your browser does not support GPS location.');
      return;
    }

    if (typeof Toast !== 'undefined') Toast.info('Detecting Location...', 'Accessing GPS coordinates to find nearest halls...');
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.userLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        this.isNearMeActive = true;
        this.filters.sortBy = 'nearest';
        sessionStorage.setItem('search_near_me', 'true');
        sessionStorage.setItem('search_user_lat', pos.coords.latitude.toString());
        sessionStorage.setItem('search_user_lng', pos.coords.longitude.toString());

        if (typeof Toast !== 'undefined') {
          Toast.success('Location Locked', 'Halls sorted by proximity to your exact location.');
        }

        this.refreshCardsAndMap();

        if (this.mapInstance && this.userLocation) {
          this.renderUserMarker();
          this.mapInstance.setView([this.userLocation.lat, this.userLocation.lng], 12);
        }
      },
      (err) => {
        console.warn('Geolocation failed:', err.message);
        if (typeof Toast !== 'undefined') {
          Toast.info('Location Notice', 'GPS access declined. Pick your town from below.');
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  },

  resetLocation() {
    this.userLocation = null;
    this.isNearMeActive = false;
    sessionStorage.removeItem('search_near_me');
    sessionStorage.removeItem('search_user_lat');
    sessionStorage.removeItem('search_user_lng');
    if (this.userLocationMarker && this.mapInstance) {
      this.mapInstance.removeLayer(this.userLocationMarker);
      this.userLocationMarker = null;
    }
    this.refreshCardsAndMap();
    if (typeof Toast !== 'undefined') Toast.info('Location Reset', 'Default distance ranking restored.');
  },

  renderUserMarker() {
    if (!this.mapInstance || !this.userLocation || typeof L === 'undefined') return;
    if (this.userLocationMarker) {
      this.mapInstance.removeLayer(this.userLocationMarker);
      this.userLocationMarker = null;
    }

    const userIcon = L.divIcon({
      className: 'user-radar-pin',
      html: `
        <div style="position: relative; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center;">
          <span style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: #A65B2B; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span style="position: relative; width: 14px; height: 14px; border-radius: 50%; background: #A65B2B; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></span>
        </div>
      `,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });

    this.userLocationMarker = L.marker([this.userLocation.lat, this.userLocation.lng], { icon: userIcon })
      .addTo(this.mapInstance)
      .bindPopup('<strong>📍 Your Location</strong><br>Showing nearest banquet & wedding halls');
  },

  // Filter state
  filters: {
    query: '',
    city: '',
    radius: 50,
    publicOnly: false,
    capacityRange: 'all',
    acType: 'all',
    cateringPolicy: 'all',
    maxPrice: 300000,
    sortBy: 'nearest'
  },

  getActiveFilterCount() {
    let count = 0;
    if (this.filters.query) count++;
    if (this.filters.radius < 50) count++;
    if (this.filters.publicOnly) count++;
    if (this.filters.capacityRange !== 'all') count++;
    if (this.filters.acType !== 'all') count++;
    if (this.filters.cateringPolicy !== 'all') count++;
    if (this.filters.maxPrice < 300000) count++;
    return count;
  },

  render() {
    // Sync location chosen from main page hero search
    if (sessionStorage.getItem('hero_search_active') === 'true') {
      const heroLoc = sessionStorage.getItem('search_filter_location');
      this.filters.query = heroLoc ? heroLoc.trim() : '';
      this.filters.city = this.filters.query;
      sessionStorage.removeItem('hero_search_active');
    }

    const filteredHalls = this.getFilteredHalls();
    const activeCount = this.getActiveFilterCount();

    return `
      <div class="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-surface">
        
        <!-- Sub-header & Filtering Hub -->
        <section class="w-full bg-surface-container-lowest border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-3 flex flex-col gap-2">
            
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-xs">
                <a class="hover:text-on-surface transition-colors flex items-center gap-1" href="#/">
                  <span class="material-symbols-outlined text-[15px]">home</span> Karnataka
                </a>
                <span class="text-outline-variant">/</span>
                <span class="text-on-surface font-semibold truncate max-w-[200px] sm:max-w-none">${this.filters.query ? `${this.filters.query} Area` : 'Coastal Region (All Venues)'}</span>
              </div>
              <div class="flex items-center gap-2 text-xs font-semibold text-on-surface shrink-0">
                <span class="inline-block w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
                <span id="search-results-count-header">${filteredHalls.length} venues found</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
              <div>
                <h1 class="font-headline-md text-xl md:text-2xl text-on-surface tracking-tight font-serif">
                  Premier Event Halls & Venues
                </h1>
              </div>

              <!-- Controls: Mobile Filter Button -->
              <div class="flex items-center gap-2">
                <!-- Mobile Filter Trigger Button -->
                <button class="lg:hidden flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs border border-outline cursor-pointer" onclick="SearchView.toggleMobileFilters()">
                  <span class="material-symbols-outlined text-[16px]">tune</span>
                  <span>Filters</span>
                  ${activeCount > 0 ? `<span class="w-4 h-4 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center font-bold">${activeCount}</span>` : ''}
                </button>
              </div>
            </div>

            <!-- Horizontally Scrollable Sort Chips (No mobile clipping) -->
            <div class="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-nowrap" id="search-sort-chips">
              ${this.renderSortChips()}
            </div>

          </div>
        </section>

        <!-- Main Exploration Workspace: Grid Catalog with Persistent Sticky Filter Sidebar -->
        <div class="max-w-[1360px] w-full mx-auto px-gutter-mobile md:px-gutter-desktop py-4 md:py-6 flex-1">
          <div class="grid grid-cols-12 gap-5 md:gap-6 items-start relative">
            
            <!-- 1. LEFT FACETED FILTERS SIDEBAR (Sticky on Desktop, always present when scrolling) -->
            <aside class="hidden lg:block lg:col-span-3 sticky-filter-sidebar">
              <div class="bg-surface-container-lowest p-5 rounded-2xl border border-outline shadow-sm space-y-4 max-h-[calc(100vh-7.5rem)] overflow-y-auto overscroll-contain pr-2.5 styled-scrollbar">
                ${this.renderFiltersContent()}
              </div>
            </aside>

            <!-- 2. VENUES GRID CONTAINER (Grid View Default & Sole View) -->
            <div class="col-span-12 lg:col-span-9 space-y-4">
              
              <!-- Results Count & Mode Badge -->
              <div class="flex items-center justify-between pb-1">
                <span class="font-bold text-sm text-on-surface" id="search-results-count">${filteredHalls.length} venues found</span>
                <span class="text-xs text-on-surface-variant font-medium flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-[16px] text-secondary">grid_view</span>
                  <span>Grid Catalog View</span>
                </span>
              </div>

              <!-- All Venues Cards Grid: 3 cols on desktop, 2 on tablet, 1 on mobile -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" id="search-cards-list">
                ${this.renderHallCards()}
              </div>

            </div>

          </div>
        </div>

        <!-- Mobile Persistent Floating Filter Button (Always present at all places when scrolling) -->
        <div class="lg:hidden fixed bottom-6 right-6 z-40">
          <button class="flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-white shadow-2xl hover:bg-inverse-surface active:scale-95 font-bold text-xs uppercase tracking-wider transition-all border border-white/20 cursor-pointer" onclick="SearchView.toggleMobileFilters()">
            <span class="material-symbols-outlined text-[18px]">tune</span>
            <span>Filter Venues ${activeCount > 0 ? `(${activeCount})` : ''}</span>
          </button>
        </div>

        <!-- Mobile Filter Drawer (Responsive Bottom Sheet) -->
        <div id="mobile-filter-drawer" class="lg:hidden hidden fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/50 backdrop-blur-xs" onclick="SearchView.toggleMobileFilters()"></div>
          <div class="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-surface-container-lowest rounded-t-2xl shadow-2xl p-5 overflow-y-auto bottomsheet-content border-t border-outline flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-outline mb-4">
                <span class="font-bold text-base text-on-surface">Filters</span>
                <button class="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container" onclick="SearchView.toggleMobileFilters()">
                  <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
              ${this.renderFiltersContent()}
            </div>
            <div class="pt-4 mt-6 border-t border-outline flex items-center gap-3">
              <button class="w-1/2 py-2.5 rounded-lg border border-outline text-on-surface font-bold text-xs uppercase tracking-wider hover:bg-surface-container" onclick="SearchView.resetFilters()">
                Reset
              </button>
              <button class="w-1/2 py-2.5 rounded-lg bg-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-inverse-surface shadow-md" onclick="SearchView.toggleMobileFilters()">
                Apply Filters
              </button>
            </div>
          </div>
        </div>

      </div>
    `;
  },

  renderSortChips() {
    return `
      <span class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider shrink-0">Sort:</span>
      <button class="px-3 py-1 font-label-sm text-xs rounded-full transition-all flex items-center gap-1 cursor-pointer ${this.filters.sortBy === 'nearest' ? 'bg-primary text-white font-bold shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}" onclick="SearchView.setSort('nearest')">
        <span class="material-symbols-outlined text-[13px]">near_me</span> Nearest First
      </button>
      <button class="px-3 py-1 font-label-sm text-xs rounded-full transition-all cursor-pointer ${this.filters.sortBy === 'rating' ? 'bg-primary text-white font-bold shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}" onclick="SearchView.setSort('rating')">
        Top Rated
      </button>
      <button class="px-3 py-1 font-label-sm text-xs rounded-full transition-all cursor-pointer ${this.filters.sortBy === 'capacity' ? 'bg-primary text-white font-bold shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}" onclick="SearchView.setSort('capacity')">
        Capacity: High to Low
      </button>
      <button class="px-3 py-1 font-label-sm text-xs rounded-full transition-all cursor-pointer ${this.filters.sortBy === 'price_asc' ? 'bg-primary text-white font-bold shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}" onclick="SearchView.setSort('price_asc')">
        Price: Low to High
      </button>
      <button class="px-3 py-1 font-label-sm text-xs rounded-full transition-all cursor-pointer ${this.filters.sortBy === 'price_desc' ? 'bg-primary text-white font-bold shadow-sm' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}" onclick="SearchView.setSort('price_desc')">
        Price: High to Low
      </button>
    `;
  },

  renderFiltersContent() {
    const activeCount = this.getActiveFilterCount();

    return `
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-1 border-b border-outline">
          <div class="flex items-center gap-1.5">
            <span class="font-title-md text-sm font-bold text-on-surface">Filter Venues</span>
            ${activeCount > 0 ? `<span class="px-1.5 py-0.5 rounded-full bg-secondary text-white text-[10px] font-bold">${activeCount} active</span>` : ''}
          </div>
          <button class="font-label-sm text-xs text-secondary hover:underline uppercase tracking-wider font-bold" onclick="SearchView.resetFilters()">
            Clear All
          </button>
        </div>

        <!-- Location Search -->
        <div>
          <label class="font-label-sm text-[11px] uppercase tracking-wider text-on-surface font-bold block mb-1">Search City or Area</label>
          <div class="relative">
            <input type="text" id="filter-query" list="sidebar-cities-list" class="w-full p-2.5 pl-8 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" placeholder="e.g. Karkala, Mangalore, Udupi" value="${this.filters.query || ''}" oninput="SearchView.updateFilter('query', this.value)">
            <span class="material-symbols-outlined text-on-surface-variant absolute left-2.5 top-2.5 text-[16px]">search</span>
          </div>
          <datalist id="sidebar-cities-list">
            <option value="Mangalore">Mangalore</option>
            <option value="Udupi">Udupi</option>
            <option value="Karkala">Karkala</option>
            <option value="Manipal">Manipal</option>
            <option value="Surathkal">Surathkal</option>
            <option value="Moodbidri">Moodbidri</option>
            <option value="Bantwal">Bantwal</option>
            <option value="Malpe">Malpe</option>
          </datalist>
        </div>

        <!-- Public Available Dates Toggle -->
        <div class="flex items-center justify-between py-1 bg-surface-container-low p-2.5 rounded-lg border border-outline">
          <div>
            <span class="font-label-sm text-xs font-bold text-on-surface block">Live Calendar Holds Only</span>
            <span class="font-body-sm text-[10px] text-on-surface-variant block">Halls with public slots</span>
          </div>
          <label class="relative inline-flex items-center cursor-pointer shrink-0">
            <input type="checkbox" class="sr-only peer" ${this.filters.publicOnly ? 'checked' : ''} onchange="SearchView.updateFilter('publicOnly', this.checked)">
            <div class="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <!-- GPS Proximity & "Near Me" Hub -->
        <div class="p-3.5 rounded-xl border ${this.isNearMeActive ? 'bg-secondary/10 border-secondary/40 shadow-xs' : 'bg-surface-container-low border-outline'} space-y-2.5">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[18px] ${this.isNearMeActive ? 'text-secondary animate-pulse' : 'text-on-surface-variant'}">my_location</span>
              <span class="font-label-sm text-xs font-bold text-on-surface">Find Halls Near Me</span>
            </div>
            ${this.isNearMeActive ? `
              <button onclick="SearchView.resetLocation()" class="text-[11px] text-secondary hover:underline font-bold">Reset</button>
            ` : ''}
          </div>

          <p class="text-[11px] text-on-surface-variant leading-tight">
            ${this.isNearMeActive 
              ? '📍 GPS Active: Listing halls by closest driving distance from your coordinates.'
              : 'Use your phone/laptop GPS to calculate exact distances to nearby venues.'}
          </p>

          <button onclick="SearchView.detectUserLocation()" class="w-full py-2 bg-secondary text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm hover:bg-secondary-container transition-all">
            <span class="material-symbols-outlined text-[16px]">near_me</span>
            <span>${this.isNearMeActive ? 'Update Current Location' : 'Detect My Location'}</span>
          </button>

          <!-- Quick Radius Pills -->
          <div class="pt-1">
            <div class="flex items-center justify-between mb-1">
              <span class="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Distance Radius:</span>
              <span class="text-[10px] font-bold text-secondary" id="radius-val">Within ${this.filters.radius} km</span>
            </div>
            <div class="grid grid-cols-4 gap-1">
              ${[5, 15, 25, 50].map(r => `
                <button type="button" onclick="SearchView.updateFilter('radius', ${r}); const el = document.getElementById('radius-val'); if(el) el.innerText = 'Within ${r} km';" class="py-1 text-[11px] font-bold rounded border transition-all text-center ${this.filters.radius === r ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-container hover:bg-surface-container-high text-on-surface border-outline'}">
                  ${r} km
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Distance Radius Slider -->
        <div class="space-y-1">
          <input class="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" id="radius-range" max="50" min="2" type="range" value="${this.filters.radius}" oninput="SearchView.updateFilter('radius', Number(this.value)); const el = document.getElementById('radius-val'); if(el) el.innerText = 'Within ' + this.value + ' km';">
          <div class="flex items-center justify-between text-on-surface-variant font-body-sm text-[10px]">
            <span>2 km</span>
            <span>50 km</span>
          </div>
        </div>

        <!-- Guest Capacity Radio Group -->
        <div class="space-y-1">
          <label class="font-label-sm text-[11px] uppercase tracking-wider text-on-surface font-bold block">Guest Capacity</label>
          <div class="space-y-1 text-on-surface-variant font-body-sm text-xs">
            <label class="flex items-center gap-2 hover:text-on-surface cursor-pointer py-0.5">
              <input type="radio" name="capacity-radio" class="accent-primary" value="all" ${this.filters.capacityRange === 'all' ? 'checked' : ''} onchange="SearchView.updateFilter('capacityRange', this.value)">
              <span>All Capacities</span>
            </label>
            <label class="flex items-center gap-2 hover:text-on-surface cursor-pointer py-0.5">
              <input type="radio" name="capacity-radio" class="accent-primary" value="200-500" ${this.filters.capacityRange === '200-500' ? 'checked' : ''} onchange="SearchView.updateFilter('capacityRange', this.value)">
              <span>200 – 500 Guests</span>
            </label>
            <label class="flex items-center gap-2 hover:text-on-surface cursor-pointer py-0.5">
              <input type="radio" name="capacity-radio" class="accent-primary" value="500-1000" ${this.filters.capacityRange === '500-1000' ? 'checked' : ''} onchange="SearchView.updateFilter('capacityRange', this.value)">
              <span>500 – 1,000 Guests</span>
            </label>
            <label class="flex items-center gap-2 hover:text-on-surface cursor-pointer py-0.5">
              <input type="radio" name="capacity-radio" class="accent-primary" value="1000+" ${this.filters.capacityRange === '1000+' ? 'checked' : ''} onchange="SearchView.updateFilter('capacityRange', this.value)">
              <span>1,000+ Guests (Convention)</span>
            </label>
          </div>
        </div>

        <!-- Climate Control -->
        <div class="space-y-1">
          <label class="font-label-sm text-[11px] uppercase tracking-wider text-on-surface font-bold block">Climate Format</label>
          <select class="w-full p-2 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none" onchange="SearchView.updateFilter('acType', this.value)">
            <option value="all" ${this.filters.acType === 'all' ? 'selected' : ''}>All Climate Types</option>
            <option value="Central AC" ${this.filters.acType === 'Central AC' ? 'selected' : ''}>Central Air Conditioned</option>
            <option value="Non-AC" ${this.filters.acType === 'Non-AC' ? 'selected' : ''}>Non-AC (Natural Breeze)</option>
          </select>
        </div>

        <!-- Food & Catering Policy (Veg / Non-Veg) -->
        <div class="space-y-1">
          <label class="font-label-sm text-[11px] uppercase tracking-wider text-on-surface font-bold flex items-center justify-between">
            <span>Catering & Food Policy</span>
            <span class="text-[10px] text-secondary font-semibold">Veg / Non-Veg</span>
          </label>
          <select class="w-full p-2 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" onchange="SearchView.updateFilter('cateringPolicy', this.value)">
            <option value="all" ${this.filters.cateringPolicy === 'all' ? 'selected' : ''}>All Catering Policies</option>
            <option value="pure_veg" ${this.filters.cateringPolicy === 'pure_veg' ? 'selected' : ''}>🥬 Pure Vegetarian Only</option>
            <option value="both" ${this.filters.cateringPolicy === 'both' ? 'selected' : ''}>🍗 Veg & Non-Veg Allowed</option>
            <option value="separate_kitchens" ${this.filters.cateringPolicy === 'separate_kitchens' ? 'selected' : ''}>✨ Separate Kitchens (Veg & Non-Veg)</option>
          </select>
        </div>

        <!-- Max Price Slider -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="font-label-sm text-[11px] uppercase tracking-wider text-on-surface font-bold">Max Shift Price</label>
            <span class="font-body-sm text-xs font-bold text-on-surface" id="price-val">₹${(this.filters.maxPrice).toLocaleString()}</span>
          </div>
          <input class="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary" max="300000" min="20000" step="10000" type="range" value="${this.filters.maxPrice}" oninput="SearchView.updateFilter('maxPrice', Number(this.value)); const el = document.getElementById('price-val'); if(el) el.innerText = '₹' + Number(this.value).toLocaleString();">
        </div>
      </div>
    `;
  },

  getAllHalls() {
    let halls = (window.appStore && window.appStore.getHalls) ? window.appStore.getHalls() : [];
    
    // Supplement with rich coastal halls to ensure full marketplace representation across Karnataka coastal towns
    const supplementalHalls = [
      {
        id: 'hall-swarna-sands-surathkal',
        name: 'Swarna Sands Beachfront Pavilion & Lawn',
        slug: 'swarna-sands-surathkal',
        description: 'Spectacular ocean-facing banquet lawns and glass ballroom located on the pristine Surathkal coastline.',
        hall_type: 'Beachfront Lawn & Glass Ballroom',
        area: 'Surathkal Beach Road',
        city: 'Surathkal',
        state: 'Karnataka',
        pincode: '575014',
        address: 'Beachview Promontory, Surathkal 575014',
        latitude: 13.0084,
        longitude: 74.7925,
        distance_km: 18.5,
        seating_capacity: 900,
        maximum_capacity: 2000,
        ac_status: 'Central AC + Coastal Lawn',
        indoor_outdoor: 'Indoor Ballroom + Beach Lawn',
        parking_cars: 300,
        dining_seats: 500,
        rating: 4.9,
        reviews_count: 67,
        catering_policy: 'both',
        pricing: { morning: 90000, afternoon: 65000, evening: 125000, night: 85000, full_day: 250000 },
        public_availability: true,
        status: 'LIVE',
        listing_tier: 'PREMIUM',
        listing_fee_paid: true,
        cover_image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
        contact: { whatsapp: '919845012345' }
      },
      {
        id: 'hall-kudla-heritage-durbar',
        name: 'Kudla Heritage Durbar & Convention Center',
        slug: 'kudla-heritage-durbar-mangalore',
        description: 'Majestic coastal architecture featuring teak carvings and modern audiovisual acoustic design.',
        hall_type: 'Grand Durbar & Cultural Convention',
        area: 'Kadri Hills',
        city: 'Mangalore',
        state: 'Karnataka',
        pincode: '575002',
        address: 'Kadri Hills Main Road, Mangalore 575002',
        latitude: 12.8797,
        longitude: 74.8560,
        distance_km: 35.0,
        seating_capacity: 1100,
        maximum_capacity: 2500,
        ac_status: 'Central HVAC',
        indoor_outdoor: 'Indoor Banquet',
        parking_cars: 400,
        dining_seats: 600,
        rating: 4.8,
        reviews_count: 112,
        catering_policy: 'separate_kitchens',
        pricing: { morning: 95000, afternoon: 70000, evening: 135000, night: 90000, full_day: 270000 },
        public_availability: true,
        status: 'LIVE',
        listing_tier: 'PREMIUM',
        listing_fee_paid: true,
        cover_image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
        contact: { whatsapp: '919845023456' }
      },
      {
        id: 'hall-temple-city-mandapam',
        name: 'Temple City Grand Mandapam & AC Hall',
        slug: 'temple-city-mandapam-udupi',
        description: 'Authentic traditional architecture with sacred pooja courtyards and pure vegetarian culinary kitchen.',
        hall_type: 'Traditional Mandapam & Banquet',
        area: 'Car Street Vicinity',
        city: 'Udupi',
        state: 'Karnataka',
        pincode: '576101',
        address: 'Near Sri Krishna Matha, Udupi 576101',
        latitude: 13.3409,
        longitude: 74.7421,
        distance_km: 32.0,
        seating_capacity: 650,
        maximum_capacity: 1400,
        ac_status: 'Central AC',
        indoor_outdoor: 'Indoor Mandapam',
        parking_cars: 180,
        dining_seats: 400,
        rating: 4.9,
        reviews_count: 88,
        catering_policy: 'pure_veg',
        pricing: { morning: 65000, afternoon: 45000, evening: 75000, night: 55000, full_day: 160000 },
        public_availability: true,
        status: 'LIVE',
        listing_tier: 'PREMIUM',
        listing_fee_paid: true,
        cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        contact: { whatsapp: '919845034567' }
      },
      {
        id: 'hall-moodbidri-royal-palms',
        name: 'Moodbidri Royal Palms Garden & Banquet',
        slug: 'moodbidri-royal-palms',
        description: 'Lush tropical estate with open-air amphitheater, illuminated palm grove, and glass air-conditioned dining.',
        hall_type: 'Garden Estate & Banquet',
        area: 'Alva’s Campus Road',
        city: 'Moodbidri',
        state: 'Karnataka',
        pincode: '574227',
        address: 'Vidyagiri Estate, Moodbidri 574227',
        latitude: 13.0694,
        longitude: 74.9961,
        distance_km: 16.0,
        seating_capacity: 850,
        maximum_capacity: 1800,
        ac_status: 'Central AC + Open Lawn',
        indoor_outdoor: 'Indoor + Garden Lawn',
        parking_cars: 250,
        dining_seats: 450,
        rating: 4.7,
        reviews_count: 53,
        catering_policy: 'both',
        pricing: { morning: 70000, afternoon: 50000, evening: 90000, night: 65000, full_day: 190000 },
        public_availability: true,
        status: 'LIVE',
        listing_tier: 'PREMIUM',
        listing_fee_paid: true,
        cover_image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80',
        contact: { whatsapp: '919845045678' }
      },
      {
        id: 'hall-manipal-vista-arena',
        name: 'Manipal Vista Grand Convention Arena',
        slug: 'manipal-vista-grand-arena',
        description: 'Ultra-modern 2000-seater tiered convention facility with cinematic AV and separate dining wings.',
        hall_type: 'Convention Arena & Auditorium',
        area: 'Tiger Circle Road',
        city: 'Manipal',
        state: 'Karnataka',
        pincode: '576104',
        address: 'End Point Road, Manipal 576104',
        latitude: 13.3525,
        longitude: 74.7865,
        distance_km: 30.5,
        seating_capacity: 2000,
        maximum_capacity: 4000,
        ac_status: 'Central HVAC',
        indoor_outdoor: 'Indoor Auditorium',
        parking_cars: 600,
        dining_seats: 900,
        rating: 5.0,
        reviews_count: 140,
        catering_policy: 'separate_kitchens',
        pricing: { morning: 150000, afternoon: 110000, evening: 220000, night: 160000, full_day: 420000 },
        public_availability: true,
        status: 'LIVE',
        listing_tier: 'PREMIUM',
        listing_fee_paid: true,
        cover_image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
        contact: { whatsapp: '919845056789' }
      },
      {
        id: 'hall-netravati-riverside-banquets',
        name: 'Netravati Riverside Banquets & Lawns',
        slug: 'netravati-riverside-bantwal',
        description: 'Scenic waterfront banquet deck on the banks of River Netravati, featuring breeze pergolas and luxury suites.',
        hall_type: 'Riverside Hall & Waterfront Deck',
        area: 'B.C. Road',
        city: 'Bantwal',
        state: 'Karnataka',
        pincode: '574211',
        address: 'Riverside Boulevard, Bantwal 574211',
        latitude: 12.8916,
        longitude: 75.0336,
        distance_km: 36.0,
        seating_capacity: 550,
        maximum_capacity: 1200,
        ac_status: 'Central AC + River Breeze',
        indoor_outdoor: 'Indoor + Waterfront Lawn',
        parking_cars: 160,
        dining_seats: 350,
        rating: 4.6,
        reviews_count: 41,
        catering_policy: 'both',
        pricing: { morning: 50000, afternoon: 35000, evening: 65000, night: 45000, full_day: 140000 },
        public_availability: true,
        status: 'LIVE',
        listing_tier: 'BASIC',
        listing_fee_paid: false,
        cover_image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
        contact: { whatsapp: '919845067890' }
      },
      {
        id: 'hall-malpe-ocean-breeze',
        name: 'Malpe Coastal Sea Breeze Lawn & Arena',
        slug: 'malpe-ocean-breeze-arena',
        description: 'Exquisite open-sky venue overlooking the Arabian Sea, ideal for sunset sangeet and grand seaside receptions.',
        hall_type: 'Open-Air Arena & Sea Pavilion',
        area: 'Malpe Beach',
        city: 'Malpe',
        state: 'Karnataka',
        pincode: '576108',
        address: 'Malpe Port Road, Malpe 576108',
        latitude: 13.3512,
        longitude: 74.7042,
        distance_km: 36.5,
        seating_capacity: 700,
        maximum_capacity: 1500,
        ac_status: 'Natural Sea Breeze + AC Lounge',
        indoor_outdoor: 'Outdoor Arena',
        parking_cars: 220,
        dining_seats: 400,
        rating: 4.8,
        reviews_count: 76,
        catering_policy: 'both',
        pricing: { morning: 65000, afternoon: 50000, evening: 85000, night: 60000, full_day: 180000 },
        public_availability: true,
        status: 'LIVE',
        listing_tier: 'PREMIUM',
        listing_fee_paid: true,
        cover_image: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
        contact: { whatsapp: '919845078901' }
      },
      {
        id: 'hall-karkala-valley-view',
        name: 'Karkala Valley View Banquet & Lawns',
        slug: 'karkala-valley-view-banquets',
        description: 'Panoramas of the Western Ghats foothills with open dining amphitheater and air-conditioned function hall.',
        hall_type: 'Valley View Hall & Garden',
        area: 'Anekere Lake Road',
        city: 'Karkala',
        state: 'Karnataka',
        pincode: '574104',
        address: 'Lakeview Rise, Karkala 574104',
        latitude: 13.2120,
        longitude: 74.9920,
        distance_km: 2.2,
        seating_capacity: 500,
        maximum_capacity: 1100,
        ac_status: 'Central AC',
        indoor_outdoor: 'Indoor + Garden Lawn',
        parking_cars: 150,
        dining_seats: 300,
        rating: 4.7,
        reviews_count: 38,
        catering_policy: 'pure_veg',
        pricing: { morning: 50000, afternoon: 35000, evening: 60000, night: 45000, full_day: 130000 },
        public_availability: true,
        status: 'LIVE',
        listing_tier: 'BASIC',
        listing_fee_paid: false,
        cover_image: 'https://images.unsplash.com/photo-1510076857177-7470076d4498?auto=format&fit=crop&w=1200&q=80',
        contact: { whatsapp: '919845089012' }
      }
    ];

    const existingIds = new Set(halls.map(h => h.id));
    supplementalHalls.forEach(sh => {
      if (!existingIds.has(sh.id)) {
        halls.push(sh);
      }
    });

    return halls.filter(h => h.status !== 'REJECTED' && h.status !== 'SUSPENDED');
  },

  getFilteredHalls() {
    let halls = this.getAllHalls();

    // Check if user location is stored in session
    if (!this.userLocation && sessionStorage.getItem('search_near_me') === 'true') {
      const sLat = parseFloat(sessionStorage.getItem('search_user_lat'));
      const sLng = parseFloat(sessionStorage.getItem('search_user_lng'));
      if (!isNaN(sLat) && !isNaN(sLng)) {
        this.userLocation = { lat: sLat, lng: sLng };
        this.isNearMeActive = true;
      }
    }

    // Compute live distance if userLocation is available
    if (this.userLocation) {
      halls = halls.map(h => ({
        ...h,
        distance_km: this.calculateDistance(this.userLocation.lat, this.userLocation.lng, h.latitude, h.longitude)
      }));
    }

    if (this.filters.query) {
      const q = this.filters.query.toLowerCase().trim();
      halls = halls.filter(h => 
        (h.name && h.name.toLowerCase().includes(q)) || 
        (h.city && h.city.toLowerCase().includes(q)) || 
        (h.area && h.area.toLowerCase().includes(q)) ||
        (h.state && h.state.toLowerCase().includes(q))
      );
    }

    // Proximity radius filter ONLY applies when user has actively enabled "Find Halls Near Me"
    if (this.isNearMeActive && this.userLocation && this.filters.radius) {
      halls = halls.filter(h => (h.distance_km || 0) <= this.filters.radius);
    }

    if (this.filters.publicOnly) {
      halls = halls.filter(h => h.public_availability === true);
    }

    if (this.filters.capacityRange === '200-500') {
      halls = halls.filter(h => h.seating_capacity >= 200 && h.seating_capacity <= 500);
    } else if (this.filters.capacityRange === '500-1000') {
      halls = halls.filter(h => h.seating_capacity >= 500 && h.seating_capacity <= 1000);
    } else if (this.filters.capacityRange === '1000+') {
      halls = halls.filter(h => h.seating_capacity > 1000);
    }

    if (this.filters.acType !== 'all') {
      halls = halls.filter(h => h.ac_status && h.ac_status.toLowerCase().includes(this.filters.acType.toLowerCase()));
    }

    if (this.filters.cateringPolicy && this.filters.cateringPolicy !== 'all') {
      halls = halls.filter(h => h.catering_policy === this.filters.cateringPolicy);
    }

    if (this.filters.maxPrice && this.filters.maxPrice < 300000) {
      halls = halls.filter(h => ((h.pricing?.evening || h.pricing?.morning || 0) <= this.filters.maxPrice));
    }

    // Two-Tier Priority Ordering:
    // Priority Tier 1: Verified Paid/Premium Venues (Featured First)
    // Priority Tier 2: Non-Paying / Basic Venues (Placed at Bottom)
    const sortFn = (a, b) => {
      if (this.filters.sortBy === 'nearest') {
        return (a.distance_km || 0) - (b.distance_km || 0);
      } else if (this.filters.sortBy === 'capacity') {
        return ((b.maximum_capacity || b.seating_capacity || 0) - (a.maximum_capacity || a.seating_capacity || 0));
      } else if (this.filters.sortBy === 'price_asc') {
        const pA = a.pricing ? (a.pricing.evening || a.pricing.morning || 75000) : 75000;
        const pB = b.pricing ? (b.pricing.evening || b.pricing.morning || 75000) : 75000;
        return pA - pB;
      } else if (this.filters.sortBy === 'price_desc') {
        const pA = a.pricing ? (a.pricing.evening || a.pricing.morning || 75000) : 75000;
        const pB = b.pricing ? (b.pricing.evening || b.pricing.morning || 75000) : 75000;
        return pB - pA;
      } else {
        // Default: Sort by Rating Descending
        return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      }
    };

    const paidHalls = halls.filter(h => h.listing_tier === 'PREMIUM' || h.listing_fee_paid).sort(sortFn);
    const unpaidHalls = halls.filter(h => !(h.listing_tier === 'PREMIUM' || h.listing_fee_paid)).sort(sortFn);

    return [...paidHalls, ...unpaidHalls];
  },

  renderHallCards() {
    const halls = this.getFilteredHalls();

    if (halls.length === 0) {
      return `
        <div class="col-span-full p-8 text-center bg-surface-container-lowest rounded-xl border border-outline">
          <span class="material-symbols-outlined text-[36px] text-on-surface-variant">search_off</span>
          <h3 class="font-title-md text-base font-bold text-on-surface mt-2">No Verified Halls Match Your Filters</h3>
          <p class="text-xs text-on-surface-variant mt-1">Try increasing your distance radius or resetting capacity filters.</p>
          <button class="mt-4 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg" onclick="SearchView.resetFilters()">
            Clear All Filters
          </button>
        </div>
      `;
    }

    return halls.map(hall => {
      const isFav = window.appStore.isFavorite(hall.id);
      const fallbackUrl = window.appStore.getPlaceholderImage(hall.name);
      const isBasic = (hall.listing_tier === 'BASIC' || !hall.listing_fee_paid);
      const cateringInfo = (window.appStore && window.appStore.getCateringPolicyInfo) 
        ? window.appStore.getCateringPolicyInfo(hall.catering_policy)
        : { label: 'Veg & Non-Veg Allowed', icon: 'restaurant', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' };

      if (isBasic) {
        // Non-paying halls: Display Company Logo instead of venue photos, no external website link
        const logoUrl = (window.appStore && window.appStore.getCompanyLogoPlaceholder) ? window.appStore.getCompanyLogoPlaceholder(hall.name) : fallbackUrl;
        return `
          <div class="group bg-surface-container-lowest rounded-xl border border-outline shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
            
            <!-- Company Brand Emblem in place of hall photos -->
            <div class="relative w-full aspect-[16/10] overflow-hidden bg-primary cursor-pointer border-b border-outline/50" onclick="window.location.hash='#/hall/${hall.id}'">
              <img src="${logoUrl}" alt="Halls Now Certified Directory - ${hall.name}" class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" loading="lazy">
              
              <button class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur ${isFav ? 'text-secondary' : 'text-on-surface-variant'} hover:text-secondary flex items-center justify-center transition-colors shadow-sm z-10" onclick="event.stopPropagation(); window.appStore.toggleFavorite('${hall.id}'); SearchView.updateFavorites();" title="Save">
                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${isFav ? '1' : '0'};">favorite</span>
              </button>

              <div class="absolute bottom-2 left-2 flex items-center gap-1.5">
                <span class="px-2 py-0.5 rounded bg-primary/95 backdrop-blur border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 shadow-sm">
                  <span class="material-symbols-outlined text-[12px] text-amber-400">verified</span>
                  <span>Audited Directory</span>
                </span>
              </div>
            </div>

            <!-- Structured Content (No external website) -->
            <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div class="space-y-1">
                <div class="flex items-center justify-between text-on-surface-variant font-body-sm text-xs">
                  <span>${hall.area || hall.city} • <strong class="${this.isNearMeActive ? 'text-secondary font-bold' : ''}">${hall.distance_km || 5} km${this.isNearMeActive ? ' away' : ''}</strong></span>
                  <span class="flex items-center gap-0.5 text-on-surface font-bold">
                    <span class="material-symbols-outlined text-[15px] text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>
                    ${hall.rating || 4.5} (${hall.reviews_count || 0})
                  </span>
                </div>

                <h3 class="font-title-lg text-sm md:text-base font-bold text-on-surface group-hover:text-secondary transition-colors cursor-pointer line-clamp-1" onclick="window.location.hash='#/hall/${hall.id}'">
                  ${hall.name}
                </h3>

                <p class="font-body-sm text-xs text-on-surface-variant">
                  Seats ${hall.seating_capacity} • Max ${hall.maximum_capacity} Pax
                </p>

                <div class="pt-1 flex flex-wrap gap-1">
                  <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${cateringInfo.badgeClass || 'bg-amber-50 text-amber-800 border-amber-200'} font-medium">
                    <span class="material-symbols-outlined text-[12px]">${cateringInfo.icon}</span>
                    ${cateringInfo.label}
                  </span>
                </div>

                <div class="pt-1 flex items-center gap-1 text-[11px] text-amber-900 dark:text-amber-300 font-semibold">
                  <span class="material-symbols-outlined text-[14px]">handshake</span>
                  <span>Direct Offline Settlement with Host</span>
                </div>
              </div>

              <div class="pt-3 flex items-center justify-between border-t border-outline mt-auto">
                <div>
                  <span class="font-title-md text-sm font-bold text-on-surface">₹${hall.pricing ? (hall.pricing.evening || hall.pricing.morning).toLocaleString() : '40,000'}</span>
                  <span class="font-body-sm text-[11px] text-on-surface-variant"> /shift</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" onclick="Modals.openShareModal('${hall.id}')" title="Share Venue">
                    <span class="material-symbols-outlined text-[16px]">share</span>
                  </button>
                  <a class="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline rounded-lg text-xs font-bold transition-colors" href="#/hall/${hall.id}">
                    View Directory
                  </a>
                </div>
              </div>

            </div>

          </div>
        `;
      }

      return `
        <div class="group bg-surface-container-lowest rounded-xl border border-outline shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
          
          <!-- 1. Image, Save Button, Availability Badge (Aspect ratio 16:10) -->
          <div class="relative w-full aspect-[16/10] overflow-hidden bg-surface-container cursor-pointer" onclick="window.location.hash='#/hall/${hall.id}'">
            <img src="${hall.cover_image}" alt="${hall.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
            
            <button class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur ${isFav ? 'text-secondary' : 'text-on-surface-variant'} hover:text-secondary flex items-center justify-center transition-colors shadow-sm z-10" onclick="event.stopPropagation(); window.appStore.toggleFavorite('${hall.id}'); SearchView.updateFavorites();" title="Save">
              <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${isFav ? '1' : '0'};">favorite</span>
            </button>

            <!-- Non-color reliant status badge -->
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
              ${hall.ac_status ? `
                <span class="px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white text-[10px] font-medium">
                  ${hall.ac_status}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Structured Content -->
          <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
            <div class="space-y-1">
              <!-- 2. Venue Name & Rating -->
              <div class="flex items-center justify-between text-on-surface-variant font-body-sm text-xs">
                <span>${hall.area || hall.city} • <strong class="${this.isNearMeActive ? 'text-secondary font-bold' : ''}">${hall.distance_km || 5} km${this.isNearMeActive ? ' away' : ''}</strong></span>
                <span class="flex items-center gap-0.5 text-on-surface font-bold">
                  <span class="material-symbols-outlined text-[15px] text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>
                  ${hall.rating || 5.0} (${hall.reviews_count || 0})
                </span>
              </div>

              <h3 class="font-title-lg text-sm md:text-base font-bold text-on-surface group-hover:text-secondary transition-colors cursor-pointer line-clamp-1" onclick="window.location.hash='#/hall/${hall.id}'">
                ${hall.name}
              </h3>

              <!-- 3 & 4. Location, Capacity & Venue Type -->
              <p class="font-body-sm text-xs text-on-surface-variant">
                Seats ${hall.seating_capacity} • Max ${hall.maximum_capacity} Pax
              </p>

              <div class="pt-1 flex flex-wrap items-center gap-1">
                <span class="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface">${(hall.hall_type || 'Banquet Hall').split('&')[0].trim()}</span>
                ${hall.indoor_outdoor ? `<span class="text-[10px] px-2 py-0.5 rounded bg-surface-container text-on-surface">${hall.indoor_outdoor}</span>` : ''}
                <span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${cateringInfo.badgeClass || 'bg-amber-50 text-amber-800 border-amber-200'} font-medium">
                  <span class="material-symbols-outlined text-[12px]">${cateringInfo.icon}</span>
                  ${cateringInfo.label}
                </span>
              </div>
            </div>

            <!-- 5, 6, 7. Pricing, Primary CTA ("View venue"), Secondary Actions -->
            <div class="pt-3 flex items-center justify-between border-t border-outline">
              <div>
                <span class="font-title-md text-sm font-bold text-on-surface">₹${hall.pricing ? hall.pricing.evening.toLocaleString() : '75,000'}</span>
                <span class="font-body-sm text-[10px] text-on-surface-variant"> /shift</span>
              </div>
              
              <div class="flex items-center gap-1.5">
                <button class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" onclick="Modals.openShareModal('${hall.id}')" title="Share Venue">
                  <span class="material-symbols-outlined text-[16px]">share</span>
                </button>

                <button class="p-1.5 rounded-lg text-on-surface-variant hover:text-tertiary hover:bg-surface-container" onclick="window.open('https://wa.me/${hall.contact?.whatsapp?.replace(/[^0-9]/g, '') || '918258229988'}', '_blank')" title="WhatsApp Venue">
                  <span class="material-symbols-outlined text-[16px]">chat</span>
                </button>

                <a class="px-3 py-1.5 bg-primary text-white hover:bg-inverse-surface rounded-lg font-label-md text-xs uppercase tracking-wider transition-colors font-bold" href="#/hall/${hall.id}">
                  View Venue
                </a>
              </div>
            </div>
          </div>

        </div>
      `;
    }).join('');
  },

  postRender() {
    const qInput = document.getElementById('filter-query');
    if (qInput) {
      qInput.value = this.filters.query || '';
    }
    // If incoming with nearMe query param and not yet located, trigger auto-detection
    if (sessionStorage.getItem('search_near_me') === 'true' && !this.userLocation) {
      this.detectUserLocation();
    }
  },

  initMap(mapContainerId) {
    const mapEl = document.getElementById(mapContainerId);
    if (!mapEl || typeof L === 'undefined') return;

    if (this.mapInstance) {
      this.mapInstance.remove();
      this.mapInstance = null;
    }

    const defaultLat = this.userLocation ? this.userLocation.lat : 13.2185;
    const defaultLng = this.userLocation ? this.userLocation.lng : 74.9983;

    this.mapInstance = L.map(mapContainerId, {
      scrollWheelZoom: false
    }).setView([defaultLat, defaultLng], this.userLocation ? 12 : 11);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap & CARTO',
      maxZoom: 18
    }).addTo(this.mapInstance);

    this.renderMapMarkers();
    if (this.userLocation) {
      this.renderUserMarker();
    }
  },

  renderMapMarkers() {
    if (!this.mapInstance) return;

    this.mapMarkers.forEach(m => this.mapInstance.removeLayer(m));
    this.mapMarkers = [];

    const halls = this.getFilteredHalls();

    halls.forEach(hall => {
      if (!hall.latitude || !hall.longitude) return;

      const customIcon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `
          <div class="custom-map-pin" id="pin-${hall.id}">
            <span class="material-symbols-outlined pin-icon">castle</span>
            <span>₹${hall.pricing ? Math.round(hall.pricing.evening / 1000) + 'k' : '75k'}</span>
          </div>
        `,
        iconSize: [64, 26],
        iconAnchor: [32, 13]
      });

      const marker = L.marker([hall.latitude, hall.longitude], { icon: customIcon }).addTo(this.mapInstance);

      marker.bindPopup(`
        <div style="width: 220px;" class="p-2 space-y-2">
          <img src="${hall.cover_image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px;">
          <div>
            <div style="font-weight: 700; font-size: 13px; color: #111827;">${hall.name}</div>
            <div style="font-size: 11px; color: #4b5563;">${hall.city} • Seats ${hall.seating_capacity}</div>
            <div style="font-size: 12px; font-weight: 700; color: #A65B2B; margin-top: 4px;">
              ₹${hall.pricing ? hall.pricing.evening.toLocaleString() : '75,000'} <span style="font-size: 10px; font-weight: 400; color: #6b7280;">/shift</span>
            </div>
            <a href="#/hall/${hall.id}" style="display: block; text-align: center; background: #111827; color: #ffffff; padding: 6px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; margin-top: 8px; text-decoration: none;">
              View Venue
            </a>
          </div>
        </div>
      `);

      marker.hallId = hall.id;
      this.mapMarkers.push(marker);
    });
  },

  highlightMarker(hallId) {
    const marker = this.mapMarkers.find(m => m.hallId === hallId);
    if (marker && this.mapInstance) {
      marker.openPopup();
    }
  },

  updateFilter(key, val) {
    this.filters[key] = val;
    this.refreshCardsAndMap();
  },

  setSort(sortBy) {
    this.filters.sortBy = sortBy;
    this.refreshCardsAndMap();
  },

  setLayout(layout) {
    this.currentLayout = 'grid';
  },

  resetFilters() {
    this.filters = {
      query: '',
      city: '',
      radius: 50,
      publicOnly: false,
      capacityRange: 'all',
      acType: 'all',
      cateringPolicy: 'all',
      maxPrice: 300000,
      sortBy: 'nearest'
    };
    this.isNearMeActive = false;
    this.userLocation = null;
    sessionStorage.removeItem('search_filter_location');
    sessionStorage.removeItem('search_near_me');
    sessionStorage.removeItem('search_user_lat');
    sessionStorage.removeItem('search_user_lng');
    sessionStorage.removeItem('ai_active_criteria');
    
    const qInput = document.getElementById('filter-query');
    if (qInput) qInput.value = '';
    
    this.refreshCardsAndMap();
  },

  refreshCardsAndMap() {
    const sortChips = document.getElementById('search-sort-chips');
    if (sortChips) {
      sortChips.innerHTML = this.renderSortChips();
    }
    const list = document.getElementById('search-cards-list');
    if (list) {
      list.innerHTML = this.renderHallCards();
    }
    const count = document.getElementById('search-results-count');
    if (count) {
      count.innerText = `${this.getFilteredHalls().length} venues found`;
    }
    const countHeader = document.getElementById('search-results-count-header');
    if (countHeader) {
      countHeader.innerText = `${this.getFilteredHalls().length} venues found`;
    }
  },

  updateFavorites() {
    const badge = document.getElementById('saved-count-badge');
    if (badge) badge.innerText = window.appStore.getFavorites().length;
    this.refreshCardsAndMap();
  },

  toggleMobileFilters() {
    const d = document.getElementById('mobile-filter-drawer');
    if (d) d.classList.toggle('hidden');
  }
};

window.SearchView = SearchView;
