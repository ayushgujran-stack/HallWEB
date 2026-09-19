// Footer Component matching Halls Now luxury design

const FooterComponent = {
  getLogoSvg(size = 30) {
    const comp = window.CustomerHeaderComponent || window.OwnerHeaderComponent || window.AdminHeaderComponent || window.HeaderComponent;
    if (comp && typeof comp.getLogoSvg === 'function') {
      return comp.getLogoSvg(size);
    }
    return `
      <div class="relative shrink-0 rounded-xl overflow-hidden shadow-sm" style="width: ${size}px; height: ${size}px; background: #080B11;">
        <img src="../shared/assets/halls-now-logo.png" alt="Halls Now" class="w-full h-full object-cover" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <svg style="display:none;" width="${size}" height="${size}" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="54" height="54" rx="10" fill="#080B11"/>
          <path d="M12 44V24C12 15.7157 18.7157 9 27 9C35.2843 9 42 15.7157 42 24V44" stroke="#E5C378" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M17 44V25C17 19.4772 21.4772 15 27 15C32.5228 15 37 19.4772 37 25V44" stroke="#E5C378" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M22 44V26C22 23.2386 24.2386 21 27 21C29.7614 21 32 23.2386 32 26V44" stroke="#E5C378" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M30 24C30 25.5 31.5 27 33 27C31.5 27 30 28.5 30 30C30 28.5 28.5 27 27 27C28.5 27 30 25.5 30 24Z" fill="#E5C378"/>
        </svg>
      </div>
    `;
  },

  render() {
    return `
      <footer class="w-full bg-surface-container-low text-on-surface border-t border-outline">
        <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-space-2xl md:py-space-3xl">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
            
            <!-- Brand Overview -->
            <div class="lg:col-span-2 space-y-space-md">
              <div class="flex items-center gap-2.5">
                ${this.getLogoSvg(30)}
                <span class="font-headline-sm text-xl text-on-surface tracking-tight font-serif">
                  Halls <span class="text-secondary font-bold">Now</span>
                </span>
              </div>
              <p class="font-body-md text-xs md:text-sm text-on-surface-variant max-w-sm leading-relaxed">
                Premier Indian wedding and event-venue marketplace. Discover verified banquet halls, heritage palaces, open lawns, and convention centers with transparent pricing and live shift holds.
              </p>
              <div class="flex items-center gap-space-xs text-on-surface-variant">
                <span class="material-symbols-outlined text-[18px] text-tertiary">verified</span>
                <span class="font-label-sm text-xs font-semibold tracking-wider uppercase text-on-surface">100% Certified On-Site Audited Halls</span>
              </div>
            </div>

            <!-- Categories -->
            <div>
              <h4 class="font-label-md text-xs uppercase tracking-wider text-on-surface mb-space-md font-bold">Venue Categories</h4>
              <ul class="space-y-2 font-body-sm text-xs md:text-sm text-on-surface-variant">
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Wedding Halls</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Reception Banquet Halls</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Convention Centers</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Party & Birthday Venues</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Open Lawns & Resorts</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Community Halls</a></li>
              </ul>
            </div>

            <!-- Popular Hubs -->
            <div>
              <h4 class="font-label-md text-xs uppercase tracking-wider text-on-surface mb-space-md font-bold">Popular Locations</h4>
              <ul class="space-y-2 font-body-sm text-xs md:text-sm text-on-surface-variant">
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Karkala Heritage Halls</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Mangalore Coastal Banquets</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Udupi & Manipal Venues</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Bangalore Event Spaces</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/customer/#/search">Airport Road Resorts</a></li>
              </ul>
            </div>

            <!-- Governance & Portals -->
            <div>
              <h4 class="font-label-md text-xs uppercase tracking-wider text-on-surface mb-space-md font-bold">Portals &amp; Workspaces</h4>
              <ul class="space-y-2 font-body-sm text-xs md:text-sm text-on-surface-variant">
                <li><a class="hover:text-secondary transition-colors" href="/customer/">Customer Portal</a></li>
                <li><a class="hover:text-secondary transition-colors" href="/owner/">Hall Owner Dashboard</a></li>
                <li><a class="hover:text-secondary transition-colors" href="javascript:void(0)" onclick="Modals.openAddHallWizard()">List Your Hall</a></li>
                <li><a class="hover:text-secondary transition-colors" href="javascript:void(0)" onclick="window.appStore.resetToDefaults(); Toast.success('Reset Complete', 'Demo data reinitialized.'); location.reload();">Reset Demo Data</a></li>
              </ul>
            </div>

          </div>

          <div class="mt-space-2xl pt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-outline text-xs text-on-surface-variant">
            <p>
              © 2025 Halls Now. Premier Event & Wedding Venues. All rights reserved.
            </p>
            <div class="flex items-center gap-space-md">
              <a class="hover:text-on-surface transition-colors" href="#how-it-works">Privacy Policy</a>
              <a class="hover:text-on-surface transition-colors" href="#how-it-works">Terms of Service</a>
              <a class="hover:text-on-surface transition-colors" href="#how-it-works">Quality & Safety Standards</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};

window.FooterComponent = FooterComponent;
