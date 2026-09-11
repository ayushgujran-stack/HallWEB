// Header Component for VenueLuxe with unified role switching, notification drawer, and mobile menu

const HeaderComponent = {
  getLogoSvg(size = 32) {
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
    const currentRole = window.appStore.getCurrentRole();
    const currentUser = window.appStore.getCurrentUser();
    const favoritesCount = window.appStore.getFavorites().length;
    const notifications = window.appStore.getNotifications();
    const unreadNotifsCount = notifications.filter(n => n.unread).length;
    const currentHash = window.location.hash || '#/';

    return `
      <header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_4px_rgba(17,24,39,0.03)] border-b border-outline">
        <div class="h-20 max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop flex items-center justify-between gap-space-sm">
          
          <!-- Logo & Brand Mark (Inline SVG Fallback-Safe) -->
          <div class="flex items-center gap-2.5 shrink-0">
            <a href="#/" class="flex items-center gap-2.5 group cursor-pointer" aria-label="VenueLuxe Home">
              ${this.getLogoSvg(34)}
              <span class="font-headline-sm text-xl md:text-2xl text-on-surface tracking-tight font-serif">
                Venue<span class="text-secondary font-bold">Luxe</span>
              </span>
            </a>
          </div>

          <!-- Desktop Primary Navigation (Clean & Streamlined) -->
          <nav class="hidden lg:flex items-center gap-1.5" id="nav-links" aria-label="Main Navigation">
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg ${currentHash === '#/search' ? 'text-secondary bg-surface-container font-bold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}" href="#/search">
              Find Halls
            </a>
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg ${currentHash === '#how-it-works' ? 'text-secondary bg-surface-container font-bold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}" href="#how-it-works">
              How It Works
            </a>
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" href="#/owner/list-hall">
              List Your Hall
            </a>
          </nav>

          <!-- Action Hub & Unified Controls -->
          <div class="flex items-center gap-1.5 md:gap-2.5 shrink-0">
            
            <!-- Dedicated Portal & Role Switcher Dropdown (Requirement #2, #29) -->
            <div class="relative hidden sm:block">
              <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline text-xs font-semibold text-on-surface transition-all" onclick="HeaderComponent.togglePortalMenu()" id="portal-switcher-btn" title="Switch Portal Role">
                <span class="w-2 h-2 rounded-full ${currentRole === 'customer' ? 'bg-primary' : (currentRole === 'owner' ? 'bg-secondary' : 'bg-tertiary')}"></span>
                <span class="capitalize">${currentRole === 'customer' ? 'Customer View' : (currentRole === 'owner' ? 'Hall Owner' : 'Super Admin')}</span>
                <span class="material-symbols-outlined text-[16px] text-on-surface-variant">expand_more</span>
              </button>

              <!-- Portal Switcher Dropdown Menu -->
              <div class="hidden absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline p-1.5 space-y-1 z-50" id="portal-dropdown">
                <div class="px-2.5 py-1.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Switch Workspace Role
                </div>
                <button onclick="HeaderComponent.switchRole('customer')" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${currentRole === 'customer' ? 'bg-surface-container text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px]">person</span>
                    <span>Customer Portal</span>
                  </div>
                  ${currentRole === 'customer' ? '<span class="material-symbols-outlined text-[16px] text-secondary">check</span>' : ''}
                </button>
                <button onclick="HeaderComponent.switchRole('owner')" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${currentRole === 'owner' ? 'bg-surface-container text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px]">domain</span>
                    <span>Hall Owner Workspace</span>
                  </div>
                  ${currentRole === 'owner' ? '<span class="material-symbols-outlined text-[16px] text-secondary">check</span>' : ''}
                </button>
                <button onclick="HeaderComponent.switchRole('admin')" class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors ${currentRole === 'admin' ? 'bg-surface-container text-on-surface font-bold' : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'}">
                  <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                    <span>Super Admin Center</span>
                  </div>
                  ${currentRole === 'admin' ? '<span class="material-symbols-outlined text-[16px] text-secondary">check</span>' : ''}
                </button>
              </div>
            </div>

            <!-- Saved Favorites -->
            <a class="relative w-10 h-10 text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors flex items-center justify-center rounded-lg" href="#/customer" title="Saved Halls">
              <span class="material-symbols-outlined text-[20px]">favorite</span>
              <span class="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-secondary text-white font-label-sm text-[10px] flex items-center justify-center font-bold" id="saved-count-badge">
                ${favoritesCount}
              </span>
            </a>

            <!-- Bookings Link -->
            <a class="hidden md:flex items-center gap-1.5 px-3 py-2 font-body-md text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-all" href="${currentRole === 'owner' ? '#/owner' : (currentRole === 'admin' ? '#/admin' : '#/customer')}" title="My Bookings">
              <span class="material-symbols-outlined text-[18px]">event_available</span>
              <span>Bookings</span>
            </a>

            <!-- Notifications Bell -->
            <div class="relative">
              <button class="relative w-10 h-10 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center rounded-lg" onclick="HeaderComponent.toggleNotifDrawer()" title="Notifications" aria-label="Open notifications">
                <span class="material-symbols-outlined text-[20px]">notifications</span>
                ${unreadNotifsCount > 0 ? `
                  <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
                ` : ''}
              </button>

              <!-- Notifications Dropdown -->
              <div class="hidden absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline p-3 space-y-2 z-50" id="notif-dropdown">
                <div class="flex items-center justify-between pb-2 border-b border-outline">
                  <span class="font-title-md text-xs font-bold text-on-surface uppercase tracking-wider">Notifications</span>
                  <button class="text-[11px] text-secondary hover:underline font-semibold" onclick="HeaderComponent.markAllNotifsRead()">Mark read</button>
                </div>
                <div class="max-h-64 overflow-y-auto space-y-1.5">
                  ${notifications.length ? notifications.slice(0, 5).map(n => `
                    <a href="${n.link}" class="block p-2 rounded-lg hover:bg-surface-container-low transition-colors ${n.unread ? 'bg-surface-container/60 font-semibold' : ''}">
                      <div class="text-xs text-on-surface">${n.title}</div>
                      <div class="text-[11px] text-on-surface-variant mt-0.5 leading-tight">${n.message}</div>
                      <div class="text-[10px] text-on-surface-variant/70 mt-1">${n.date}</div>
                    </a>
                  `).join('') : '<div class="text-center py-4 text-xs text-on-surface-variant">No new notifications</div>'}
                </div>
              </div>
            </div>

            <!-- Primary List Hall CTA -->
            <button class="hidden sm:inline-flex items-center justify-center px-4 py-2 font-label-md text-xs uppercase tracking-wider rounded-lg bg-secondary text-white hover:bg-secondary-container transition-all shadow-sm font-bold active:scale-[0.98]" onclick="Modals.openAddHallWizard()">
              + List Your Hall
            </button>

            <!-- User Profile Avatar Pill -->
            <div class="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-surface-container transition-colors" onclick="Modals.openRoleSelectorModal()" title="Current Profile: ${currentUser.name} (${currentRole})">
              <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">
                ${currentUser.name ? currentUser.name[0] : 'U'}
              </div>
              <div class="hidden xl:flex flex-col text-left leading-tight">
                <span class="text-xs font-bold text-on-surface truncate max-w-[90px]">${currentUser.name.split(' ')[0]}</span>
                <span class="text-[10px] text-secondary uppercase font-semibold">${currentRole}</span>
              </div>
            </div>

            <!-- Mobile Menu Toggle Button (44x44 Touch Target) -->
            <button class="lg:hidden w-11 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-lg transition-colors ml-1" onclick="HeaderComponent.toggleMobileMenu()" aria-label="Toggle navigation menu">
              <span class="material-symbols-outlined text-[24px]">menu</span>
            </button>

          </div>
        </div>

        <!-- Mobile Slide-over Drawer -->
        <div class="hidden lg:hidden fixed inset-0 z-50" id="mobile-menu-drawer">
          <!-- Backdrop -->
          <div class="fixed inset-0 bg-primary/40 backdrop-blur-sm drawer-backdrop" onclick="HeaderComponent.toggleMobileMenu()"></div>
          
          <!-- Drawer Content -->
          <div class="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-surface-container-lowest shadow-2xl p-space-lg flex flex-col justify-between overflow-y-auto drawer-content border-l border-outline">
            
            <div class="space-y-space-md">
              <!-- Header -->
              <div class="flex items-center justify-between pb-space-sm border-b border-outline">
                <div class="flex items-center gap-2">
                  ${this.getLogoSvg(28)}
                  <span class="font-headline-sm text-lg text-on-surface font-serif">Venue<span class="text-secondary font-bold">Luxe</span></span>
                </div>
                <button class="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container" onclick="HeaderComponent.toggleMobileMenu()" aria-label="Close menu">
                  <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <!-- User Identity Card -->
              <div class="p-3 bg-surface-container rounded-xl flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  ${currentUser.name ? currentUser.name[0] : 'U'}
                </div>
                <div>
                  <div class="font-bold text-xs text-on-surface">${currentUser.name}</div>
                  <div class="text-[10px] text-secondary font-bold uppercase">${currentRole} Mode</div>
                </div>
              </div>

              <!-- Role Switcher Segment -->
              <div class="space-y-1">
                <span class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">Switch Workspace:</span>
                <div class="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-lg">
                  <button onclick="HeaderComponent.switchRole('customer'); HeaderComponent.toggleMobileMenu();" class="py-1.5 text-center text-xs rounded font-bold ${currentRole === 'customer' ? 'bg-primary text-white shadow-sm' : 'text-on-surface'}">Customer</button>
                  <button onclick="HeaderComponent.switchRole('owner'); HeaderComponent.toggleMobileMenu();" class="py-1.5 text-center text-xs rounded font-bold ${currentRole === 'owner' ? 'bg-primary text-white shadow-sm' : 'text-on-surface'}">Owner</button>
                  <button onclick="HeaderComponent.switchRole('admin'); HeaderComponent.toggleMobileMenu();" class="py-1.5 text-center text-xs rounded font-bold ${currentRole === 'admin' ? 'bg-primary text-white shadow-sm' : 'text-on-surface'}">Admin</button>
                </div>
              </div>

              <!-- Navigation Links -->
              <div class="space-y-1 pt-2">
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/" onclick="HeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">home</span>
                  <span>Home</span>
                </a>
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/search" onclick="HeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">search</span>
                  <span>Find Venues</span>
                </a>
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/customer" onclick="HeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">event_available</span>
                  <span>My Bookings & Saved</span>
                </a>
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/owner" onclick="HeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">domain</span>
                  <span>Hall Owner Workspace</span>
                </a>
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/admin" onclick="HeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">admin_panel_settings</span>
                  <span>Admin Verification Center</span>
                </a>
              </div>
            </div>

            <!-- Bottom CTA Button in Mobile Menu -->
            <div class="pt-4 border-t border-outline">
              <button class="w-full py-3 bg-secondary text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-secondary-container transition-all flex items-center justify-center gap-2" onclick="Modals.openAddHallWizard(); HeaderComponent.toggleMobileMenu()">
                <span class="material-symbols-outlined text-[18px]">add_circle</span>
                <span>List Your Hall</span>
              </button>
            </div>

          </div>
        </div>
      </header>
    `;
  },

  switchRole(role) {
    window.appStore.setCurrentRole(role);
    Toast.luxury('Workspace Switched', `Switched mode to ${role.toUpperCase()}.`);

    // Intelligently route if relevant
    if (role === 'owner') {
      window.location.hash = '#/owner';
    } else if (role === 'admin') {
      window.location.hash = '#/admin';
    } else if (role === 'customer' && (window.location.hash.startsWith('#/owner') || window.location.hash.startsWith('#/admin'))) {
      window.location.hash = '#/';
    } else {
      HeaderComponent.update();
      window.dispatchEvent(new CustomEvent('hashchange'));
    }
  },

  update() {
    const container = document.getElementById('header-root');
    if (container) {
      container.innerHTML = this.render();
    }
  },

  togglePortalMenu() {
    const p = document.getElementById('portal-dropdown');
    if (p) p.classList.toggle('hidden');
  },

  toggleNotifDrawer() {
    const d = document.getElementById('notif-dropdown');
    if (d) d.classList.toggle('hidden');
  },

  markAllNotifsRead() {
    window.appStore.markNotificationsRead();
    HeaderComponent.update();
    Toast.info('Notifications', 'All notifications marked as read.');
  },

  toggleMobileMenu() {
    const m = document.getElementById('mobile-menu-drawer');
    if (m) m.classList.toggle('hidden');
  }
};

window.HeaderComponent = HeaderComponent;

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  const portalBtn = document.getElementById('portal-switcher-btn');
  const portalDropdown = document.getElementById('portal-dropdown');
  if (portalDropdown && !portalDropdown.classList.contains('hidden') && portalBtn && !portalBtn.contains(e.target) && !portalDropdown.contains(e.target)) {
    portalDropdown.classList.add('hidden');
  }
});

// Listen to store updates
window.addEventListener('favoritesUpdated', () => {
  const badge = document.getElementById('saved-count-badge');
  if (badge) badge.innerText = window.appStore.getFavorites().length;
});

window.addEventListener('roleChanged', () => {
  HeaderComponent.update();
});
