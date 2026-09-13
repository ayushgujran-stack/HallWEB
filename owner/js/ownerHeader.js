// Hall Owner Portal Header — VenueLuxe
// Owner-specific navigation: no role-switcher, no customer/admin links

const OwnerHeaderComponent = {
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
    const currentUser = window.appStore.getOwnerUser();
    const notifications = window.appStore.getNotifications();
    const unreadNotifsCount = notifications.filter(n => n.unread).length;

    return `
      <header class="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-md shadow-[0_1px_4px_rgba(17,24,39,0.03)] border-b border-outline">
        <div class="h-20 max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop flex items-center justify-between gap-space-sm">

          <!-- Logo & Brand -->
          <div class="flex items-center gap-2.5 shrink-0">
            <a href="#/" class="flex items-center gap-2.5 cursor-pointer" aria-label="VenueLuxe Owner Workspace">
              ${this.getLogoSvg(34)}
              <div class="flex flex-col leading-tight">
                <span class="font-headline-sm text-xl md:text-2xl text-on-surface tracking-tight font-serif">
                  Venue<span class="text-secondary font-bold">Luxe</span>
                </span>
                <span class="text-[10px] font-bold uppercase tracking-widest text-secondary hidden sm:block">Owner Workspace</span>
              </div>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center gap-1.5" aria-label="Owner Navigation">
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" href="#/">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">dashboard</span>
                Dashboard
              </span>
            </a>
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" href="#/">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">domain</span>
                My Halls
              </span>
            </a>
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" href="#/">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">event_available</span>
                Bookings
              </span>
            </a>
            <a class="px-3.5 py-2 font-body-md text-sm font-semibold transition-all rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container" href="#/">
              <span class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">payments</span>
                Earnings
              </span>
            </a>
          </nav>

          <!-- Right-side Actions -->
          <div class="flex items-center gap-1.5 md:gap-2.5 shrink-0">

            <!-- Link back to customer site -->
            <a class="hidden md:flex items-center gap-1.5 px-3 py-2 font-body-md text-xs font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-all" href="/customer/" title="Go to Customer Site">
              <span class="material-symbols-outlined text-[18px]">storefront</span>
              <span>Customer Storefront</span>
            </a>

            <!-- Notifications Bell -->
            <div class="relative">
              <button class="relative w-10 h-10 text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center rounded-lg" onclick="OwnerHeaderComponent.toggleNotifDrawer()" title="Notifications" aria-label="Open notifications">
                <span class="material-symbols-outlined text-[20px]">notifications</span>
                ${unreadNotifsCount > 0 ? `
                  <span class="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary ring-2 ring-surface"></span>
                ` : ''}
              </button>

              <!-- Notifications Dropdown -->
              <div class="hidden absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline p-3 space-y-2 z-50" id="notif-dropdown">
                <div class="flex items-center justify-between pb-2 border-b border-outline">
                  <span class="font-title-md text-xs font-bold text-on-surface uppercase tracking-wider">Notifications</span>
                  <button class="text-[11px] text-secondary hover:underline font-semibold" onclick="OwnerHeaderComponent.markAllNotifsRead()">Mark read</button>
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

            <!-- Owner Profile Avatar -->
            <div class="flex items-center gap-2 cursor-pointer p-1 rounded-full hover:bg-surface-container transition-colors" title="Owner Profile: ${currentUser.name}">
              <div class="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-xs shadow-sm">
                ${currentUser.name ? currentUser.name[0] : 'O'}
              </div>
              <div class="hidden xl:flex flex-col text-left leading-tight">
                <span class="text-xs font-bold text-on-surface truncate max-w-[100px]">${currentUser.name ? currentUser.name.split(' ')[0] : 'Owner'}</span>
                <span class="text-[10px] text-secondary uppercase font-semibold">${currentUser.business_name ? currentUser.business_name.slice(0, 18) + '…' : 'Hall Owner'}</span>
              </div>
            </div>

            <!-- Sign Out Button -->
            <button onclick="OwnerHeaderComponent.signOut()" class="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-error hover:bg-error-container transition-colors" title="Sign Out of Host Account">
              <span class="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>

            <!-- Mobile Menu Toggle -->
            <button class="lg:hidden w-11 h-11 flex items-center justify-center text-on-surface hover:bg-surface-container rounded-lg transition-colors ml-1" onclick="OwnerHeaderComponent.toggleMobileMenu()" aria-label="Toggle navigation menu">
              <span class="material-symbols-outlined text-[24px]">menu</span>
            </button>

          </div>
        </div>

        <!-- Mobile Slide-over Drawer -->
        <div class="hidden lg:hidden fixed inset-0 z-50" id="mobile-menu-drawer">
          <div class="fixed inset-0 bg-primary/40 backdrop-blur-sm" onclick="OwnerHeaderComponent.toggleMobileMenu()"></div>
          <div class="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-surface-container-lowest shadow-2xl p-space-lg flex flex-col justify-between overflow-y-auto border-l border-outline">
            <div class="space-y-space-md">
              <div class="flex items-center justify-between pb-space-sm border-b border-outline">
                <div class="flex items-center gap-2">
                  ${this.getLogoSvg(28)}
                  <span class="font-headline-sm text-lg text-on-surface font-serif">Venue<span class="text-secondary font-bold">Luxe</span></span>
                </div>
                <button class="w-10 h-10 flex items-center justify-center rounded-lg text-on-surface hover:bg-surface-container" onclick="OwnerHeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <!-- Owner Identity Card -->
              <div class="p-3 bg-surface-container rounded-xl flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">
                  ${currentUser.name ? currentUser.name[0] : 'O'}
                </div>
                <div>
                  <div class="font-bold text-xs text-on-surface">${currentUser.name || 'Hall Owner'}</div>
                  <div class="text-[10px] text-secondary font-bold uppercase">Owner Workspace</div>
                </div>
              </div>

              <!-- Nav Links -->
              <div class="space-y-1 pt-2">
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/" onclick="OwnerHeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">dashboard</span>
                  <span>Dashboard</span>
                </a>
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/" onclick="OwnerHeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">domain</span>
                  <span>My Halls</span>
                </a>
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="#/" onclick="OwnerHeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">event_available</span>
                  <span>Bookings</span>
                </a>
                <a class="flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-on-surface hover:bg-surface-container" href="/" onclick="OwnerHeaderComponent.toggleMobileMenu()">
                  <span class="material-symbols-outlined text-[20px] text-secondary">open_in_new</span>
                  <span>Go to Customer Site</span>
                </a>
              </div>
            </div>

            <!-- Bottom CTA -->
            <div class="pt-4 border-t border-outline">
              <button class="w-full py-3 bg-secondary text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:bg-secondary-container transition-all flex items-center justify-center gap-2" onclick="Modals.openAddHallWizard(); OwnerHeaderComponent.toggleMobileMenu()">
                <span class="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add New Hall</span>
              </button>
            </div>
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
    OwnerHeaderComponent.update();
    Toast.info('Notifications', 'All notifications marked as read.');
  },

  toggleMobileMenu() {
    const m = document.getElementById('mobile-menu-drawer');
    if (m) m.classList.toggle('hidden');
  },

  signOut() {
    if (window.Auth) {
      window.Auth.logout();
    }
    Toast.info('Signed Out', 'You have been signed out. Redirecting to home...');
    setTimeout(() => {
      window.location.href = '/customer/';
    }, 400);
  }
};

window.OwnerHeaderComponent = OwnerHeaderComponent;
// Alias so footer's getLogoSvg call still works
window.HeaderComponent = OwnerHeaderComponent;
