// Hall Owner Operational Dashboard
// Refined luxury host workspace with separated overview/operations, responsive stepper, and stacked mobile cards

const OwnerDashboardView = {
  render() {
    const currentUser = (window.Auth && window.Auth.getCurrentUser()) || window.appStore.getOwnerUser();
    const halls = window.appStore.getHalls();
    let myHalls = halls.filter(h => 
      (currentUser && h.owner_id === currentUser.id) ||
      (currentUser?.email && h.contact?.email?.toLowerCase() === currentUser.email.toLowerCase())
    );
    if (!myHalls.length) {
      myHalls = halls.filter(h => h.owner_id === 'owner-1' || !h.owner_id);
    }

    const bookings = window.appStore.getBookings();
    const liveHalls = myHalls.filter(h => h.status === 'LIVE');
    const pendingHalls = myHalls.filter(h => h.status === 'PENDING_APPROVAL');
    const pendingBookings = bookings.filter(b => b.status === 'PENDING');
    const approvedBookings = bookings.filter(b => b.status === 'APPROVED' || b.status === 'CONFIRMED');
    const totalGross = approvedBookings.reduce((sum, b) => sum + (b.amount || 75000), 0);
    const firstHall = myHalls[0] || {};

    // Build a set of already-approved hall+date+slot combos for conflict detection
    const approvedSlotKeys = new Set(
      approvedBookings.map(b => `${b.hall_id}__${b.date}__${b.slot}`)
    );
    const isConflict = (b) => b.status === 'PENDING' && approvedSlotKeys.has(`${b.hall_id}__${b.date}__${b.slot}`);

    const displayName = currentUser.business_name || (currentUser.name ? `${currentUser.name}'s Host Portfolio` : 'Regal Horizons Hospitality Group');

    return `
      <div class="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-surface py-6 md:py-8">
        <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop w-full space-y-6 md:space-y-8">
          
          <!-- SECTION 1: OVERVIEW & HEADER -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-xl border border-outline shadow-sm">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">Owner Workspace</span>
                <span class="text-xs text-on-surface-variant">• Verified Host</span>
              </div>
              <h1 class="font-headline-lg text-2xl md:text-3xl text-on-surface tracking-tight font-serif font-bold">
                ${displayName}
              </h1>
              <p class="font-body-md text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                Manage your banquet halls, calendar availability, shift tariffs, and incoming customer booking requests.
              </p>
            </div>

            <div class="flex items-center gap-2.5 flex-wrap">
              <button class="flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-label-md text-xs uppercase tracking-wider rounded-lg hover:bg-inverse-surface shadow-sm transition-all font-bold" onclick="Modals.openAddHallWizard()">
                <span class="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add New Hall</span>
              </button>
              <a href="/admin/" class="flex items-center gap-2 px-3.5 py-2.5 bg-surface-container text-on-surface font-label-md text-xs uppercase tracking-wider rounded-lg border border-outline hover:bg-surface-container-high transition-all font-semibold no-underline">
                <span class="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                <span>Admin Panel</span>
              </a>
            </div>
          </div>

          <!-- KPI Metric Cards: Actionable Items Highlighted -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            
            <!-- Actionable: New Requests -->
            <div class="bg-secondary-fixed p-4 md:p-5 rounded-xl border border-secondary/20 shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between text-on-secondary-fixed mb-2">
                <span class="font-label-sm text-[11px] uppercase tracking-wider font-bold">Action Needed: New Holds</span>
                <span class="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div>
                <div class="font-display-lg text-2xl md:text-3xl font-bold text-on-secondary-fixed">${pendingBookings.length}</div>
                <p class="font-body-sm text-xs text-on-secondary-fixed font-medium mt-0.5">Customer holds waiting for review</p>
              </div>
            </div>

            <!-- Actionable: Under Review -->
            <div class="bg-status-pending-bg p-4 md:p-5 rounded-xl border border-status-pending-border shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between text-status-pending mb-2">
                <span class="font-label-sm text-[11px] uppercase tracking-wider font-bold">Under Review</span>
                <span class="material-symbols-outlined text-[20px]">hourglass_top</span>
              </div>
              <div>
                <div class="font-display-lg text-2xl md:text-3xl font-bold text-status-pending">${pendingHalls.length}</div>
                <p class="font-body-sm text-xs text-status-pending font-medium mt-0.5">Pending admin audit</p>
              </div>
            </div>

            <!-- Live Halls -->
            <div class="bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between text-on-surface-variant mb-2">
                <span class="font-label-sm text-[11px] uppercase tracking-wider font-bold">Published Halls</span>
                <span class="material-symbols-outlined text-[20px] text-tertiary">check_circle</span>
              </div>
              <div>
                <div class="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">${liveHalls.length}</div>
                <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">${myHalls.length} Total registered properties</p>
              </div>
            </div>

            <!-- Confirmed Revenue -->
            <div class="bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between text-on-surface-variant mb-2">
                <span class="font-label-sm text-[11px] uppercase tracking-wider font-bold">Approved Bookings</span>
                <span class="material-symbols-outlined text-[20px] text-secondary">trending_up</span>
              </div>
              <div>
                <div class="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">₹${Math.round(totalGross / 1000)}k</div>
                <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">${approvedBookings.length} Approved reservations</p>
              </div>
            </div>

          </div>

          <!-- SECTION 2: OPERATIONS & ONBOARDING STEPPER -->
          <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline">
              <div>
                <span class="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">Listing Status</span>
                <h2 class="font-title-lg text-sm md:text-base font-bold text-on-surface">Hall Listing Progress</h2>
              </div>
              <span class="text-xs text-on-surface-variant">Active Property: <strong>${firstHall.name || 'The Grand Monarch Palace'}</strong></span>
            </div>

            <!-- Responsive Step Indicator -->
            <div class="overflow-x-auto pb-2 no-scrollbar">
              <div class="flex items-center min-w-[700px] justify-between relative py-2">
                <div class="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-surface-container z-0"></div>
                ${[
                  { step: 1, name: 'Basic Info', done: true },
                  { step: 2, name: 'Dimensions', done: true },
                  { step: 3, name: 'Facilities', done: true },
                  { step: 4, name: 'Tariffs', done: true },
                  { step: 5, name: 'Photos', done: true },
                  { step: 6, name: 'Map Pin', done: true },
                  { step: 7, name: 'Contact', done: true },
                  { step: 8, name: 'Visibility', active: true },
                  { step: 9, name: 'Verification', done: false }
                ].map(s => `
                  <div class="relative z-10 flex flex-col items-center cursor-pointer" onclick="Modals.openAddHallWizard()">
                    <div class="w-7 h-7 rounded-full ${s.done ? 'bg-primary text-white' : (s.active ? 'bg-secondary text-white ring-4 ring-secondary-fixed' : 'bg-surface-container text-on-surface-variant')} flex items-center justify-center font-label-sm text-xs font-bold shadow-sm">
                      ${s.done ? '<span class="material-symbols-outlined text-[14px]">check</span>' : s.step}
                    </div>
                    <span class="mt-1 font-label-sm text-[11px] font-semibold ${s.active ? 'text-secondary font-bold' : 'text-on-surface'}">${s.name}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Public Availability Toggle Card (Clear Impact Explanation) -->
            <div class="bg-surface-container-low p-4 rounded-xl border border-outline flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="space-y-0.5">
                <p class="font-title-md text-xs md:text-sm font-bold text-on-surface">Show Public Availability Calendar</p>
                <p class="font-body-sm text-xs text-on-surface-variant max-w-xl">
                  When enabled, prospective guests can see open shifts and request instant holds. When disabled, dates are hidden and visitors must contact you directly.
                </p>
              </div>
              <div class="shrink-0">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" id="owner-public-toggle" class="sr-only peer" ${firstHall.public_availability ? 'checked' : ''} onchange="OwnerDashboardView.toggleHallPublicAvailability(this.checked)">
                  <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>
          </div>

          <!-- SECTION 3: INCOMING CUSTOMER REQUESTS -->
          <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline">
              <div>
                <span class="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">Booking Requests</span>
                <h2 class="font-title-lg text-sm md:text-base font-bold text-on-surface">Customer Reservation Ledger</h2>
              </div>
              <span class="text-xs text-on-surface-variant font-medium">${bookings.length} Total requests</span>
            </div>

            ${bookings.length === 0 ? `
              <div class="py-12 text-center bg-surface-container rounded-xl border border-dashed border-outline">
                <span class="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-2 block">inbox</span>
                <p class="text-xs text-on-surface-variant">No booking requests yet. They'll appear here when customers submit requests.</p>
              </div>
            ` : `
              <!-- Desktop Table -->
              <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase">
                      <th class="p-3 rounded-l-lg">Customer</th>
                      <th class="p-3">Venue</th>
                      <th class="p-3">Event</th>
                      <th class="p-3">Date & Shift</th>
                      <th class="p-3">Guests</th>
                      <th class="p-3">Status</th>
                      <th class="p-3 text-right rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline">
                    ${bookings.map(b => {
                      const conflict = isConflict(b);
                      return `
                      <tr class="hover:bg-surface-container-low/50 transition-colors ${conflict ? 'bg-status-error-bg/20' : ''}">
                        <td class="p-3 font-semibold text-on-surface">
                          <div>${b.customer_name}</div>
                          <a href="tel:${b.customer_phone}" class="text-[11px] text-secondary hover:underline">${b.customer_phone}</a>
                          <div class="text-[11px] text-on-surface-variant truncate max-w-[150px]">${b.customer_email || ''}</div>
                        </td>
                        <td class="p-3 font-medium text-on-surface">${b.hall_name}</td>
                        <td class="p-3">
                          <span class="px-2 py-0.5 rounded bg-surface-container text-on-surface text-[11px] font-semibold">${b.event_type}</span>
                          <div class="text-[11px] text-on-surface-variant mt-0.5">${b.guests} guests</div>
                        </td>
                        <td class="p-3">
                          <div class="font-bold text-on-surface">${b.date}</div>
                          <div class="text-[11px] text-secondary font-semibold">${b.slot}</div>
                        </td>
                        <td class="p-3 font-bold text-on-surface">${b.guests}</td>
                        <td class="p-3">
                          ${conflict ? `<div class="mb-1 px-2 py-0.5 rounded-full bg-status-error-bg text-status-error text-[10px] font-bold border border-status-error-border flex items-center gap-1 w-max">⚠️ Slot Conflict</div>` : ''}
                          ${b.status === 'APPROVED' || b.status === 'CONFIRMED' ? `
                            <span class="px-2.5 py-0.5 rounded-full bg-status-available-bg text-status-available text-[10px] font-bold flex items-center gap-1 w-max border border-status-available-border">
                              <span class="w-1.5 h-1.5 rounded-full bg-status-available"></span> Approved
                            </span>
                          ` : (b.status === 'REJECTED' ? `
                            <span class="px-2.5 py-0.5 rounded-full bg-status-error-bg text-status-error text-[10px] font-bold flex items-center gap-1 w-max border border-status-error-border">
                              <span class="w-1.5 h-1.5 rounded-full bg-status-error"></span> Rejected
                            </span>
                          ` : `
                            <span class="px-2.5 py-0.5 rounded-full bg-status-pending-bg text-status-pending text-[10px] font-bold flex items-center gap-1 w-max border border-status-pending-border">
                              <span class="w-1.5 h-1.5 rounded-full bg-status-pending"></span> Pending
                            </span>
                          `)}
                        </td>
                        <td class="p-3 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <a href="https://wa.me/${b.customer_phone ? b.customer_phone.replace(/[^0-9]/g, '') : ''}" target="_blank" class="p-1.5 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface" title="WhatsApp Customer">
                              <span class="material-symbols-outlined text-[16px]">chat</span>
                            </a>

                            ${b.status === 'PENDING' ? `
                              <button class="px-3 py-1.5 bg-tertiary text-white rounded text-xs font-bold hover:bg-tertiary/90 transition-colors" onclick="OwnerDashboardView.approveBooking('${b.id}', ${conflict})">
                                Approve
                              </button>
                              <button class="px-2.5 py-1.5 bg-surface-container text-error hover:bg-error-container rounded text-xs font-bold transition-colors" onclick="OwnerDashboardView.rejectBooking('${b.id}')">
                                Reject
                              </button>
                            ` : `
                              <span class="text-xs text-on-surface-variant font-medium">${b.status === 'APPROVED' || b.status === 'CONFIRMED' ? '✅ Slot Locked' : 'Done'}</span>
                            `}
                          </div>
                        </td>
                      </tr>
                    `}).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Mobile Stacked Request Cards -->
              <div class="md:hidden space-y-3">
                ${bookings.map(b => {
                  const conflict = isConflict(b);
                  return `
                  <div class="p-4 rounded-xl border ${conflict ? 'border-status-error-border bg-status-error-bg/10' : 'border-outline bg-surface-container-low'} space-y-2.5">
                    <div class="flex items-start justify-between gap-2">
                      <div>
                        <div class="font-bold text-sm text-on-surface">${b.customer_name}</div>
                        <a href="tel:${b.customer_phone}" class="text-xs text-secondary hover:underline">${b.customer_phone}</a>
                        <div class="text-[11px] text-on-surface-variant">${b.customer_email || ''}</div>
                      </div>
                      <div class="flex flex-col items-end gap-1">
                        ${conflict ? `<span class="px-2 py-0.5 rounded-full bg-status-error-bg text-status-error text-[10px] font-bold">⚠️ Conflict</span>` : ''}
                        ${b.status === 'APPROVED' || b.status === 'CONFIRMED' ? `
                          <span class="px-2 py-0.5 rounded-full bg-status-available-bg text-status-available text-[10px] font-bold">Approved</span>
                        ` : (b.status === 'REJECTED' ? `
                          <span class="px-2 py-0.5 rounded-full bg-status-error-bg text-status-error text-[10px] font-bold">Rejected</span>
                        ` : `
                          <span class="px-2 py-0.5 rounded-full bg-status-pending-bg text-status-pending text-[10px] font-bold">Pending</span>
                        `)}
                      </div>
                    </div>

                    <div class="text-xs text-on-surface-variant space-y-1">
                      <div><strong>Venue:</strong> ${b.hall_name}</div>
                      <div><strong>Date & Shift:</strong> ${b.date} • ${b.slot}</div>
                      <div><strong>Event:</strong> ${b.event_type} (${b.guests} guests)</div>
                      ${b.notes ? `<div><strong>Notes:</strong> ${b.notes}</div>` : ''}
                    </div>

                    ${conflict && b.status === 'PENDING' ? `
                      <div class="p-2 bg-status-error-bg rounded-lg border border-status-error-border text-[11px] text-status-error">
                        ⚠️ This slot (${b.slot}, ${b.date}) is already approved for another customer. Proceeding will double-book this slot.
                      </div>
                    ` : ''}

                    <div class="pt-2 border-t border-outline flex items-center justify-between gap-2">
                      <a href="https://wa.me/${b.customer_phone ? b.customer_phone.replace(/[^0-9]/g, '') : ''}" target="_blank" class="p-2 rounded-lg bg-surface-container-lowest border border-outline text-on-surface flex items-center gap-1 text-xs font-semibold">
                        <span class="material-symbols-outlined text-[16px]">chat</span> WhatsApp
                      </a>

                      <div class="flex items-center gap-1.5">
                        ${b.status === 'PENDING' ? `
                          <button class="px-3 py-1.5 bg-tertiary text-white rounded-lg text-xs font-bold" onclick="OwnerDashboardView.approveBooking('${b.id}', ${conflict})">
                            Approve
                          </button>
                          <button class="px-2.5 py-1.5 bg-surface-container text-error rounded-lg text-xs font-bold" onclick="OwnerDashboardView.rejectBooking('${b.id}')">
                            Reject
                          </button>
                        ` : `
                          <span class="text-xs text-on-surface-variant font-medium">${b.status === 'APPROVED' || b.status === 'CONFIRMED' ? '✅ Slot Locked' : 'Done'}</span>
                        `}
                      </div>
                    </div>
                  </div>
                `}).join('')}
              </div>
            `}
          </div>

          <!-- SECTION 4: PROPERTY PORTFOLIO -->
          <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline">
              <div>
                <span class="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">Properties</span>
                <h2 class="font-title-lg text-sm md:text-base font-bold text-on-surface">Registered Venue Holdings</h2>
              </div>
              <button class="px-3.5 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-inverse-surface" onclick="Modals.openAddHallWizard()">
                + Register Another Venue
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              ${myHalls.map(hall => {
                const fallbackUrl = window.appStore.getPlaceholderImage(hall.name);
                return `
                  <div class="p-4 rounded-xl border border-outline bg-surface-container-low space-y-3 flex flex-col justify-between">
                    <div class="space-y-2">
                      <div class="relative aspect-video rounded-lg overflow-hidden bg-surface-container">
                        <img src="${hall.cover_image}" alt="${hall.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                        <span class="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${hall.status === 'LIVE' ? 'bg-status-available-bg text-status-available border border-status-available-border' : (hall.status === 'PENDING_APPROVAL' ? 'bg-status-pending-bg text-status-pending border border-status-pending-border' : 'bg-slate-700 text-white')}">
                          ${hall.status}
                        </span>
                      </div>

                      <h3 class="font-title-md text-sm font-bold text-on-surface line-clamp-1">${hall.name}</h3>
                      <p class="text-xs text-on-surface-variant">${hall.city} • Seats ${hall.seating_capacity} • Max ${hall.maximum_capacity}</p>
                      
                      <div class="flex items-center justify-between text-xs pt-1 border-t border-outline">
                        <span class="text-on-surface-variant">Public Calendar:</span>
                        <span class="font-bold ${hall.public_availability ? 'text-status-available' : 'text-status-pending'}">
                          ${hall.public_availability ? 'Active' : 'Private (Hidden)'}
                        </span>
                      </div>
                    </div>

                    <div class="pt-2 flex items-center justify-between gap-2 border-t border-outline">
                      <a href="#/hall/${hall.id}" class="text-xs text-primary font-bold hover:underline">
                        View Public Page
                      </a>
                      <button class="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded text-xs font-bold" onclick="Modals.openAddHallWizard()">
                        Edit Specs
                      </button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  approveBooking(id, hasConflict = false) {
    if (hasConflict) {
      const proceed = confirm(
        '⚠️ Warning: This slot is already approved for another customer. Approving this request will double-book the same slot. Do you want to proceed?'
      );
      if (!proceed) return;
    }
    window.appStore.approveBooking(id);
    Toast.success('✅ Booking Approved', `Booking ${id} approved. The slot has been locked in the calendar.`);
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  rejectBooking(id) {
    const reason = prompt('Optional: Enter a reason for rejection (or press OK to use default):', '');
    window.appStore.rejectBooking(id, reason && reason.trim() ? reason.trim() : 'Owner unavailable for the requested date/shift.');
    Toast.info('Booking Rejected', `Booking ${id} has been rejected.`);
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  updateBooking(id, status) {
    window.appStore.updateBookingStatus(id, status);
    Toast.success('Booking Updated', `Booking ${id} is now ${status}.`);
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  toggleHallPublicAvailability(isPublic) {
    const halls = window.appStore.getHalls();
    const hall = halls[0];
    if (hall) {
      window.appStore.updateHall(hall.id, { public_availability: isPublic });
      Toast.info('Visibility Updated', `Public calendar for "${hall.name}" is now ${isPublic ? 'PUBLIC' : 'PRIVATE'}.`);
    }
  }
};

window.OwnerDashboardView = OwnerDashboardView;
