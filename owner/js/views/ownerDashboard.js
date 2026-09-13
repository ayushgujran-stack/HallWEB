// Hall Owner Operational Dashboard
// Luxury host workspace with multi-hall switcher, interactive year-round availability calendar,
// custom date range blockouts, peak surge tariffs, and customer hold approval ledger.

const OwnerDashboardView = {
  activeHallId: null,
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  selectedDate: new Date().toISOString().split('T')[0],
  bookingFilter: 'all', // 'all' or 'active'

  switchActiveHall(hallId) {
    this.activeHallId = hallId;
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  changeMonth(delta) {
    this.calendarMonth += delta;
    if (this.calendarMonth < 0) {
      this.calendarMonth = 11;
      this.calendarYear -= 1;
    } else if (this.calendarMonth > 11) {
      this.calendarMonth = 0;
      this.calendarYear += 1;
    }
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  setMonthYear(month, year) {
    this.calendarMonth = parseInt(month, 10);
    this.calendarYear = parseInt(year, 10);
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  selectDate(dateStr) {
    this.selectedDate = dateStr;
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  jumpToDate(dateStr) {
    if (!dateStr) return;
    this.selectedDate = dateStr;
    const d = new Date(dateStr + 'T00:00:00');
    if (!isNaN(d.getTime())) {
      this.calendarYear = d.getFullYear();
      this.calendarMonth = d.getMonth();
    }
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  toggleShift(dateStr, shiftKey) {
    const currentStatus = window.appStore.toggleSlotMaintenance(dateStr, shiftKey, this.activeHallId);
    Toast.info('Shift Updated', `${shiftKey} on ${dateStr} is now ${currentStatus.toUpperCase()}.`);
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

  saveShiftTariff(dateStr, shiftKey) {
    const inputEl = document.getElementById(`tariff-input-${shiftKey}`);
    if (!inputEl) return;
    const newPrice = Number(inputEl.value);
    if (!newPrice || newPrice <= 0) {
      Toast.error('Invalid Tariff', 'Please enter a valid price amount in ₹.');
      return;
    }
    window.appStore.setCustomSlotPrice(dateStr, shiftKey, newPrice, this.activeHallId);
    Toast.success('Tariff Updated', `Set ${shiftKey} tariff to ₹${newPrice.toLocaleString('en-IN')} on ${dateStr}.`);
    const container = document.getElementById('app-content');
    if (container) container.innerHTML = this.render();
  },

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

    if (!this.activeHallId || !myHalls.some(h => h.id === this.activeHallId)) {
      this.activeHallId = myHalls[0]?.id || 'hall-1';
    }
    const currentHall = myHalls.find(h => h.id === this.activeHallId) || myHalls[0] || {};

    const allBookings = window.appStore.getBookings();
    const myBookings = allBookings.filter(b => myHalls.some(h => h.id === b.hall_id));
    const activeHallBookings = allBookings.filter(b => b.hall_id === currentHall.id);
    const displayedBookings = (this.bookingFilter === 'active') ? activeHallBookings : myBookings;

    const liveHalls = myHalls.filter(h => h.status === 'LIVE');
    const pendingHalls = myHalls.filter(h => h.status === 'PENDING_APPROVAL');
    const pendingBookings = myBookings.filter(b => b.status === 'PENDING');
    const approvedBookings = myBookings.filter(b => b.status === 'APPROVED' || b.status === 'CONFIRMED');
    const totalGross = approvedBookings.reduce((sum, b) => sum + (b.amount || 75000), 0);

    // Conflict detection helper
    const approvedSlotKeys = new Set(
      approvedBookings.map(b => `${b.hall_id}__${b.date}__${b.slot}`)
    );
    const isConflict = (b) => b.status === 'PENDING' && approvedSlotKeys.has(`${b.hall_id}__${b.date}__${b.slot}`);

    const displayName = currentUser.business_name || (currentUser.name ? `${currentUser.name}'s Host Portfolio` : 'Regal Horizons Hospitality Group');

    // Calendar Calculations
    const year = this.calendarYear;
    const month = this.calendarMonth;
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const todayStr = new Date().toISOString().split('T')[0];

    // Selected Date Details
    const selectedDateObj = new Date(this.selectedDate + 'T00:00:00');
    const selectedDateFormatted = isNaN(selectedDateObj.getTime()) ? this.selectedDate : selectedDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const dateMatrix = window.appStore.getHallDateMatrix(currentHall.id, this.selectedDate);
    const shiftDefs = [
      { key: 'Morning', name: 'Morning (7AM - 2PM)', short: 'Morning', hours: '7:00 AM – 2:00 PM' },
      { key: 'Afternoon', name: 'Afternoon (12PM - 4PM)', short: 'Afternoon', hours: '12:00 PM – 4:00 PM' },
      { key: 'Evening', name: 'Evening (4PM - 11PM)', short: 'Evening', hours: '4:00 PM – 11:00 PM' },
      { key: 'Night', name: 'Night (7PM - 1AM)', short: 'Night', hours: '7:00 PM – 1:00 AM' },
      { key: 'Full Day', name: 'Full Day (24 Hours)', short: 'Full Day', hours: '24 Hours Venue Hold' }
    ];

    return `
      <div class="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-surface py-6 md:py-8">
        <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop w-full space-y-6 md:space-y-8">
          
          <!-- SECTION 1: HEADER & MULTI-HALL SWITCHER -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-2xl border border-outline shadow-sm">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-label-sm text-xs uppercase tracking-widest text-secondary font-bold">Owner Workspace</span>
                <span class="text-xs text-on-surface-variant">• Verified Host Portfolio</span>
              </div>
              <h1 class="font-headline-lg text-2xl md:text-3xl text-on-surface tracking-tight font-serif font-bold">
                ${displayName}
              </h1>
              <p class="font-body-md text-xs md:text-sm text-on-surface-variant max-w-2xl leading-relaxed">
                Central command for managing banquets, full-year calendar availability, seasonal tariffs, and customer booking approvals.
              </p>
            </div>

            <!-- Multi-Hall Switcher & Actions -->
            <div class="flex items-center gap-3 flex-wrap">
              
              <!-- Luxury Venue Switcher -->
              <div class="flex items-center gap-2 bg-surface-container-low p-1.5 rounded-xl border border-outline shadow-inner">
                <span class="material-symbols-outlined text-[18px] text-secondary pl-1.5">apartment</span>
                <span class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden sm:inline">Active Venue:</span>
                <select onchange="OwnerDashboardView.switchActiveHall(this.value)" class="bg-surface-container-lowest text-xs font-bold text-on-surface py-1.5 px-3 rounded-lg border border-outline cursor-pointer shadow-sm outline-none focus:border-secondary">
                  ${myHalls.map(h => `
                    <option value="${h.id}" ${h.id === currentHall.id ? 'selected' : ''}>
                      ${h.name} • ${h.status === 'LIVE' ? '🟢 Live' : '🟡 Audit'}
                    </option>
                  `).join('')}
                </select>
              </div>

              <button class="flex items-center gap-1.5 px-4 py-2.5 bg-primary text-white font-label-md text-xs uppercase tracking-wider rounded-xl hover:bg-inverse-surface shadow-sm transition-all font-bold" onclick="Modals.openAddHallWizard()">
                <span class="material-symbols-outlined text-[17px]">add_circle</span>
                <span>Add Venue</span>
              </button>
            </div>
          </div>

          <!-- KPI Metric Cards -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            
            <!-- Actionable: Pending Holds -->
            <div class="bg-secondary-fixed p-4 md:p-5 rounded-xl border border-secondary/20 shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between text-on-secondary-fixed mb-2">
                <span class="font-label-sm text-[11px] uppercase tracking-wider font-bold">Action Needed: New Holds</span>
                <span class="material-symbols-outlined text-[20px]">bolt</span>
              </div>
              <div>
                <div class="font-display-lg text-2xl md:text-3xl font-bold text-on-secondary-fixed">${pendingBookings.length}</div>
                <p class="font-body-sm text-xs text-on-secondary-fixed font-medium mt-0.5">Awaiting host approval</p>
              </div>
            </div>

            <!-- Published Properties -->
            <div class="bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between text-on-surface-variant mb-2">
                <span class="font-label-sm text-[11px] uppercase tracking-wider font-bold">Published Venues</span>
                <span class="material-symbols-outlined text-[20px] text-tertiary">check_circle</span>
              </div>
              <div>
                <div class="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">${liveHalls.length} / ${myHalls.length}</div>
                <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">Live on customer marketplace</p>
              </div>
            </div>

            <!-- Confirmed Gross Revenue -->
            <div class="bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between text-on-surface-variant mb-2">
                <span class="font-label-sm text-[11px] uppercase tracking-wider font-bold">Confirmed Gross</span>
                <span class="material-symbols-outlined text-[20px] text-secondary">trending_up</span>
              </div>
              <div>
                <div class="font-display-lg text-2xl md:text-3xl font-bold text-on-surface">₹${Math.round(totalGross / 1000)}k</div>
                <p class="font-body-sm text-xs text-on-surface-variant mt-0.5">${approvedBookings.length} Approved holds</p>
              </div>
            </div>

            <!-- Active Venue Public Calendar Status -->
            <div class="bg-surface-container-lowest p-4 md:p-5 rounded-xl border border-outline shadow-sm flex flex-col justify-between">
              <div class="flex items-center justify-between text-on-surface-variant mb-2">
                <span class="font-label-sm text-[11px] uppercase tracking-wider font-bold">${currentHall.name ? currentHall.name.substring(0, 16) + '...' : 'Venue'}</span>
                <span class="material-symbols-outlined text-[20px] ${currentHall.public_availability ? 'text-status-available' : 'text-slate-400'}">event_available</span>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-bold text-sm text-on-surface">${currentHall.public_availability ? 'Public Calendar' : 'Private Calendar'}</div>
                  <p class="text-[11px] text-on-surface-variant mt-0.5">${currentHall.public_availability ? 'Guests can hold slots' : 'Direct contact only'}</p>
                </div>
                <label class="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" class="sr-only peer" ${currentHall.public_availability ? 'checked' : ''} onchange="OwnerDashboardView.toggleHallPublicAvailability(this.checked, '${currentHall.id}')">
                  <div class="w-10 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-secondary"></div>
                </label>
              </div>
            </div>

          </div>

          <!-- SECTION 2: INTERACTIVE AVAILABILITY CALENDAR & TARIFF CONTROLS -->
          <div class="bg-surface-container-lowest p-5 md:p-6 rounded-2xl border border-outline shadow-sm space-y-5" id="owner-calendar-section">
            
            <!-- Section Header & Venue Label -->
            <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-outline">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">Venue Schedule & Tariffs</span>
                  <span class="px-2 py-0.5 rounded-md bg-secondary-fixed/50 text-secondary text-[11px] font-bold">
                    Managing: ${currentHall.name}
                  </span>
                </div>
                <h2 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif mt-0.5">
                  Year-Round Availability & Rate Controls
                </h2>
              </div>

              <!-- Quick Action Buttons -->
              <div class="flex items-center gap-2 flex-wrap">
                <button onclick="Modals.openBlockRangeModal('${currentHall.id}', '${this.selectedDate}')" class="px-3.5 py-2 bg-error/10 text-error hover:bg-error/20 border border-error/20 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all">
                  <span class="material-symbols-outlined text-[16px]">lock</span>
                  <span>Block Date Range</span>
                </button>

                <button onclick="Modals.openPeakPricingModal('${currentHall.id}', '${this.selectedDate}')" class="px-3.5 py-2 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all">
                  <span class="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>Set Peak Tariff</span>
                </button>

                <button onclick="Modals.openUnblockRangeModal('${currentHall.id}', '${this.selectedDate}')" class="px-3 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all">
                  <span class="material-symbols-outlined text-[16px]">lock_open</span>
                  <span>Restore Range</span>
                </button>
              </div>
            </div>

            <!-- Calendar Navigation Toolbar -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline">
              <div class="flex items-center gap-2">
                <button onclick="OwnerDashboardView.changeMonth(-1)" class="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline flex items-center justify-center text-on-surface hover:text-secondary transition-colors" title="Previous Month">
                  <span class="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <div class="flex items-center gap-1.5">
                  <select onchange="OwnerDashboardView.setMonthYear(this.value, ${year})" class="font-headline-sm text-sm font-bold text-on-surface bg-surface-container-lowest border border-outline rounded-lg py-1 px-2.5 cursor-pointer outline-none shadow-sm">
                    ${monthNames.map((m, idx) => `
                      <option value="${idx}" ${idx === month ? 'selected' : ''}>${m}</option>
                    `).join('')}
                  </select>
                  <select onchange="OwnerDashboardView.setMonthYear(${month}, this.value)" class="font-headline-sm text-sm font-bold text-secondary bg-surface-container-lowest border border-outline rounded-lg py-1 px-2.5 cursor-pointer outline-none shadow-sm">
                    ${[year - 1, year, year + 1, year + 2].map(y => `
                      <option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>
                    `).join('')}
                  </select>
                </div>
                <button onclick="OwnerDashboardView.changeMonth(1)" class="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline flex items-center justify-center text-on-surface hover:text-secondary transition-colors" title="Next Month">
                  <span class="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>

              <!-- Quick Jump & Legend -->
              <div class="flex items-center gap-3 flex-wrap justify-between sm:justify-end">
                <div class="flex items-center gap-1.5">
                  <span class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden md:inline">Jump:</span>
                  <input type="date" value="${this.selectedDate}" onchange="OwnerDashboardView.jumpToDate(this.value)" class="text-xs p-1.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface font-semibold focus:border-secondary outline-none shadow-sm cursor-pointer" title="Pick any date across the whole year">
                </div>
                <div class="flex items-center gap-2 text-[11px]">
                  <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-available"></span> Open</span>
                  <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-pending"></span> Pending</span>
                  <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-error"></span> Approved</span>
                  <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Blocked</span>
                </div>
              </div>
            </div>

            <!-- Month Calendar Grid -->
            <div class="bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-outline overflow-hidden shadow-sm">
              <!-- Weekday Headers -->
              <div class="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-on-surface-variant pb-2 border-b border-outline uppercase tracking-wider">
                <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
              </div>

              <!-- Day Cells -->
              <div class="grid grid-cols-7 gap-1 pt-2">
                ${Array.from({ length: firstDayIndex }).map(() => `
                  <div class="min-h-[55px] sm:min-h-[65px] p-1 bg-surface-container-low/20 rounded-lg border border-transparent opacity-30"></div>
                `).join('')}

                ${Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                  const isSelected = (this.selectedDate === dateStr);
                  const isToday = (dateStr === todayStr);

                  const dayMatrix = window.appStore.getHallDateMatrix(currentHall.id, dateStr);
                  const dayBookings = allBookings.filter(b => b.hall_id === currentHall.id && b.date === dateStr && b.status !== 'CANCELLED' && b.status !== 'REJECTED');
                  
                  let blockedCount = 0;
                  let bookedCount = 0;
                  let pendingCount = 0;
                  let hasPeak = false;

                  shiftDefs.forEach(s => {
                    const match = dayBookings.find(b => b.slot && (b.slot === s.name || b.slot.toLowerCase().startsWith(s.key.toLowerCase())));
                    if (match) {
                      if (match.status === 'APPROVED' || match.status === 'CONFIRMED') bookedCount++;
                      else if (match.status === 'PENDING') pendingCount++;
                    } else if (dayMatrix[s.key]?.status === 'blocked') {
                      blockedCount++;
                    }
                    if (dayMatrix[s.key]?.isPeak) hasPeak = true;
                  });

                  const availCount = Math.max(0, 5 - (blockedCount + bookedCount + pendingCount));

                  let statusBadge = '';
                  let dotClass = 'bg-status-available';

                  if (blockedCount === 5) {
                    statusBadge = `<span class="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-slate-200 text-slate-700 border border-slate-300">Blocked</span>`;
                    dotClass = 'bg-slate-400';
                  } else if (pendingCount > 0) {
                    statusBadge = `<span class="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-status-pending-bg text-status-pending border border-status-pending-border">${pendingCount} Pending</span>`;
                    dotClass = 'bg-status-pending';
                  } else if (availCount === 0) {
                    statusBadge = `<span class="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-status-error-bg text-status-error border border-status-error-border">Full</span>`;
                    dotClass = 'bg-status-error';
                  } else {
                    statusBadge = `<span class="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-status-available-bg text-status-available border border-status-available-border">${availCount} Open</span>`;
                    dotClass = 'bg-status-available';
                  }

                  return `
                    <div 
                      onclick="OwnerDashboardView.selectDate('${dateStr}')" 
                      class="min-h-[55px] sm:min-h-[65px] p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-secondary-fixed/50 border-secondary ring-2 ring-secondary shadow-md scale-[1.02] z-10' 
                          : 'bg-surface-container-low hover:bg-surface-container border-outline/70 hover:border-outline'
                      }">
                      <div class="flex items-center justify-between">
                        <span class="text-xs font-bold ${isSelected ? 'text-secondary font-black' : (isToday ? 'text-primary underline font-black' : 'text-on-surface')}">
                          ${dayNum}
                        </span>
                        <div class="flex items-center gap-1">
                          ${hasPeak ? `<span class="text-[8px] font-bold text-amber-600 bg-amber-100 px-1 rounded">P</span>` : ''}
                          <span class="w-1.5 h-1.5 rounded-full ${dotClass}"></span>
                        </div>
                      </div>
                      <div class="mt-0.5">
                        ${statusBadge}
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Shift Inspector & Rate Editor for Selected Date -->
            <div class="bg-surface-container-low p-5 rounded-xl border border-outline space-y-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-outline">
                <div>
                  <span class="text-[10px] font-bold text-secondary uppercase tracking-widest">Shift Inspector & Rate Editor</span>
                  <h3 class="font-headline-sm text-base font-bold text-on-surface font-serif">
                    ${selectedDateFormatted}
                  </h3>
                </div>
                <div class="flex items-center gap-2">
                  <button onclick="Modals.openBlockRangeModal('${currentHall.id}', '${this.selectedDate}')" class="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-xs font-bold rounded-lg border border-outline">
                    Block Full Day
                  </button>
                </div>
              </div>

              <!-- 5 Shifts List with Live Toggle and Custom Price Input -->
              <div class="grid grid-cols-1 md:grid-cols-5 gap-3">
                ${shiftDefs.map(s => {
                  const dayBookings = allBookings.filter(b => b.hall_id === currentHall.id && b.date === this.selectedDate && b.status !== 'CANCELLED' && b.status !== 'REJECTED');
                  const bookingMatch = dayBookings.find(b => b.slot && (b.slot === s.name || b.slot.toLowerCase().startsWith(s.key.toLowerCase())));
                  
                  const slotConfig = dateMatrix[s.key] || { status: 'available', price: 75000 };
                  let effectiveStatus = slotConfig.status;
                  if (bookingMatch) {
                    effectiveStatus = (bookingMatch.status === 'APPROVED' || bookingMatch.status === 'CONFIRMED') ? 'booked' : 'pending';
                  }

                  const isBlocked = (effectiveStatus === 'blocked');
                  const isBooked = (effectiveStatus === 'booked');
                  const isPending = (effectiveStatus === 'pending');
                  const isAvail = (effectiveStatus === 'available');

                  return `
                    <div class="p-3.5 bg-surface-container-lowest rounded-xl border border-outline flex flex-col justify-between space-y-3 shadow-sm">
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <span class="font-bold text-xs uppercase tracking-wider text-on-surface">${s.short}</span>
                          ${isAvail ? `
                            <span class="px-2 py-0.5 rounded-full bg-status-available-bg text-status-available text-[10px] font-bold">Open</span>
                          ` : (isPending ? `
                            <span class="px-2 py-0.5 rounded-full bg-status-pending-bg text-status-pending text-[10px] font-bold animate-pulse">Pending</span>
                          ` : (isBooked ? `
                            <span class="px-2 py-0.5 rounded-full bg-status-error-bg text-status-error text-[10px] font-bold">Approved</span>
                          ` : `
                            <span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">Blocked</span>
                          `))}
                        </div>
                        <p class="text-[11px] text-on-surface-variant">${s.hours}</p>

                        <!-- Pending / Approved Booking Info Box -->
                        ${bookingMatch ? `
                          <div class="mt-2 p-2 bg-secondary-fixed/30 rounded-lg border border-secondary/20 text-[11px] space-y-1">
                            <div class="font-bold text-on-surface flex items-center justify-between">
                              <span>${bookingMatch.customer_name}</span>
                              <a href="https://wa.me/${bookingMatch.customer_phone ? bookingMatch.customer_phone.replace(/[^0-9]/g, '') : ''}" target="_blank" class="text-secondary hover:underline flex items-center gap-0.5">
                                <span class="material-symbols-outlined text-[13px]">chat</span>
                              </a>
                            </div>
                            <div class="text-on-surface-variant">${bookingMatch.guests} guests • ${bookingMatch.event_type}</div>
                            ${isPending ? `
                              <div class="pt-1 flex items-center gap-1.5">
                                <button onclick="OwnerDashboardView.approveBooking('${bookingMatch.id}')" class="w-full py-1 bg-tertiary text-white font-bold text-[10px] rounded hover:bg-tertiary/90">
                                  Approve
                                </button>
                                <button onclick="OwnerDashboardView.rejectBooking('${bookingMatch.id}')" class="w-full py-1 bg-surface-container text-error font-bold text-[10px] rounded hover:bg-error-container">
                                  Reject
                                </button>
                              </div>
                            ` : ''}
                          </div>
                        ` : ''}
                      </div>

                      <!-- Shift Tariff Editor -->
                      <div class="space-y-2 pt-2 border-t border-outline">
                        <div>
                          <div class="flex items-center justify-between text-[10px] text-on-surface-variant uppercase font-bold mb-1">
                            <span>Shift Tariff</span>
                            ${slotConfig.isPeak ? `<span class="text-amber-700 font-extrabold">+${Math.round(((slotConfig.surgeMultiplier || 1.25) - 1) * 100)}% Surge</span>` : ''}
                          </div>
                          <div class="flex items-center gap-1">
                            <span class="text-xs font-bold text-on-surface">₹</span>
                            <input type="number" id="tariff-input-${s.key}" value="${slotConfig.price || 75000}" step="1000" min="10000" class="w-full text-xs font-bold p-1 rounded border border-outline bg-surface-container-low text-on-surface outline-none focus:border-secondary">
                            <button onclick="OwnerDashboardView.saveShiftTariff('${this.selectedDate}', '${s.key}')" class="p-1 rounded bg-secondary text-white hover:bg-secondary/90 text-[10px] font-bold" title="Save Tariff">
                              <span class="material-symbols-outlined text-[14px]">save</span>
                            </button>
                          </div>
                        </div>

                        <!-- Toggle Shift Block/Unblock -->
                        ${!isBooked && !isPending ? `
                          <button onclick="OwnerDashboardView.toggleShift('${this.selectedDate}', '${s.key}')" class="w-full py-1.5 text-xs font-bold rounded-lg border transition-all ${
                            isBlocked 
                              ? 'bg-status-available-bg text-status-available border-status-available-border hover:bg-status-available-bg/80' 
                              : 'bg-surface-container text-error border-outline hover:bg-error/10'
                          }">
                            ${isBlocked ? '🔓 Restore Shift' : '⛔ Block Shift'}
                          </button>
                        ` : ''}
                      </div>

                    </div>
                  `;
                }).join('')}
              </div>
            </div>

          </div>

          <!-- SECTION 3: INCOMING CUSTOMER REQUESTS & HOLD APPROVALS -->
          <div class="bg-surface-container-lowest p-5 md:p-6 rounded-2xl border border-outline shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline">
              <div>
                <span class="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">Booking Approvals</span>
                <h2 class="font-headline-sm text-base md:text-lg font-bold text-on-surface">Customer Hold Requests</h2>
              </div>
              
              <!-- Filter Dropdown -->
              <div class="flex items-center gap-2">
                <span class="text-xs text-on-surface-variant font-medium">Filter:</span>
                <select onchange="OwnerDashboardView.bookingFilter = this.value; const c = document.getElementById('app-content'); if(c) c.innerHTML = OwnerDashboardView.render();" class="text-xs font-bold p-1.5 rounded-lg border border-outline bg-surface-container-low text-on-surface outline-none">
                  <option value="all" ${this.bookingFilter === 'all' ? 'selected' : ''}>All My Venues (${myBookings.length})</option>
                  <option value="active" ${this.bookingFilter === 'active' ? 'selected' : ''}>Current: ${currentHall.name} (${activeHallBookings.length})</option>
                </select>
              </div>
            </div>

            ${displayedBookings.length === 0 ? `
              <div class="py-12 text-center bg-surface-container rounded-xl border border-dashed border-outline">
                <span class="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-2 block">inbox</span>
                <p class="text-xs text-on-surface-variant">No customer hold requests found for this filter. They'll appear here immediately when visitors hold slots.</p>
              </div>
            ` : `
              <!-- Desktop Table -->
              <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-surface-container-low text-on-surface-variant font-label-sm text-[11px] uppercase">
                      <th class="p-3 rounded-l-lg">Customer</th>
                      <th class="p-3">Venue</th>
                      <th class="p-3">Event &amp; Guests</th>
                      <th class="p-3">Date &amp; Shift</th>
                      <th class="p-3">Tariff</th>
                      <th class="p-3">Status</th>
                      <th class="p-3 text-right rounded-r-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-outline">
                    ${displayedBookings.map(b => {
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
                        <td class="p-3 font-bold text-on-surface">₹${(b.amount || 75000).toLocaleString('en-IN')}</td>
                        <td class="p-3">
                          ${conflict ? `<div class="mb-1 px-2 py-0.5 rounded-full bg-status-error-bg text-status-error text-[10px] font-bold border border-status-error-border flex items-center gap-1 w-max">⚠️ Conflict</div>` : ''}
                          ${b.status === 'APPROVED' || b.status === 'CONFIRMED' ? `
                            <span class="px-2.5 py-0.5 rounded-full bg-status-available-bg text-status-available text-[10px] font-bold flex items-center gap-1 w-max border border-status-available-border">
                              <span class="w-1.5 h-1.5 rounded-full bg-status-available"></span> Approved
                            </span>
                          ` : (b.status === 'REJECTED' ? `
                            <span class="px-2.5 py-0.5 rounded-full bg-status-error-bg text-status-error text-[10px] font-bold flex items-center gap-1 w-max border border-status-error-border">
                              <span class="w-1.5 h-1.5 rounded-full bg-status-error"></span> Rejected
                            </span>
                          ` : `
                            <span class="px-2.5 py-0.5 rounded-full bg-status-pending-bg text-status-pending text-[10px] font-bold flex items-center gap-1 w-max border border-status-pending-border animate-pulse">
                              <span class="w-1.5 h-1.5 rounded-full bg-status-pending"></span> Pending Approval
                            </span>
                          `)}
                        </td>
                        <td class="p-3 text-right">
                          <div class="flex items-center justify-end gap-1.5">
                            <a href="https://wa.me/${b.customer_phone ? b.customer_phone.replace(/[^0-9]/g, '') : ''}" target="_blank" class="p-1.5 rounded-md bg-surface-container hover:bg-surface-container-high text-on-surface" title="WhatsApp Customer">
                              <span class="material-symbols-outlined text-[16px]">chat</span>
                            </a>

                            ${b.status === 'PENDING' ? `
                              <button class="px-3 py-1.5 bg-tertiary text-white rounded-lg text-xs font-bold hover:bg-tertiary/90 transition-colors shadow-sm" onclick="OwnerDashboardView.approveBooking('${b.id}', ${conflict})">
                                Approve Hold
                              </button>
                              <button class="px-2.5 py-1.5 bg-surface-container text-error hover:bg-error-container rounded-lg text-xs font-bold transition-colors" onclick="OwnerDashboardView.rejectBooking('${b.id}')">
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

              <!-- Mobile Cards -->
              <div class="md:hidden space-y-3">
                ${displayedBookings.map(b => {
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
                      <div><strong>Date &amp; Shift:</strong> ${b.date} • ${b.slot}</div>
                      <div><strong>Tariff:</strong> ₹${(b.amount || 75000).toLocaleString('en-IN')}</div>
                      <div><strong>Event:</strong> ${b.event_type} (${b.guests} guests)</div>
                      ${b.notes ? `<div><strong>Notes:</strong> ${b.notes}</div>` : ''}
                    </div>

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
          <div class="bg-surface-container-lowest p-5 md:p-6 rounded-2xl border border-outline shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-outline">
              <div>
                <span class="font-label-sm text-xs uppercase tracking-wider text-secondary font-bold">Portfolio</span>
                <h2 class="font-title-lg text-base md:text-lg font-bold text-on-surface">Your Registered Venues</h2>
              </div>
              <button class="px-3.5 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-inverse-surface" onclick="Modals.openAddHallWizard()">
                + Register Another Venue
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              ${myHalls.map(hall => {
                const fallbackUrl = window.appStore.getPlaceholderImage(hall.name);
                const isCurrent = (hall.id === currentHall.id);

                return `
                  <div class="p-4 rounded-xl border transition-all ${isCurrent ? 'border-secondary ring-2 ring-secondary/40 bg-secondary-fixed/20' : 'border-outline bg-surface-container-low'} space-y-3 flex flex-col justify-between">
                    <div class="space-y-2">
                      <div class="relative aspect-video rounded-lg overflow-hidden bg-surface-container">
                        <img src="${hall.cover_image}" alt="${hall.name}" class="w-full h-full object-cover" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                        <span class="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold ${hall.status === 'LIVE' ? 'bg-status-available-bg text-status-available border border-status-available-border' : (hall.status === 'PENDING_APPROVAL' ? 'bg-status-pending-bg text-status-pending border border-status-pending-border' : 'bg-slate-700 text-white')}">
                          ${hall.status}
                        </span>
                        ${isCurrent ? `
                          <span class="absolute top-2 right-2 px-2 py-0.5 rounded bg-secondary text-white text-[10px] font-black shadow">
                            Active
                          </span>
                        ` : ''}
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
                      <a href="/customer/#/hall/${hall.id}" target="_blank" class="text-xs text-primary font-bold hover:underline flex items-center gap-0.5">
                        <span>Customer View</span>
                        <span class="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                      <button class="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded text-xs font-bold" onclick="OwnerDashboardView.switchActiveHall('${hall.id}')">
                        ${isCurrent ? 'Selected' : 'Manage Calendar'}
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

  toggleHallPublicAvailability(isPublic, hallId = null) {
    const targetId = hallId || this.activeHallId;
    if (targetId) {
      window.appStore.updateHall(targetId, { public_availability: isPublic });
      const hall = window.appStore.getHallById(targetId);
      Toast.info('Visibility Updated', `Public calendar for "${hall?.name || 'Venue'}" is now ${isPublic ? 'PUBLIC' : 'PRIVATE'}.`);
    }
  }
};

window.OwnerDashboardView = OwnerDashboardView;
