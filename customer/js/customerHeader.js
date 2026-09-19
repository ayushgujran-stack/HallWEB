// Customer Portal Header — Halls Now
// Auth-aware: shows Sign In/Sign Up for guests, user menu for logged-in customers

const CustomerHeaderComponent = {
  getLogoSvg(size = 36) {
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
    const isLoggedIn = window.Auth && window.Auth.isLoggedIn();
    const currentUser = isLoggedIn ? window.Auth.getCurrentUser() : null;
    const favoritesCount = isLoggedIn ? window.appStore.getFavorites().length : 0;
    const notifications = isLoggedIn ? window.appStore.getNotifications() : [];
    const unreadNotifsCount = notifications.filter(n => n.unread).length;
    const currentHash = window.location.hash || '#/';

    return `
      <header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_4px_rgba(17,24,39,0.03)] border-b border-outline">
        <div class="h-20 max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop flex items-center justify-between gap-space-sm">

          <!-- Logo & Brand -->
          <div class="flex items-center gap-2.5 shrink-0">
            <a href="#/" class="flex items-center gap-2.5 group cursor-pointer" aria-label="Halls Now Home">
              ${this.getLogoSvg(36)}
              <span class="font-headline-sm text-xl md:text-2xl text-on-surface tracking-tight font-serif">
                Halls <span class="text-secondary font-bold">Now</span>
              </span>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center gap-2" id="nav-links" aria-label="Main Navigation">
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg ${currentHash === '#/search' ? 'text-secondary bg-surface-container font-bold' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'}" href="#/search">
              Find Halls
            </a>
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" href="#how-it-works">
              How It Works
            </a>
            
            ${isLoggedIn && (currentUser.role === 'owner' || (window.Auth && window.Auth.isOwnerUser(currentUser))) ? `
              <a href="/owner/" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-secondary hover:bg-secondary-container transition-all shadow-sm">
                <span class="material-symbols-outlined text-[16px]">domain</span>
                <span>Owner Workspace</span>
              </a>
            ` : `
              <button onclick="Modals.openAddHallWizard()" class="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-secondary bg-secondary-fixed hover:bg-secondary-fixed-dim border border-secondary/20 transition-all shadow-sm">
                <span class="material-symbols-outlined text-[16px]">add_business</span>
                <span>List Your Hall</span>
              </button>
            `}
          </nav>

          <!-- Right-side Actions -->
          <div class="flex items-center gap-1.5 md:gap-2.5 shrink-0">

            ${isLoggedIn ? `
              <!-- Saved Favorites -->
              <a class="relative w-10 h-10 text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors flex items-center justify-center rounded-lg" href="#/customer" title="Saved Halls">
                <span class="material-symbols-outlined text-[20px]">favorite</span>
                ${favoritesCount > 0 ? `<span class="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-secondary text-white font-label-sm text-[10px] flex items-center justify-center font-bold" id="saved-count-badge">${favoritesCount}</span>` : ''}
              </a>

              <!-- My Bookings -->
              <a class="hidden md:flex items-center gap-1.5 px-3 py-2 font-body-md text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-all" href="#/customer" title="My Bookings">
                <span class="material-symbols-outlined text-[18px]">event_available</span>
                <span>Bookings</span>
              </a>

              <!-- Notifications Bell -->
              <div class="relative">
                <button class="relative w-10 h-10 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center rounded-lg" onclick="CustomerHeaderComponent.toggleNotifDrawer()" title="Notifications" aria-label="Open notifications">
                  <span class="material-symbols-outlined text-[20px]">notifications</span>
                  ${unreadNotifsCount > 0 ? `<span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>` : ''}
                </button>
                <!-- Notifications Dropdown -->
                <div class="hidden absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline p-3 space-y-2 z-50" id="notif-dropdown">
                  <div class="flex items-center justify-between pb-2 border-b border-outline">
                    <span class="font-title-md text-xs font-bold text-on-surface uppercase tracking-wider">Notifications</span>
                    <button class="text-[11px] text-secondary hover:underline font-semibold" onclick="CustomerHeaderComponent.markAllNotifsRead()">Mark read</button>
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

              <!-- User Avatar + Dropdown -->
              <div class="relative" id="user-menu-root">
                <button class="flex items-center gap-2 cursor-pointer p-1 pr-2.5 rounded-full hover:bg-surface-container transition-colors border border-transparent hover:border-outline" onclick="CustomerHeaderComponent.toggleUserMenu()" title="Account">
                  <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
                    ${currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div class="hidden xl:flex flex-col text-left leading-tight">
                    <span class="text-xs font-bold text-on-surface truncate max-w-[90px]">${currentUser.name.split(' ')[0]}</span>
                    <span class="text-[10px] text-secondary uppercase font-semibold">
                      ${(currentUser.role === 'owner' || (window.Auth && window.Auth.isOwnerUser(currentUser))) ? 'Hall Owner' : 'Customer'}
                    </span>
                  </div>
                  <span class="material-symbols-outlined text-[16px] text-on-surface-variant hidden xl:block">expand_more</span>
                </button>
                <!-- User Dropdown -->
                <div class="hidden absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline p-2 z-50" id="user-menu-dropdown">
                  <div class="px-3 py-2 border-b border-outline mb-1">
                    <div class="text-xs font-bold text-on-surface">${currentUser.name}</div>
                    <div class="text-[11px] text-on-surface-variant truncate">${currentUser.email}</div>
                  </div>

                  ${(currentUser.role === 'owner' || (window.Auth && window.Auth.isOwnerUser(currentUser))) ? `
                    <a href="/owner/" class="flex items-center gap-2 px-3 py-2 text-xs font-bold text-secondary hover:bg-secondary-fixed rounded-lg transition-colors mb-1">
                      <span class="material-symbols-outlined text-[16px]">domain</span>
                      Go to Owner Workspace
                    </a>
                  ` : `
                    <button onclick="Modals.openAddHallWizard()" class="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-secondary hover:bg-secondary-fixed rounded-lg transition-colors mb-1 text-left">
                      <span class="material-symbols-outlined text-[16px]">add_business</span>
                      List Your Hall
                    </button>
                  `}

                  <a href="#/customer" class="flex items-center gap-2 px-3 py-2 text-xs text-on-surface hover:bg-surface-container rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[16px]">event_available</span>
                    My Bookings
                  </a>
                  <button onclick="CustomerHeaderComponent.signOut()" class="w-full flex items-center gap-2 px-3 py-2 text-xs text-error hover:bg-error-container rounded-lg transition-colors mt-1 text-left">
                    <span class="material-symbols-outlined text-[16px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            ` : `
              <!-- Guest: Sign In / Sign Up buttons -->
              <button
                id="header-signin-btn"
                onclick="Modals.openAuthModal(null, 'login')"
                class="px-4 py-2 text-xs font-bold rounded-lg text-on-surface hover:bg-surface-container transition-all border border-outline">
                Sign In
              </button>
              <button
                id="header-signup-btn"
                onclick="Modals.openAuthModal(null, 'signup')"
                class="hidden sm:inline-flex items-center justify-center px-4 py-2 font-label-md text-xs uppercase tracking-wider rounded-lg bg-secondary text-white hover:bg-secondary-container transition-all shadow-sm font-bold active:scale-[0.98]">
                Sign Up
              </button>
            `}

            <!-- Mobile Menu Toggle -->
            <button class="lg:hidden w-11 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-lg transition-colors ml-1" onclick="CustomerHeaderComponent.toggleMobileMenu()" aria-label="Toggle navigation menu">
              <span class="material-symbols-outlined text-[24px]">menu</span>
            </button>

          </div>
        </div>

        <!-- Mobile Slide-over Drawer -->
        <div class="hidden lg:hidden fixed inset-0 z-50" id="mobile-menu-drawer">
          <div class="fixed inset-0 bg-primary/40 backdrop-blur-sm" onclick="CustomerHeaderComponent.toggleMobileMenu()"></div>
          <div class="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-surface-container-lowest shadow-2xl p-space-lg flex flex-col justify-between overflow-y-auto border-l border-outline">
            <div class="space-y-space-md">
              <!-- Drawer Header -->
              <div class="flex items-center justify-between pb-space-sm border-b border-outline">
                <div class="flex items-center gap-2">
                  ${this.getLogoSvg(28)}
                  <span class="font-headline-sm text-lg text-on-surface font-serif">Halls <span class="text-secondary font-bold">Now</span></span>
                </div>
                <button class="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container" onclick="CustomerHeaderComponent.toggleMobileMenu()" aria-label="Close menu">
                  <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <!-- User Card -->
              ${isLoggedIn ? `
                <div class="p-3 bg-surface-container rounded-xl flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    ${currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div class="font-bold text-xs text-on-surface">${currentUser.name}</div>
                    <div class="text-[10px] text-secondary font-bold uppercase">
                      ${(currentUser.role === 'owner' || (window.Auth && window.Auth.isOwnerUser(currentUser))) ? 'Hall Owner' : 'Customer'}
                    </div>
                  </div>
                </div>
              ` : `
                <div class="flex gap-2">
                  <button onclick="Modals.openAuthModal(null, 'login'); CustomerHeaderComponent.toggleMobileMenu();" class="flex-1 py-2.5 border border-outline rounded-xl text-xs font-bold text-on-surface hover:bg-surface-container transition-all">Sign In</button>
                  <button onclick="Modals.openAuthModal(null, 'signup'); CustomerHeaderComponent.toggleMobileMenu();" class="flex-1 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-secondary-container transition-all">Sign Up</button>
                </div>
              `}

              <!-- Nav Links -->
              <div class="space-y-1 pt-2">
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/" onclick="CustomerHeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">home</span>
                  <span>Home</span>
                </a>
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/search" onclick="CustomerHeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">search</span>
                  <span>Find Venues</span>
                </a>

                ${isLoggedIn && (currentUser.role === 'owner' || (window.Auth && window.Auth.isOwnerUser(currentUser))) ? `
                  <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-secondary bg-secondary-fixed hover:bg-secondary-fixed-dim" href="/owner/" onclick="CustomerHeaderComponent.toggleMobileMenu()">
                    <span class="material-symbols-outlined text-[20px]">domain</span>
                    <span>Owner Workspace →</span>
                  </a>
                ` : `
                  <button class="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold text-secondary bg-secondary-fixed hover:bg-secondary-fixed-dim text-left" onclick="Modals.openAddHallWizard(); CustomerHeaderComponent.toggleMobileMenu()">
                    <span class="material-symbols-outlined text-[20px]">add_business</span>
                    <span>List Your Hall</span>
                  </button>
                `}

                ${isLoggedIn ? `
                  <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/customer" onclick="CustomerHeaderComponent.toggleMobileMenu()">
                    <span class="material-symbols-outlined text-[20px] text-secondary">event_available</span>
                    <span>My Bookings &amp; Saved</span>
                  </a>
                ` : ''}
              </div>
            </div>

            <!-- Bottom CTA -->
            ${isLoggedIn ? `
              <div class="pt-4 border-t border-outline">
                <button class="w-full py-3 bg-surface-container text-error rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm hover:bg-error-container transition-all flex items-center justify-center gap-2" onclick="CustomerHeaderComponent.signOut(); CustomerHeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      </header>
    `;
  },

  update() {
    const container = document.getElementById('header-root');
    if (container) container.innerHTML = this.render();
  },

  toggleNotifDrawer() {
    const d = document.getElementById('notif-dropdown');
    if (d) d.classList.toggle('hidden');
  },

  markAllNotifsRead() {
    window.appStore.markNotificationsRead();
    CustomerHeaderComponent.update();
    Toast.info('Notifications', 'All notifications marked as read.');
  },

  toggleMobileMenu() {
    const m = document.getElementById('mobile-menu-drawer');
    if (m) m.classList.toggle('hidden');
  },

  toggleUserMenu() {
    const d = document.getElementById('user-menu-dropdown');
    if (d) d.classList.toggle('hidden');
  },

  signOut() {
    window.Auth.logout();
    CustomerHeaderComponent.update();
    Toast.info('Signed out', 'You have been signed out. See you next time!');
    if (window.location.hash === '#/customer') {
      window.location.hash = '#/';
    }
  }
};

window.CustomerHeaderComponent = CustomerHeaderComponent;
// Alias so footer's getLogoSvg call still works
window.HeaderComponent = CustomerHeaderComponent;

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('notif-dropdown');
  if (dropdown && !dropdown.classList.contains('hidden') && !e.target.closest('#notif-dropdown') && !e.target.closest('[onclick*="toggleNotifDrawer"]')) {
    dropdown.classList.add('hidden');
  }
  const userMenu = document.getElementById('user-menu-dropdown');
  if (userMenu && !userMenu.classList.contains('hidden') && !e.target.closest('#user-menu-root')) {
    userMenu.classList.add('hidden');
  }
});

window.addEventListener('favoritesUpdated', () => {
  const badge = document.getElementById('saved-count-badge');
  if (badge) badge.innerText = window.appStore.getFavorites().length;
});

// Re-render header on auth state change
window.addEventListener('authChanged', () => {
  CustomerHeaderComponent.update();
});
