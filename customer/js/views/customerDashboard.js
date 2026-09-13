// VenueLuxe Customer Dashboard
// Auth-aware: shows guest prompt if not logged in
// Bookings show APPROVED status with owner contact info

const CustomerDashboardView = {
  currentTab: 'bookings', // 'bookings', 'favorites', 'notifs'

  render() {
    // Auth gate: must be logged in to view dashboard
    if (!window.Auth || !window.Auth.isLoggedIn()) {
      return `
        <div class="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4 text-center">
          <div class="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mb-6 shadow-sm">
            <span class="material-symbols-outlined text-[40px] text-secondary">account_circle</span>
          </div>
          <h1 class="font-headline-sm text-2xl font-bold text-on-surface mb-2">Sign In to View Your Bookings</h1>
          <p class="text-sm text-on-surface-variant max-w-sm leading-relaxed mb-8">
            Create an account or sign in to track your booking requests, saved venues, and notifications.
          </p>
          <div class="flex gap-3">
            <button onclick="Modals.openAuthModal()" class="px-6 py-3 bg-primary text-on-primary font-bold text-sm rounded-xl shadow-md hover:bg-inverse-surface transition-all">
              Sign In
            </button>
            <button onclick="Modals.openAuthModal(); setTimeout(() => Modals._switchAuthTab('signup'), 50)" class="px-6 py-3 bg-secondary text-on-secondary font-bold text-sm rounded-xl shadow-md hover:bg-secondary-container transition-all">
              Create Account
            </button>
          </div>
        </div>
      `;
    }

    const user = window.Auth.getCurrentUser();
    const allBookings = window.appStore.getBookings();
    // Only show this customer's bookings
    const myBookings = allBookings.filter(b => b.customer_id === user.id);
    const favIds = window.appStore.getFavorites();
    const favHalls = window.appStore.getHalls().filter(h => favIds.includes(h.id));
    const notifs = window.appStore.getNotifications();

    const statusBadge = (status) => {
      const map = {
        'APPROVED': `<span class="px-2.5 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span> Approved</span>`,
        'CONFIRMED': `<span class="px-2.5 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-on-tertiary-container"></span> Confirmed</span>`,
        'REJECTED': `<span class="px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[10px] font-bold inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-error"></span> Not Approved</span>`,
        'CANCELLED': `<span class="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">Cancelled</span>`,
        'PENDING': `<span class="px-2.5 py-1 rounded-full bg-status-pending-bg text-status-pending text-[10px] font-bold inline-flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-status-pending animate-pulse"></span> Pending Approval</span>`,
      };
      return map[status] || `<span class="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">${status}</span>`;
    };

    const ownerContactPanel = (b) => {
      const hall = window.appStore.getHallById(b.hall_id);
      if (!hall || !['APPROVED', 'CONFIRMED'].includes(b.status)) return '';
      const c = hall.contact || {};
      return `
        <div class="mt-3 p-3 bg-tertiary-container/30 rounded-xl border border-tertiary/20 space-y-1.5">
          <div class="text-[10px] font-bold uppercase tracking-wider text-on-tertiary-container mb-1">✅ Approved — Contact Owner</div>
          ${c.owner_name ? `<div class="text-xs font-bold text-on-surface">${c.owner_name}</div>` : ''}
          ${c.phone ? `<a href="tel:${c.phone}" class="flex items-center gap-1.5 text-xs text-secondary hover:underline"><span class="material-symbols-outlined text-[14px]">call</span>${c.phone}</a>` : ''}
          ${c.whatsapp ? `<a href="https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="flex items-center gap-1.5 text-xs text-emerald-700 hover:underline"><span class="material-symbols-outlined text-[14px]">chat</span>WhatsApp: ${c.whatsapp}</a>` : ''}
          ${c.email ? `<a href="mailto:${c.email}" class="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface"><span class="material-symbols-outlined text-[14px]">mail</span>${c.email}</a>` : ''}
        </div>
      `;
    };

    return `
      <div class="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-surface py-6 md:py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          
          <!-- Customer Banner Profile -->
          <div class="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                ${user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h1 class="font-headline-sm text-xl sm:text-2xl font-bold text-on-surface">${user.name}</h1>
                  <span class="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                    Customer Account
                  </span>
                </div>
                <p class="text-xs text-on-surface-variant">${user.phone} • ${user.email}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 flex-wrap">
              <button 
                class="px-5 py-2.5 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-inverse-surface transition-colors min-h-[44px]" 
                onclick="window.location.hash='#/search'">
                Find More Halls
              </button>
              <button 
                class="px-4 py-2.5 bg-surface-container text-on-surface rounded-lg text-xs font-bold uppercase tracking-wider border border-outline hover:bg-surface-container-high transition-colors min-h-[44px]" 
                onclick="CustomerHeaderComponent.signOut()">
                Sign Out
              </button>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div class="flex items-center gap-2 border-b border-outline pb-2 overflow-x-auto" role="tablist">
            <button 
              role="tab"
              aria-selected="${this.currentTab === 'bookings'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'bookings' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}" 
              onclick="CustomerDashboardView.setTab('bookings')">
              <span>My Bookings</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'bookings' ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface'}">
                ${myBookings.length}
              </span>
            </button>

            <button 
              role="tab"
              aria-selected="${this.currentTab === 'favorites'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'favorites' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}" 
              onclick="CustomerDashboardView.setTab('favorites')">
              <span>Saved Venues</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'favorites' ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface'}">
                ${favHalls.length}
              </span>
            </button>

            <button 
              role="tab"
              aria-selected="${this.currentTab === 'notifs'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'notifs' ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}" 
              onclick="CustomerDashboardView.setTab('notifs')">
              <span>Notifications</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'notifs' ? 'bg-secondary text-white' : 'bg-surface-container-high text-on-surface'}">
                ${notifs.length}
              </span>
            </button>
          </div>

          <!-- TAB 1: MY BOOKINGS -->
          ${this.currentTab === 'bookings' ? `
            <div class="space-y-4">
              ${myBookings.length === 0 ? `
                <div class="py-16 text-center bg-surface-container-lowest rounded-2xl border border-dashed border-outline">
                  <span class="material-symbols-outlined text-[48px] text-on-surface-variant/40 mb-3 block">event_available</span>
                  <p class="text-sm text-on-surface-variant font-semibold mb-1">No booking requests yet</p>
                  <p class="text-xs text-on-surface-variant mb-6">Browse halls and click "Book Now" to send your first request.</p>
                  <a href="#/search" class="inline-block px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-inverse-surface transition-all">Discover Halls</a>
                </div>
              ` : `
                <div class="space-y-4">
                  ${myBookings.map(b => `
                    <div class="bg-surface-container-lowest rounded-2xl border border-outline shadow-sm overflow-hidden ${b.status === 'APPROVED' || b.status === 'CONFIRMED' ? 'border-tertiary/40 shadow-tertiary/10' : b.status === 'REJECTED' ? 'border-error/20 opacity-80' : ''}">
                      <div class="p-5">
                        <div class="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span class="font-mono text-xs font-bold text-secondary">${b.id}</span>
                            <h3 class="font-bold text-base text-on-surface mt-0.5">${b.hall_name}</h3>
                            <p class="text-xs text-on-surface-variant">${b.event_type}</p>
                          </div>
                          ${statusBadge(b.status)}
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs py-3 border-y border-outline">
                          <div>
                            <span class="text-on-surface-variant block text-[10px] uppercase tracking-wider mb-0.5">Date & Shift</span>
                            <span class="font-bold text-on-surface">${b.date}</span>
                            <span class="text-secondary block text-[11px] font-medium">${b.slot}</span>
                          </div>
                          <div>
                            <span class="text-on-surface-variant block text-[10px] uppercase tracking-wider mb-0.5">Guests</span>
                            <span class="font-bold text-on-surface">${b.guests} guests</span>
                          </div>
                          <div class="col-span-2 sm:col-span-1">
                            <span class="text-on-surface-variant block text-[10px] uppercase tracking-wider mb-0.5">Submitted</span>
                            <span class="font-semibold text-on-surface">${b.created_at}</span>
                          </div>
                        </div>

                        ${b.notes ? `<p class="text-xs text-on-surface-variant mt-3 italic">"${b.notes}"</p>` : ''}

                        ${ownerContactPanel(b)}

                        ${b.status === 'REJECTED' && b.rejection_reason ? `
                          <div class="mt-3 p-3 bg-error-container/30 rounded-xl border border-error/20 text-xs text-on-error-container">
                            <strong>Reason:</strong> ${b.rejection_reason}
                          </div>
                        ` : ''}

                        <div class="flex items-center gap-2 mt-4">
                          <a href="#/hall/${b.hall_id}" class="px-4 py-2 bg-surface-container hover:bg-surface-container-high rounded-lg text-xs font-bold text-on-surface transition-colors border border-outline">
                            View Hall
                          </a>
                          ${b.status === 'PENDING' ? `
                            <button class="px-4 py-2 bg-error-container/50 text-on-error-container rounded-lg text-xs font-bold hover:bg-error-container transition-colors" onclick="CustomerDashboardView.cancelBooking('${b.id}')">
                              Cancel Request
                            </button>
                          ` : ''}
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

          <!-- TAB 2: SAVED VENUES -->
          ${this.currentTab === 'favorites' ? `
            <div class="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-sm space-y-5">
              <div class="flex items-center justify-between pb-3 border-b border-outline">
                <div>
                  <span class="text-xs uppercase tracking-widest text-secondary font-bold">Curated Wishlist</span>
                  <h2 class="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">Saved Venues (${favHalls.length})</h2>
                </div>
              </div>

              ${favHalls.length === 0 ? `
                <div class="py-12 text-center bg-surface-container rounded-xl border border-dashed border-outline">
                  <span class="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-2 block">favorite_border</span>
                  <p class="text-xs text-on-surface-variant">You haven't saved any venues yet.</p>
                  <a href="#/search" class="mt-3 inline-block px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold">Browse Halls</a>
                </div>
              ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  ${favHalls.map(hall => `
                    <div class="bg-surface-container-lowest rounded-xl border border-outline overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div class="relative aspect-[16/10] overflow-hidden bg-surface-container">
                          <img 
                            src="${hall.cover_image}" 
                            class="w-full h-full object-cover"
                            onerror="this.src=window.appStore.getPlaceholderImage('${hall.name}')">
                          <button 
                            class="absolute top-2.5 right-2.5 p-2 bg-primary/70 hover:bg-primary rounded-full text-secondary transition-colors" 
                            onclick="window.appStore.toggleFavorite('${hall.id}'); CustomerDashboardView.setTab('favorites');"
                            title="Remove from favorites">
                            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
                          </button>
                        </div>
                        <div class="p-4 space-y-1">
                          <h3 class="font-headline-sm text-base font-bold text-on-surface truncate">${hall.name}</h3>
                          <p class="text-xs text-on-surface-variant">${hall.city} • Seats ${hall.seating_capacity} guests</p>
                        </div>
                      </div>

                      <div class="p-4 pt-3 border-t border-outline flex items-center justify-between">
                        <div>
                          <span class="text-[10px] text-on-surface-variant block uppercase">Starting from</span>
                          <span class="text-sm font-bold text-on-surface">₹${(hall.pricing ? Math.min(...Object.values(hall.pricing)) : 32000).toLocaleString('en-IN')}</span>
                        </div>
                        <a href="#/hall/${hall.id}" class="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:bg-inverse-surface transition-colors">
                          View Venue
                        </a>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

          <!-- TAB 3: NOTIFICATIONS -->
          ${this.currentTab === 'notifs' ? `
            <div class="bg-surface-container-lowest p-5 sm:p-6 rounded-2xl border border-outline shadow-sm space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-outline">
                <h2 class="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">Notifications</h2>
                <span class="text-xs text-on-surface-variant">${notifs.length} alerts</span>
              </div>
              ${notifs.length === 0 ? `
                <div class="py-10 text-center">
                  <span class="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-2 block">notifications_none</span>
                  <p class="text-xs text-on-surface-variant">No notifications yet.</p>
                </div>
              ` : `
                <div class="space-y-2.5">
                  ${notifs.map(n => `
                    <div class="p-4 rounded-xl bg-surface-container border border-outline flex items-start justify-between gap-3 ${n.unread ? 'border-secondary/30 bg-secondary-fixed/10' : ''}">
                      <div class="space-y-1">
                        <div class="font-bold text-xs text-on-surface">${n.title}</div>
                        <div class="text-xs text-on-surface-variant leading-relaxed">${n.message}</div>
                        <div class="text-[10px] text-on-surface-variant/70">${n.date}</div>
                      </div>
                      <a href="${n.link}" class="text-xs text-secondary font-bold hover:underline shrink-0 self-center">
                        View
                      </a>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

        </div>
      </div>
    `;
  },

  setTab(tab) {
    this.currentTab = tab;
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  cancelBooking(id) {
    if (confirm('Are you sure you want to cancel this booking request?')) {
      window.appStore.updateBookingStatus(id, 'CANCELLED');
      Toast.info('Booking Cancelled', `Booking reference ${id} has been cancelled.`);
      this.setTab('bookings');
    }
  }
};

window.CustomerDashboardView = CustomerDashboardView;

// Automatically re-render customer dashboard in real time whenever Firestore syncs booking updates or owner approvals
window.addEventListener('bookingsUpdated', () => {
  if (window.location.hash.startsWith('#/dashboard')) {
    const container = document.getElementById('app-content');
    if (container && window.CustomerDashboardView) {
      container.innerHTML = window.CustomerDashboardView.render();
    }
  }
});
