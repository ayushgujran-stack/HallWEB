// Footer Component matching VenueLuxe luxury design

const FooterComponent = {
  getLogoSvg(size = 30) {
    const comp = window.CustomerHeaderComponent || window.OwnerHeaderComponent || window.AdminHeaderComponent || window.HeaderComponent;
    if (comp && typeof comp.getLogoSvg === 'function') {
      return comp.getLogoSvg(size);
    }
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="shrink-0">
        <rect width="40" height="40" rx="10" fill="#111827"/>
        <path d="M20 7C14.4772 7 10 11.4772 10 17V33H30V17C30 11.4772 25.5228 7 20 7Z" stroke="#A65B2B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 13C16.6863 13 14 15.6863 14 19V33H26V19C26 15.6863 23.3137 13 20 13Z" fill="#A65B2B" fill-opacity="0.15" stroke="#A65B2B" stroke-width="1.5"/>
        <circle cx="20" cy="18" r="2.5" fill="#FAF8F5"/>
        <line x1="20" y1="23" x2="20" y2="33" stroke="#A65B2B" stroke-width="1.5"/>
      </svg>
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
                  Venue<span class="text-secondary font-bold">Luxe</span>
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
              © 2025 VenueLuxe Marketplace. Premier Event & Wedding Venues. All rights reserved.
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
