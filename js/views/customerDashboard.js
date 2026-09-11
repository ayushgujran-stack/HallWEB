// VenueLuxe Customer Portal View
// Meets requirements for customer booking holds, saved wishlists, and mobile responsiveness

const CustomerDashboardView = {
  currentTab: 'bookings', // 'bookings', 'favorites', 'notifs'

  render() {
    const user = window.appStore.getCurrentUser();
    const allBookings = window.appStore.getBookings();
    const myBookings = allBookings.filter(b => b.customer_id === user.id || true); // for demo
    const favIds = window.appStore.getFavorites();
    const favHalls = window.appStore.getHalls().filter(h => favIds.includes(h.id));
    const notifs = window.appStore.getNotifications();

    return `
      <div class="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-surface py-6 md:py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          
          <!-- Customer Banner Profile -->
          <div class="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center font-display text-2xl font-bold shadow-sm shrink-0">
                ${user.name ? user.name[0] : 'A'}
              </div>
              <div class="space-y-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <h1 class="font-display text-xl sm:text-2xl font-bold text-stone-900">${user.name}</h1>
                  <span class="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-bold uppercase tracking-wider">
                    Member Account
                  </span>
                </div>
                <p class="text-xs text-stone-500">${user.phone} • ${user.email}</p>
                <p class="text-[11px] text-stone-400">Planning events across Karnataka</p>
              </div>
            </div>

            <div class="flex items-center gap-3 flex-wrap">
              <button 
                class="px-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors focus-visible:ring-2 focus-visible:ring-secondary min-h-[44px]" 
                onclick="window.location.hash='#/search'">
                Find More Halls
              </button>
              <button 
                class="px-4 py-2.5 bg-stone-50 text-stone-800 rounded-lg text-xs font-bold uppercase tracking-wider border border-stone-300 hover:bg-stone-100 transition-colors min-h-[44px]" 
                onclick="Modals.openRoleSelectorModal()">
                Switch Role
              </button>
            </div>
          </div>

          <!-- Tabs Navigation -->
          <div class="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto" role="tablist">
            <button 
              role="tab"
              aria-selected="${this.currentTab === 'bookings'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'bookings' ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:text-stone-900'}" 
              onclick="CustomerDashboardView.setTab('bookings')">
              <span>My Booking Holds</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'bookings' ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-800'}">
                ${myBookings.length}
              </span>
            </button>

            <button 
              role="tab"
              aria-selected="${this.currentTab === 'favorites'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'favorites' ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:text-stone-900'}" 
              onclick="CustomerDashboardView.setTab('favorites')">
              <span>Saved Venues</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'favorites' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-800'}">
                ${favHalls.length}
              </span>
            </button>

            <button 
              role="tab"
              aria-selected="${this.currentTab === 'notifs'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'notifs' ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:text-stone-900'}" 
              onclick="CustomerDashboardView.setTab('notifs')">
              <span>Notifications</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'notifs' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-800'}">
                ${notifs.length}
              </span>
            </button>
          </div>

          <!-- TAB 1: BOOKING HOLDS -->
          ${this.currentTab === 'bookings' ? `
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span class="text-xs uppercase tracking-widest text-secondary font-bold">Reservations Ledger</span>
                  <h2 class="font-display text-lg sm:text-xl font-bold text-stone-900">Active Holds & Enquiry Requests</h2>
                </div>
              </div>

              ${myBookings.length === 0 ? `
                <div class="py-12 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  <p class="text-xs text-stone-500">No active booking holds found.</p>
                  <a href="#/search" class="mt-3 inline-block px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold">Discover Halls</a>
                </div>
              ` : `
                <!-- Desktop Table (>= 768px) -->
                <div class="hidden md:block overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-stone-50 text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                        <th class="p-3 rounded-l-lg">Reference</th>
                        <th class="p-3">Venue</th>
                        <th class="p-3">Date & Shift</th>
                        <th class="p-3">Pax</th>
                        <th class="p-3">Status</th>
                        <th class="p-3 text-right rounded-r-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                      ${myBookings.map(b => `
                        <tr class="hover:bg-stone-50/70 transition-colors">
                          <td class="p-3 font-mono font-bold text-primary">${b.id}</td>
                          <td class="p-3 font-bold text-stone-900">
                            <div>${b.hall_name}</div>
                            <div class="text-[11px] text-stone-500 font-normal">${b.event_type}</div>
                          </td>
                          <td class="p-3 text-stone-900">
                            <div class="font-bold">${b.date}</div>
                            <div class="text-[11px] text-secondary font-semibold">${b.slot}</div>
                          </td>
                          <td class="p-3 font-bold text-stone-900">${b.guests} Pax</td>
                          <td class="p-3">
                            ${b.status === 'CONFIRMED' ? `
                              <span class="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Confirmed
                              </span>
                            ` : (b.status === 'ACCEPTED' ? `
                              <span class="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold inline-flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Accepted by Owner
                              </span>
                            ` : (b.status === 'REJECTED' ? `
                              <span class="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold inline-flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-rose-600"></span> Declined
                              </span>
                            ` : `
                              <span class="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold inline-flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-amber-600"></span> Pending Owner Approval
                              </span>
                            `))}
                          </td>
                          <td class="p-3 text-right">
                            <div class="flex items-center justify-end gap-2">
                              <a href="#/hall/${b.hall_id}" class="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-xs font-bold text-stone-800 transition-colors">
                                View Venue
                              </a>
                              <a 
                                href="https://wa.me/918258229988?text=Hello%2C%20regarding%20booking%20${b.id}%20at%20${encodeURIComponent(b.hall_name)}" 
                                target="_blank" 
                                class="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors" 
                                title="WhatsApp Venue Desk">
                                <span class="material-symbols-outlined text-[16px]">chat</span>
                              </a>
                              ${b.status === 'PENDING' ? `
                                <button class="px-2 py-1 text-[11px] text-rose-700 hover:underline font-semibold" onclick="CustomerDashboardView.cancelBooking('${b.id}')">
                                  Cancel
                                </button>
                              ` : ''}
                            </div>
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>

                <!-- Mobile Booking Cards (< 768px) -->
                <div class="md:hidden space-y-4">
                  ${myBookings.map(b => `
                    <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                      <div class="flex items-start justify-between gap-2">
                        <div>
                          <span class="font-mono text-xs font-bold text-primary">${b.id}</span>
                          <h4 class="font-bold text-sm text-stone-900 mt-0.5">${b.hall_name}</h4>
                          <p class="text-xs text-stone-500">${b.event_type}</p>
                        </div>
                        <div>
                          ${b.status === 'CONFIRMED' ? `
                            <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">Confirmed</span>
                          ` : (b.status === 'ACCEPTED' ? `
                            <span class="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">Accepted</span>
                          ` : (b.status === 'REJECTED' ? `
                            <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">Declined</span>
                          ` : `
                            <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">Pending</span>
                          `))}
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-200">
                        <div>
                          <span class="text-stone-500 block text-[10px] uppercase">Date & Shift:</span>
                          <span class="font-bold text-stone-900">${b.date}</span>
                          <span class="text-secondary block text-[11px] font-medium">${b.slot}</span>
                        </div>
                        <div>
                          <span class="text-stone-500 block text-[10px] uppercase">Guests:</span>
                          <span class="font-bold text-stone-900">${b.guests} Pax</span>
                        </div>
                      </div>

                      <div class="flex items-center gap-2 pt-1">
                        <a href="#/hall/${b.hall_id}" class="flex-1 py-2.5 bg-white border border-stone-300 rounded-lg text-xs font-bold text-stone-800 text-center hover:bg-stone-50 min-h-[44px] flex items-center justify-center">
                          View Venue
                        </a>
                        <a 
                          href="https://wa.me/918258229988?text=Hello%2C%20regarding%20booking%20${b.id}%20at%20${encodeURIComponent(b.hall_name)}" 
                          target="_blank" 
                          class="px-3 py-2.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 min-h-[44px] flex items-center justify-center gap-1">
                          <span class="material-symbols-outlined text-[16px]">chat</span> Chat
                        </a>
                        ${b.status === 'PENDING' ? `
                          <button class="px-3 py-2.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-100 min-h-[44px]" onclick="CustomerDashboardView.cancelBooking('${b.id}')">
                            Cancel
                          </button>
                        ` : ''}
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

          <!-- TAB 2: SAVED VENUES -->
          ${this.currentTab === 'favorites' ? `
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span class="text-xs uppercase tracking-widest text-secondary font-bold">Curated Wishlist</span>
                  <h2 class="font-display text-lg sm:text-xl font-bold text-stone-900">Saved Venues (${favHalls.length})</h2>
                </div>
              </div>

              ${favHalls.length === 0 ? `
                <div class="py-12 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  <p class="text-xs text-stone-500">You haven't saved any venues yet.</p>
                  <a href="#/search" class="mt-3 inline-block px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold">Browse Halls</a>
                </div>
              ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  ${favHalls.map(hall => `
                    <div class="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                      <div>
                        <div class="relative aspect-[16/10] overflow-hidden bg-stone-100">
                          <img 
                            src="${hall.cover_image}" 
                            class="w-full h-full object-cover"
                            onerror="this.src=window.appStore.getPlaceholderImage('Venue')">
                          <button 
                            class="absolute top-2.5 right-2.5 p-2 bg-stone-900/70 hover:bg-stone-900 rounded-full text-rose-400 transition-colors" 
                            onclick="window.appStore.toggleFavorite('${hall.id}'); CustomerDashboardView.setTab('favorites');"
                            title="Remove from favorites">
                            <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' 1;">favorite</span>
                          </button>
                        </div>
                        <div class="p-4 space-y-1">
                          <h3 class="font-display text-base font-bold text-stone-900 truncate">${hall.name}</h3>
                          <p class="text-xs text-stone-500">${hall.city} • Seats ${hall.seating_capacity} guests</p>
                        </div>
                      </div>

                      <div class="p-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span class="text-[10px] text-stone-400 block uppercase">Starting Shift</span>
                          <span class="text-sm font-bold text-stone-900">₹${(hall.pricing?.evening || 75000).toLocaleString()}</span>
                        </div>
                        <a href="#/hall/${hall.id}" class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors">
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
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 class="font-display text-lg sm:text-xl font-bold text-stone-900">Platform Notifications</h2>
                <span class="text-xs text-stone-500">${notifs.length} Alerts</span>
              </div>
              <div class="space-y-2.5">
                ${notifs.map(n => `
                  <div class="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-3">
                    <div class="space-y-1">
                      <div class="font-bold text-xs text-stone-900">${n.title}</div>
                      <div class="text-xs text-stone-600 leading-relaxed">${n.message}</div>
                      <div class="text-[10px] text-stone-400">${n.date}</div>
                    </div>
                    <a href="${n.link}" class="text-xs text-secondary font-bold hover:underline shrink-0 self-center">
                      View
                    </a>
                  </div>
                `).join('')}
              </div>
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
