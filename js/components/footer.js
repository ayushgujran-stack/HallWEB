// Footer Component matching VenueLuxe luxury design

const FooterComponent = {
  render() {
    return `
      <footer class="w-full bg-surface-container-low text-on-surface border-t border-outline">
        <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-space-2xl md:py-space-3xl">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl">
            
            <!-- Brand Overview -->
            <div class="lg:col-span-2 space-y-space-md">
              <div class="flex items-center gap-2.5">
                ${HeaderComponent.getLogoSvg(30)}
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
                <li><a class="hover:text-secondary transition-colors" href="#/search">Wedding Halls</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Reception Banquet Halls</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Convention Centers</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Party & Birthday Venues</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Open Lawns & Resorts</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Community Halls</a></li>
              </ul>
            </div>

            <!-- Popular Hubs -->
            <div>
              <h4 class="font-label-md text-xs uppercase tracking-wider text-on-surface mb-space-md font-bold">Popular Locations</h4>
              <ul class="space-y-2 font-body-sm text-xs md:text-sm text-on-surface-variant">
                <li><a class="hover:text-secondary transition-colors" href="#/search">Karkala Heritage Halls</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Mangalore Coastal Banquets</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Udupi & Manipal Venues</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Bangalore Event Spaces</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/search">Airport Road Resorts</a></li>
              </ul>
            </div>

            <!-- Governance & Portals -->
            <div>
              <h4 class="font-label-md text-xs uppercase tracking-wider text-on-surface mb-space-md font-bold">Portals & Workspaces</h4>
              <ul class="space-y-2 font-body-sm text-xs md:text-sm text-on-surface-variant">
                <li><a class="hover:text-secondary transition-colors" href="#/owner">Hall Owner Dashboard</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/admin">Admin Verification Center</a></li>
                <li><a class="hover:text-secondary transition-colors" href="#/customer">Customer Portal</a></li>
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
              <a class="hover:text-on-surface transition-colors" href="#/admin">Verification Standards</a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
};

window.FooterComponent = FooterComponent;
