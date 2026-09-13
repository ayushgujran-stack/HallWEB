// Hall Details & Booking Experience
// Refined luxury presentation with accessible shift calendar, sticky desktop card & mobile bottom bar

const DetailsView = {
  currentHallId: null,
  selectedDate: null,
  selectedSlot: null,
  selectedPrice: null,
  activeBookingTab: 'direct', // 'direct' or 'enquiry'

  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),

  changeMonth(delta) {
    this.calendarMonth += delta;
    if (this.calendarMonth < 0) {
      this.calendarMonth = 11;
      this.calendarYear--;
    } else if (this.calendarMonth > 11) {
      this.calendarMonth = 0;
      this.calendarYear++;
    }
    this.refreshCalendar();
  },

  setMonthYear(month, year) {
    this.calendarMonth = parseInt(month, 10);
    this.calendarYear = parseInt(year, 10);
    this.refreshCalendar();
  },

  jumpToDate(dateStr) {
    if (!dateStr) return;
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      this.calendarYear = parseInt(parts[0], 10);
      this.calendarMonth = parseInt(parts[1], 10) - 1;
      this.selectDate(dateStr);
    }
  },

  selectDate(dateStr) {
    this.selectedDate = dateStr;
    const hall = window.appStore.getHallById(this.currentHallId);
    if (hall) {
      const slots = this.getDaySlots(hall, dateStr);
      const currentAvail = slots.find(s => s.name === this.selectedSlot && s.status === 'available');
      if (currentAvail) {
        this.selectedPrice = currentAvail.price;
        this.updateBookingCardDisplays(dateStr, currentAvail.name, currentAvail.price);
      } else {
        const firstAvail = slots.find(s => s.status === 'available');
        if (firstAvail) {
          this.selectedSlot = firstAvail.name;
          this.selectedPrice = firstAvail.price;
          this.updateBookingCardDisplays(dateStr, firstAvail.name, firstAvail.price);
        } else {
          this.selectedSlot = null;
          this.selectedPrice = null;
          this.updateBookingCardDisplays(dateStr, null, null);
        }
      }
    }
    this.refreshCalendar();
  },

  selectSlot(date, slot, price) {
    this.selectedDate = date;
    this.selectedSlot = slot;
    this.selectedPrice = price;

    this.updateBookingCardDisplays(date, slot, price);
    this.refreshCalendar();
    Toast.info('Slot Selected', `Configured reservation for ${date} (${slot}).`);
  },

  updateBookingCardDisplays(date, slot, price) {
    const slotDisp = document.getElementById('selected-slot-display');
    const priceDisp = document.getElementById('selected-price-display');
    if (slotDisp) {
      if (date && slot) {
        slotDisp.innerHTML = `<span class="text-secondary font-bold">${date}</span> • <span class="font-bold text-on-surface">${slot}</span>`;
      } else if (date) {
        slotDisp.innerHTML = `<span class="text-secondary font-bold">${date}</span> • <span class="text-on-surface-variant font-medium">Please pick a shift below</span>`;
      } else {
        slotDisp.innerHTML = `<span class="text-amber-700 font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">touch_app</span> Click an available shift from calendar</span>`;
      }
    }
    if (priceDisp) {
      if (price) {
        priceDisp.innerText = `₹${price.toLocaleString('en-IN')} Shift Tariff`;
      } else {
        const hall = window.appStore.getHallById(this.currentHallId);
        const minPrice = hall?.pricing ? Math.min(...Object.values(hall.pricing)) : 60000;
        priceDisp.innerText = `Starting from ₹${minPrice.toLocaleString('en-IN')} / shift`;
      }
    }
  },

  refreshCalendar() {
    const hall = window.appStore.getHallById(this.currentHallId);
    const calContainer = document.getElementById('calendar-grid-container');
    if (calContainer && hall) {
      calContainer.innerHTML = this.renderCalendar(hall);
    }
  },

  getDaySlots(hall, dateStr) {
    const p = hall.pricing || { morning: 85000, afternoon: 60000, evening: 95000, night: 75000, full_day: 210000 };
    const allBookings = window.appStore ? window.appStore.getBookings() : [];
    const hallBookings = allBookings.filter(b => b.hall_id === hall.id && b.date === dateStr && b.status !== 'CANCELLED' && b.status !== 'REJECTED');
    const dateMatrix = window.appStore ? window.appStore.getHallDateMatrix(hall.id, dateStr) : {};

    const standardSlots = [
      { key: 'Morning', name: 'Morning (7AM - 2PM)', short: 'Morning', hours: '7:00 AM – 2:00 PM', defaultPrice: p.morning || 85000 },
      { key: 'Afternoon', name: 'Afternoon (12PM - 4PM)', short: 'Afternoon', hours: '12:00 PM – 4:00 PM', defaultPrice: p.afternoon || 60000 },
      { key: 'Evening', name: 'Evening (4PM - 11PM)', short: 'Evening', hours: '4:00 PM – 11:00 PM', defaultPrice: p.evening || 95000 },
      { key: 'Night', name: 'Night (7PM - 1AM)', short: 'Night', hours: '7:00 PM – 1:00 AM', defaultPrice: p.night || 75000 },
      { key: 'Full Day', name: 'Full Day (24 Hours)', short: 'Full Day', hours: '24 Hours Full Venue', defaultPrice: p.full_day || 210000 }
    ];

    return standardSlots.map(s => {
      const bookingMatch = hallBookings.find(b => b.slot && (b.slot === s.name || b.slot.toLowerCase().startsWith(s.key.toLowerCase())));
      let status = 'available';
      let reason = '';
      if (bookingMatch) {
        status = (bookingMatch.status === 'APPROVED' || bookingMatch.status === 'CONFIRMED') ? 'booked' : 'pending';
      } else if (dateMatrix[s.key] && dateMatrix[s.key].status) {
        status = dateMatrix[s.key].status;
        reason = dateMatrix[s.key].reason || '';
      }

      const price = (dateMatrix[s.key] && dateMatrix[s.key].price) || s.defaultPrice;
      const isPeak = Boolean(dateMatrix[s.key] && dateMatrix[s.key].isPeak);

      return {
        name: s.name,
        key: s.key,
        short: s.short,
        hours: s.hours,
        price,
        status,
        reason,
        isPeak,
        booking: bookingMatch || null
      };
    });
  },

  renderCalendar(hall) {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    if (!this.selectedDate) {
      this.selectedDate = todayStr;
    }

    const year = this.calendarYear;
    const month = this.calendarMonth;
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[month];

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

    // Calculate slots for the currently selected date
    const selectedSlots = this.getDaySlots(hall, this.selectedDate);
    const selectedDateObj = new Date(this.selectedDate + 'T00:00:00');
    const selectedDateFormatted = isNaN(selectedDateObj.getTime()) ? this.selectedDate : selectedDateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
      <div class="space-y-4">
        <!-- Month Navigation Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low p-3.5 rounded-xl border border-outline">
          <div class="flex items-center gap-2">
            <button onclick="DetailsView.changeMonth(-1)" class="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline flex items-center justify-center text-on-surface hover:text-secondary transition-colors" title="Previous Month">
              <span class="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <div class="flex items-center gap-1.5">
              <select onchange="DetailsView.setMonthYear(this.value, ${year})" class="font-headline-sm text-sm font-bold text-on-surface bg-surface-container-lowest border border-outline rounded-lg py-1 px-2 cursor-pointer outline-none shadow-sm">
                ${monthNames.map((m, idx) => `
                  <option value="${idx}" ${idx === month ? 'selected' : ''}>${m}</option>
                `).join('')}
              </select>
              <select onchange="DetailsView.setMonthYear(${month}, this.value)" class="font-headline-sm text-sm font-bold text-secondary bg-surface-container-lowest border border-outline rounded-lg py-1 px-2 cursor-pointer outline-none shadow-sm">
                ${[year - 1, year, year + 1, year + 2].map(y => `
                  <option value="${y}" ${y === year ? 'selected' : ''}>${y}</option>
                `).join('')}
              </select>
            </div>
            <button onclick="DetailsView.changeMonth(1)" class="w-8 h-8 rounded-lg bg-surface-container hover:bg-surface-container-high border border-outline flex items-center justify-center text-on-surface hover:text-secondary transition-colors" title="Next Month">
              <span class="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <!-- Quick Jump Date & Status Legend -->
          <div class="flex items-center gap-3 flex-wrap justify-between sm:justify-end">
            <div class="flex items-center gap-1.5">
              <span class="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider hidden md:inline">Jump to Date:</span>
              <input type="date" value="${this.selectedDate}" onchange="DetailsView.jumpToDate(this.value)" class="text-xs p-1.5 rounded-lg border border-outline bg-surface-container-lowest text-on-surface font-semibold focus:border-secondary outline-none shadow-sm cursor-pointer" title="Pick any date across the whole year">
            </div>
            <div class="flex items-center gap-2 text-[11px]">
              <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-available"></span> Available</span>
              <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-error"></span> Booked</span>
              <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-status-pending"></span> Pending</span>
            </div>
          </div>
        </div>

        <!-- 30-Day Monthly Calendar Grid -->
        <div class="bg-surface-container-lowest p-3 sm:p-4 rounded-xl border border-outline overflow-hidden shadow-sm">
          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-on-surface-variant pb-2 border-b border-outline uppercase tracking-wider">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <!-- Days Cells -->
          <div class="grid grid-cols-7 gap-1 pt-2">
            ${Array.from({ length: firstDayIndex }).map(() => `
              <div class="min-h-[50px] sm:min-h-[60px] p-1 bg-surface-container-low/20 rounded-lg border border-transparent opacity-30"></div>
            `).join('')}

            ${Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = (this.selectedDate === dateStr);
              const isToday = (dateStr === todayStr);

              const slots = this.getDaySlots(hall, dateStr);
              const availCount = slots.filter(s => s.status === 'available').length;
              const bookedCount = slots.filter(s => s.status === 'booked').length;
              const pendingCount = slots.filter(s => s.status === 'pending').length;
              const blockedCount = slots.filter(s => s.status === 'blocked').length;
              const hasPeak = slots.some(s => s.isPeak);

              let statusBadge = '';
              let dotClass = 'bg-status-available';

              if (blockedCount === 5) {
                statusBadge = `<span class="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-slate-200 text-slate-700 border border-slate-300">Blocked</span>`;
                dotClass = 'bg-slate-400';
              } else if (availCount === 5) {
                statusBadge = `<span class="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-status-available-bg text-status-available border border-status-available-border">5 Open</span>`;
                dotClass = 'bg-status-available';
              } else if (availCount === 0) {
                statusBadge = `<span class="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-status-error-bg text-status-error border border-status-error-border">Sold Out</span>`;
                dotClass = 'bg-status-error';
              } else {
                statusBadge = `<span class="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-status-pending-bg text-status-pending border border-status-pending-border">${availCount} Open</span>`;
                dotClass = 'bg-status-pending';
              }

              return `
                <div 
                  onclick="DetailsView.selectDate('${dateStr}')" 
                  class="min-h-[50px] sm:min-h-[60px] p-1.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-secondary-fixed/50 border-secondary ring-2 ring-secondary shadow-md scale-[1.02] z-10' 
                      : 'bg-surface-container-low hover:bg-surface-container border-outline/70 hover:border-outline'
                  }">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold ${isSelected ? 'text-secondary font-black' : (isToday ? 'text-primary underline font-black' : 'text-on-surface')}">
                      ${dayNum}
                    </span>
                    <span class="sm:hidden w-1.5 h-1.5 rounded-full ${dotClass}"></span>
                  </div>
                  <div class="mt-0.5">
                    ${statusBadge}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Selected Date Shift Breakdown Banner -->
        <div class="bg-surface-container-low p-4 sm:p-5 rounded-xl border border-outline space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-outline">
            <div>
              <span class="text-[10px] font-bold text-secondary uppercase tracking-widest">Selected Date Shifts</span>
              <h4 class="font-headline-sm text-sm sm:text-base font-bold text-on-surface font-serif">
                ${selectedDateFormatted}
              </h4>
            </div>
            <span class="text-xs text-on-surface-variant font-medium">Choose a shift to configure reservation hold</span>
          </div>

          <!-- 5 Shift Option Cards for Selected Date -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            ${selectedSlots.map(s => {
              const isSelected = (this.selectedDate && this.selectedSlot === s.name);
              const isAvail = (s.status === 'available');

              return `
                <div 
                  ${isAvail ? `onclick="DetailsView.selectSlot('${this.selectedDate}', '${s.name}', ${s.price})"` : ''}
                  class="p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-secondary text-white border-secondary ring-2 ring-secondary shadow-md scale-[1.02]' 
                      : (isAvail 
                          ? 'bg-surface-container-lowest hover:bg-surface-container border-outline hover:border-secondary cursor-pointer shadow-sm active:scale-[0.98]' 
                          : 'bg-surface-container/60 border-outline/60 opacity-70 cursor-not-allowed')
                  }">
                  
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <span class="font-bold text-xs uppercase tracking-wider ${isSelected ? 'text-white' : 'text-on-surface'}">${s.short}</span>
                      ${s.status === 'available' ? `
                        <span class="w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-status-available'}"></span>
                      ` : (s.status === 'pending' ? `
                        <span class="w-2 h-2 rounded-full bg-status-pending"></span>
                      ` : (s.status === 'blocked' ? `
                        <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                      ` : `
                        <span class="w-2 h-2 rounded-full bg-status-error"></span>
                      `))}
                    </div>
                    <p class="text-[11px] ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}">${s.hours}</p>
                  </div>

                  <div class="pt-2.5 mt-2 border-t ${isSelected ? 'border-white/20' : 'border-outline'} flex items-center justify-between">
                    <div>
                      <div class="text-[10px] ${isSelected ? 'text-white/80' : 'text-on-surface-variant'} uppercase font-bold flex items-center gap-1">
                        <span>Tariff</span>
                        ${s.isPeak ? `<span class="px-1 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-300 text-[8px] font-black border border-amber-500/30">PEAK</span>` : ''}
                      </div>
                      <div class="font-bold text-xs ${isSelected ? 'text-white font-extrabold' : 'text-secondary'}">₹${s.price.toLocaleString('en-IN')}</div>
                    </div>

                    <div>
                      ${isSelected ? `
                        <span class="px-2 py-0.5 rounded-full bg-white text-secondary text-[10px] font-bold flex items-center gap-0.5">
                          <span class="material-symbols-outlined text-[12px]">check</span> Selected
                        </span>
                      ` : (isAvail ? `
                        <span class="px-2 py-0.5 rounded-full bg-status-available-bg text-status-available text-[10px] font-bold border border-status-available-border">
                          Select
                        </span>
                      ` : (s.status === 'pending' ? `
                        <span class="px-2 py-0.5 rounded-full bg-status-pending-bg text-status-pending text-[10px] font-bold border border-status-pending-border">
                          Pending
                        </span>
                      ` : (s.status === 'blocked' ? `
                        <span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold border border-slate-300" title="${s.reason || 'Blocked by venue'}">
                          Blocked
                        </span>
                      ` : `
                        <span class="px-2 py-0.5 rounded-full bg-status-error-bg text-status-error text-[10px] font-bold border border-status-error-border">
                          Booked
                        </span>
                      `)))}
                    </div>
                  </div>

                </div>
              `;
            }).join('')}
          </div>

          <div class="p-2.5 bg-surface-container-lowest rounded-lg text-xs text-on-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-1 border border-outline">
            <span class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-secondary text-[16px]">info</span>
              Direct holds reserve this shift for 48 hours upon host confirmation.
            </span>
            <span class="font-bold text-on-surface">Selected: <span class="text-secondary">${this.selectedDate}</span> (${this.selectedSlot || 'None'})</span>
          </div>
        </div>
      </div>
    `;
  },

  render(hallId) {
    this.currentHallId = hallId || 'hall-grand-monarch';
    const hall = window.appStore.getHallById(this.currentHallId) || window.appStore.getHalls()[0];
    this.currentHallId = hall.id;

    const reviews = window.appStore.getReviewsByHallId(hall.id);
    const isFav = window.appStore.isFavorite(hall.id);
    const fallbackUrl = window.appStore.getPlaceholderImage(hall.name);
    const currentUser = window.Auth && window.Auth.isLoggedIn() ? window.Auth.getCurrentUser() : null;
    const minPrice = hall.pricing ? Math.min(...Object.values(hall.pricing)) : 60000;

    const amenitiesWithIcons = [
      { name: hall.ac_status || 'Central AC', icon: 'mode_fan' },
      { name: `${hall.dining_seats || 400} Seat Dining Pavilion`, icon: 'restaurant' },
      { name: 'Commercial Catering Kitchen', icon: 'kitchen' },
      { name: `${hall.parking_cars || 200}+ Cars & Valet`, icon: 'local_parking' },
      { name: hall.stage_dimensions || 'Elevated Teak Stage', icon: 'theater_comedy' },
      { name: `${hall.green_rooms || 3} Deluxe AC Green Suites`, icon: 'meeting_room' },
      { name: `${hall.generator_kva || '100 kVA'} Generator Backup`, icon: 'bolt' },
      { name: 'Wheelchair Ramp Access', icon: 'accessible' },
      { name: 'CCTV Security & Surveillance', icon: 'security' },
      { name: 'High-Speed Guest Wi-Fi', icon: 'wifi' }
    ];

    return `
      <div class="flex flex-col w-full bg-surface pb-24 lg:pb-12">
        
        <!-- Top Breadcrumb & Quick Actions Bar -->
        <section class="w-full bg-surface-container-lowest border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            <nav class="flex items-center gap-1.5 font-body-sm text-xs text-on-surface-variant flex-wrap" aria-label="Breadcrumb">
              <a class="hover:text-on-surface transition-colors" href="#/">Home</a>
              <span class="text-outline-variant">/</span>
              <a class="hover:text-on-surface transition-colors" href="#/search">Halls in ${hall.city}</a>
              <span class="text-outline-variant">/</span>
              <span class="text-on-surface font-bold truncate max-w-xs">${hall.name}</span>
            </nav>

            <div class="flex items-center gap-2 shrink-0">
              <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-container text-tertiary font-label-md text-xs rounded-full font-bold border border-outline">
                <span class="material-symbols-outlined text-[15px]">verified</span>
                <span>${hall.verification_badge || 'Verified Luxury Hall'}</span>
              </span>

              <button class="inline-flex items-center gap-1 px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-lg transition-all font-semibold" onclick="Modals.openShareModal('${hall.id}')">
                <span class="material-symbols-outlined text-[15px]">share</span>
                <span>Share</span>
              </button>

              <button class="w-8 h-8 flex items-center justify-center bg-surface-container hover:bg-surface-container-high ${isFav ? 'text-secondary' : 'text-on-surface-variant'} rounded-lg transition-all" onclick="window.appStore.toggleFavorite('${hall.id}'); DetailsView.updateFavoriteState();" title="Save to Favorites">
                <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${isFav ? '1' : '0'};">favorite</span>
              </button>

              <button class="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-surface-container rounded-lg transition-colors" onclick="Modals.openReportModal('${hall.id}')" title="Report Incorrect Details">
                <span class="material-symbols-outlined text-[18px]">flag</span>
              </button>
            </div>

          </div>
        </section>

        <!-- Header Title Section -->
        <section class="w-full bg-surface-container-lowest py-4 md:py-6 border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div>
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span class="text-[11px] uppercase tracking-wider px-2.5 py-0.5 bg-surface-container text-on-surface font-bold rounded-md">
                    ${hall.hall_type}
                  </span>
                  <span class="text-xs text-on-surface-variant flex items-center gap-1">
                    <span class="material-symbols-outlined text-[15px] text-secondary" style="font-variation-settings: 'FILL' 1;">star</span>
                    <strong class="text-on-surface">${hall.rating || 5.0}</strong>
                    <span>(${hall.reviews_count || reviews.length} Reviews)</span>
                  </span>
                  <span class="text-xs text-on-surface-variant">•</span>
                  <span class="text-xs text-on-surface-variant">${hall.indoor_outdoor}</span>
                </div>
                <h1 class="font-headline-lg text-2xl md:text-3xl lg:text-4xl text-on-surface tracking-tight font-serif font-bold">
                  ${hall.name}
                </h1>
                <p class="font-body-md text-xs md:text-sm text-on-surface-variant flex items-center gap-1.5 mt-1.5">
                  <span class="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                  <span>${hall.address || hall.area + ', ' + hall.city}</span>
                </p>
              </div>

              <!-- Top Direct Contact Bar -->
              <div class="flex items-center gap-2 shrink-0 flex-wrap">
                <a class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-lg transition-colors font-semibold" href="#venue-map">
                  <span class="material-symbols-outlined text-[16px]">near_me</span>
                  <span>Directions</span>
                </a>
                <a class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs rounded-lg transition-colors font-semibold" href="tel:${hall.contact?.phone || '+918258229988'}">
                  <span class="material-symbols-outlined text-[16px]">call</span>
                  <span>Call Desk</span>
                </a>
                <a class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-white hover:bg-inverse-surface font-label-md text-xs rounded-lg transition-colors font-bold" href="https://wa.me/${hall.contact?.whatsapp?.replace(/[^0-9]/g, '') || '918258229988'}" target="_blank">
                  <span class="material-symbols-outlined text-[16px]">chat</span>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <!-- Polished Photo Showcase Gallery -->
        <section class="w-full bg-surface-container-lowest py-4 md:py-6 border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop">
            <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 h-auto md:h-[440px]">
              
              <!-- Large Primary Image Showcase -->
              <div class="md:col-span-2 lg:col-span-4 relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container min-h-[260px] md:min-h-0" onclick="Modals.openLightbox('${hall.cover_image}', '${hall.name} - Main Ballroom')">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.cover_image}" alt="${hall.name} Main Ballroom" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div class="text-white">
                    <span class="font-label-sm text-[10px] uppercase tracking-wider px-2 py-0.5 bg-black/60 backdrop-blur rounded font-semibold">Grand Ballroom</span>
                    <p class="font-title-lg text-base md:text-lg text-white font-bold mt-1">${hall.name}</p>
                  </div>
                  <span class="inline-flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur rounded-lg text-primary font-label-sm text-xs font-bold shadow-sm">
                    <span class="material-symbols-outlined text-[15px]">zoom_in</span>
                    <span>Enlarge</span>
                  </span>
                </div>
              </div>

              <!-- Satellite Thumbnail Grid -->
              <div class="hidden md:grid md:col-span-2 grid-cols-2 gap-3">
                <div class="relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container" onclick="Modals.openLightbox('${hall.images?.dining || hall.cover_image}', 'Dining Hall Pavilion')">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.images?.dining || hall.cover_image}" alt="Dining Hall" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                  <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                    Dining Pavilion
                  </div>
                </div>

                <div class="relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container" onclick="Modals.openLightbox('${hall.images?.courtyard || hall.cover_image}', 'Courtyard Garden Lawn')">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.images?.courtyard || hall.cover_image}" alt="Courtyard" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                  <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                    Courtyard Lawn
                  </div>
                </div>

                <div class="relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container" onclick="Modals.openLightbox('${hall.images?.suite || hall.cover_image}', 'VIP Bridal Suite')">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.images?.suite || hall.cover_image}" alt="VIP Suite" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                  <div class="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded backdrop-blur-sm">
                    VIP Green Suite
                  </div>
                </div>

                <div class="relative rounded-xl overflow-hidden group cursor-pointer bg-surface-container" onclick="Modals.openLightbox('${hall.images?.exterior || hall.cover_image}', 'Campus Facade')">
                  <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${hall.images?.exterior || hall.cover_image}" alt="Exterior Facade" onerror="this.onerror=null;this.src='${fallbackUrl}'" loading="lazy">
                  <div class="absolute inset-0 bg-primary/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-white group-hover:bg-primary/60 transition-colors">
                    <span class="material-symbols-outlined text-[24px]">photo_library</span>
                    <span class="font-title-md text-xs font-bold mt-1">View Full Gallery</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- Specifications Strip -->
        <section class="w-full bg-surface-container border-b border-outline">
          <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-3">
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[18px]">groups</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Guest Capacity</span>
                  <span class="text-xs font-bold text-on-surface">Seats ${hall.seating_capacity} • Max ${hall.maximum_capacity}</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[18px]">straighten</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Hall Dimensions</span>
                  <span class="text-xs font-bold text-on-surface">${hall.size_sqft.toLocaleString()} sq ft • ${hall.length_ft}×${hall.width_ft} ft</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[18px]">mode_fan</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Climate Control</span>
                  <span class="text-xs font-bold text-on-surface">${hall.ac_status}</span>
                </div>
              </div>

              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-secondary shrink-0 shadow-sm">
                  <span class="material-symbols-outlined text-[18px]">local_parking</span>
                </div>
                <div>
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold block">Parking</span>
                  <span class="text-xs font-bold text-on-surface">${hall.parking_cars}+ Cars & Valet</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Main Content (Left: Details, Calendar, Amenities, Reviews; Right: Sticky Booking Card) -->
        <div class="max-w-[1360px] mx-auto px-gutter-mobile md:px-gutter-desktop py-8 md:py-12 w-full">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            <!-- Left 7 Columns -->
            <div class="lg:col-span-7 space-y-6 md:space-y-8">
              
              <!-- 1. Description & Architecture -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-3">
                <div class="flex items-center justify-between pb-2 border-b border-outline">
                  <h2 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif">Hall Overview & Sightlines</h2>
                  <span class="text-[11px] font-bold text-secondary bg-surface-container px-2.5 py-1 rounded-md">
                    Pillarless Sightlines
                  </span>
                </div>
                <p class="font-body-md text-xs md:text-sm text-on-surface-variant leading-relaxed">
                  ${hall.description}
                </p>
                <div class="grid grid-cols-3 gap-3 pt-2">
                  <div class="p-3 bg-surface-container-low rounded-lg text-center border border-outline">
                    <span class="font-title-md text-sm font-bold text-on-surface block">${hall.ceiling_height_ft || 24} ft</span>
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">Ceiling Height</span>
                  </div>
                  <div class="p-3 bg-surface-container-low rounded-lg text-center border border-outline">
                    <span class="font-title-md text-sm font-bold text-on-surface block">Zero</span>
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">Pillars</span>
                  </div>
                  <div class="p-3 bg-surface-container-low rounded-lg text-center border border-outline">
                    <span class="font-title-md text-sm font-bold text-on-surface block">${hall.generator_kva || '100 kVA'}</span>
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider">Power Backup</span>
                  </div>
                </div>
              </div>

              <!-- 2. Clean Amenities Grid -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4">
                <h2 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif pb-2 border-b border-outline">Facilities & Amenities</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  ${amenitiesWithIcons.map(a => `
                    <div class="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold">
                      <span class="material-symbols-outlined text-secondary text-[18px] shrink-0">${a.icon}</span>
                      <span>${a.name}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- 3. ACCESSIBLE AVAILABILITY CALENDAR -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4" id="availability-section">
                
                <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-outline gap-2">
                  <div>
                    <span class="text-[11px] font-bold text-secondary uppercase tracking-widest">Master Ledger</span>
                    <h3 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif">Shift Availability Schedule</h3>
                  </div>

                  ${hall.public_availability ? `
                    <span class="px-3 py-1 rounded-full bg-status-available-bg text-status-available text-xs font-bold flex items-center gap-1.5 border border-status-available-border w-max">
                      <span class="w-2 h-2 rounded-full bg-status-available animate-pulse"></span>
                      <span>Live Public Calendar</span>
                    </span>
                  ` : `
                    <span class="px-3 py-1 rounded-full bg-status-pending-bg text-status-pending text-xs font-bold flex items-center gap-1.5 border border-status-pending-border w-max">
                      <span class="w-2 h-2 rounded-full bg-status-pending"></span>
                      <span>Private Calendar Maintained</span>
                    </span>
                  `}
                </div>

                ${!hall.public_availability ? `
                  <div class="p-6 bg-surface-container-low rounded-xl border border-dashed border-outline text-center space-y-3">
                    <span class="material-symbols-outlined text-[36px] text-secondary">event_busy</span>
                    <h4 class="font-title-md text-sm font-bold text-on-surface">Private Calendar Mode</h4>
                    <p class="text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
                      The proprietor of ${hall.name} keeps exact slot dates private. Please submit an inquiry or call the venue directly to confirm shift availability.
                    </p>
                    <button class="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-inverse-surface transition-all" onclick="DetailsView.focusEnquiry()">
                      Contact Hall Owner for Availability
                    </button>
                  </div>
                ` : `
                  <!-- Full-Year Interactive Calendar & Shift Availability -->
                  <div class="space-y-3">
                    <div id="calendar-grid-container">
                      ${this.renderCalendar(hall)}
                    </div>

                    <div class="p-2.5 bg-surface-container-low rounded-lg text-xs text-on-surface-variant flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-outline">
                      <span class="flex items-center gap-1.5">
                        <span class="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                        Standard Shifts: Morning (7 AM – 2 PM) | Afternoon (12 PM – 4 PM) | Evening (4 PM – 11 PM) | Night (7 PM – 1 AM) | Full Day (24 hrs)
                      </span>
                      <span class="font-bold text-on-surface flex items-center gap-1">
                        <span class="material-symbols-outlined text-[15px] text-status-available">check_circle</span>
                        Click any open shift to hold
                      </span>
                    </div>
                  </div>
                `}
              </div>

              <!-- 4. Location Map -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-3" id="venue-map">
                <div class="flex items-center justify-between pb-2 border-b border-outline">
                  <div>
                    <h3 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif">Location & Access</h3>
                    <p class="text-xs text-on-surface-variant">${hall.address || hall.area + ', ' + hall.city}</p>
                  </div>
                  <a class="px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-bold flex items-center gap-1" href="https://maps.google.com/?q=${hall.latitude},${hall.longitude}" target="_blank">
                    <span class="material-symbols-outlined text-[15px]">navigation</span>
                    <span>Get Directions</span>
                  </a>
                </div>
                <div id="hall-leaflet-map" class="w-full h-64 rounded-xl border border-outline overflow-hidden"></div>
              </div>

              <!-- 5. Reviews -->
              <div class="bg-surface-container-lowest p-5 md:p-6 rounded-xl border border-outline shadow-sm space-y-4">
                <div class="flex items-center justify-between pb-2 border-b border-outline">
                  <div>
                    <h3 class="font-headline-sm text-lg md:text-xl font-bold text-on-surface font-serif">Guest Reviews & Ratings</h3>
                    <p class="text-xs text-on-surface-variant">Feedback from verified celebration hosts</p>
                  </div>
                  <button class="px-3.5 py-1.5 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-inverse-surface" onclick="Modals.openReviewModal('${hall.id}')">
                    Write Review
                  </button>
                </div>

                <div class="space-y-3">
                  ${reviews.length ? reviews.map(r => `
                    <div class="p-3.5 bg-surface-container-low rounded-lg border border-outline space-y-1.5">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                          <span class="font-bold text-xs text-on-surface">${r.customer_name}</span>
                          <span class="text-[10px] px-1.5 py-0.5 rounded bg-status-available-bg text-status-available font-bold flex items-center gap-0.5">
                            <span class="material-symbols-outlined text-[12px]">verified</span> Verified Event
                          </span>
                        </div>
                        <div class="text-secondary text-xs">★★★★★</div>
                      </div>
                      <p class="text-xs text-on-surface-variant leading-relaxed">${r.text}</p>
                      <div class="text-[10px] text-on-surface-variant/70">${r.date}</div>
                    </div>
                  `).join('') : `
                    <p class="text-xs text-on-surface-variant text-center py-4">No reviews yet. Be the first to write a review!</p>
                  `}
                </div>
              </div>

            </div>

            <!-- Right 5 Columns: Desktop Sticky Booking & Enquiry Card -->
            <div class="lg:col-span-5" id="booking-panel">
              <div class="sticky top-28 bg-surface-container-lowest rounded-xl border border-outline shadow-md overflow-hidden p-5 md:p-6 space-y-4">
                
                <!-- Segmented Tabs: Direct Slot Hold vs Custom Enquiry -->
                <div class="flex items-center p-1 bg-surface-container rounded-lg border border-outline">
                  <button class="flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${this.activeBookingTab === 'direct' ? 'bg-white text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'}" onclick="DetailsView.setBookingTab('direct')">
                    Direct Slot Hold
                  </button>
                  <button class="flex-1 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${this.activeBookingTab === 'enquiry' ? 'bg-white text-on-surface shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'}" onclick="DetailsView.setBookingTab('enquiry')">
                    Custom Enquiry
                  </button>
                </div>

                ${this.activeBookingTab === 'direct' ? `
                  <!-- Direct Hold Form -->
                  <form onsubmit="event.preventDefault(); DetailsView.submitDirectBooking();" class="space-y-3 text-left">
                    
                    <!-- Review Notification Banner (Shown after sign-in / sign-up) -->
                    <div id="auth-review-banner" class="hidden p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                      <span class="material-symbols-outlined text-emerald-600 text-[20px] shrink-0 mt-0.5">check_circle</span>
                      <div>
                        <p class="font-bold text-emerald-950">Signed in as <span id="auth-banner-name">Customer</span>!</p>
                        <p class="text-[11px] text-emerald-800 mt-0.5">Your account details have been filled below. Please review your slot and contact info, then click <strong>Request Direct Slot Hold</strong> to finalize.</p>
                      </div>
                    </div>

                    <div>
                      <span class="text-[11px] text-on-surface-variant uppercase font-bold tracking-wider block">Selected Slot:</span>
                      <div class="p-3 bg-surface-container-low rounded-lg border border-outline flex items-center justify-between mt-1">
                        <div>
                          <div class="font-bold text-xs text-on-surface" id="selected-slot-display">
                            ${this.selectedDate && this.selectedSlot ? `<span class="text-secondary font-bold">${this.selectedDate}</span> • <span class="font-bold text-on-surface">${this.selectedSlot}</span>` : `<span class="text-amber-700 font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[15px]">touch_app</span> Click an available shift from calendar</span>`}
                          </div>
                          <div class="text-[11px] text-secondary font-bold" id="selected-price-display">
                            ${this.selectedPrice ? `₹${this.selectedPrice.toLocaleString()} Shift Tariff` : `Starting from ₹${minPrice.toLocaleString()} / shift`}
                          </div>
                        </div>
                        <a href="#availability-section" class="text-xs text-secondary font-bold hover:underline">Change</a>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Occasion *</label>
                        <select id="dt-occasion" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" required>
                          <option value="" disabled selected>Select Occasion</option>
                          <option value="Wedding & Reception">Wedding &amp; Reception</option>
                          <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                          <option value="Corporate Summit">Corporate Summit</option>
                          <option value="Cultural Gathering">Cultural Gathering</option>
                          <option value="Cocktail & Sangeet">Cocktail &amp; Sangeet</option>
                          <option value="Other">Other Event</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Guests *</label>
                        <input type="number" id="dt-guests" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-bold focus:outline-none focus:border-secondary" value="" placeholder="e.g. 350" min="10" max="${hall.maximum_capacity || 3000}" required>
                      </div>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="block text-[11px] font-bold uppercase text-on-surface">Your Name *</label>
                          ${currentUser ? `<span class="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">✓ Signed In</span>` : ''}
                        </div>
                        <input type="text" id="dt-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="${currentUser ? currentUser.name : ''}" placeholder="Full Name" required>
                      </div>
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="block text-[11px] font-bold uppercase text-on-surface">Phone *</label>
                          ${currentUser ? `<span class="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">✓ Verified</span>` : ''}
                        </div>
                        <input type="tel" id="dt-phone" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="${currentUser ? currentUser.phone : ''}" placeholder="+91 98000 00000" required>
                      </div>
                    </div>

                    <div>
                      <div class="flex items-center justify-between mb-1">
                        <label class="block text-[11px] font-bold uppercase text-on-surface">Email Address *</label>
                        ${currentUser ? `<span class="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">✓ Verified</span>` : ''}
                      </div>
                      <input type="email" id="dt-email" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="${currentUser ? currentUser.email : ''}" placeholder="you@example.com" required>
                    </div>

                    <div>
                      <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Special Requirements (Optional)</label>
                      <textarea id="dt-notes" rows="2" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface focus:outline-none focus:border-secondary" placeholder="e.g. Stage decor setup time, mandap timings, catering notes..."></textarea>
                    </div>

                    <button type="submit" id="btn-submit-hold" class="w-full py-3 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-inverse-surface transition-all flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[17px]">lock</span>
                      <span>Request Direct Slot Hold</span>
                    </button>

                    <p class="text-[11px] text-on-surface-variant text-center leading-tight">
                      ✓ Instant 48-Hour hold sent to ${hall.contact?.owner_name || 'Hall Owner'}. No cancellation penalty.
                    </p>
                  </form>
                ` : `
                  <!-- Custom Enquiry Form -->
                  <form onsubmit="event.preventDefault(); DetailsView.submitEnquiry();" class="space-y-3 text-left">
                    <p class="text-xs text-on-surface-variant leading-relaxed">
                      Schedule an in-person property tour, arrange food tastings, or request custom multi-day wedding packages.
                    </p>

                    <div>
                      <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Target Event Window *</label>
                      <input type="text" id="enq-dates" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="" placeholder="e.g. November 2025 (Flexible) or Dec 15-18" required>
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Your Name *</label>
                        <input type="text" id="enq-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="${currentUser ? currentUser.name : ''}" placeholder="Full Name" required>
                      </div>
                      <div>
                        <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">WhatsApp / Phone *</label>
                        <input type="tel" id="enq-phone" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface font-semibold focus:outline-none focus:border-secondary" value="${currentUser ? currentUser.phone : ''}" placeholder="+91 98000 00000" required>
                      </div>
                    </div>

                    <div>
                      <label class="block text-[11px] font-bold uppercase text-on-surface mb-1">Walkthrough / Question Details *</label>
                      <textarea id="enq-notes" rows="3" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-xs text-on-surface focus:outline-none focus:border-secondary" placeholder="e.g. Would like to schedule an in-person walkthrough this Sunday at 11 AM..." required></textarea>
                    </div>

                    <button type="submit" class="w-full py-3 bg-secondary text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-secondary-container transition-all flex items-center justify-center gap-2">
                      <span class="material-symbols-outlined text-[17px]">send</span>
                      <span>Send Custom Enquiry</span>
                    </button>
                  </form>
                `}

                <!-- Host Contact Pill -->
                <div class="p-3 bg-surface-container-low rounded-lg border border-outline flex items-center justify-between text-xs">
                  <div>
                    <span class="text-[10px] text-on-surface-variant uppercase font-bold block">Venue Desk</span>
                    <span class="font-bold text-on-surface">${hall.contact?.owner_name || 'Vikram Hegde'}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <a href="tel:${hall.contact?.phone || '+918258229988'}" class="p-2 rounded-md bg-white hover:bg-surface-container text-on-surface border border-outline transition-colors" title="Call">
                      <span class="material-symbols-outlined text-[16px]">call</span>
                    </a>
                    <a href="https://wa.me/${hall.contact?.whatsapp?.replace(/[^0-9]/g, '') || '918258229988'}" target="_blank" class="p-2 rounded-md bg-primary text-white hover:bg-inverse-surface transition-colors" title="WhatsApp">
                      <span class="material-symbols-outlined text-[16px]">chat</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        <!-- Sticky Bottom Action Bar for Mobile (Requirement: Accessible Booking on Mobile) -->
        <div class="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline px-4 py-2.5 flex items-center justify-between shadow-lg">
          <div>
            <div class="text-[10px] text-on-surface-variant font-medium">Starting shift price</div>
            <div class="font-bold text-sm text-on-surface">
              ₹${(this.selectedPrice || 75000).toLocaleString()}
              <span class="text-[10px] font-normal text-on-surface-variant">/shift</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <a href="https://wa.me/${hall.contact?.whatsapp?.replace(/[^0-9]/g, '') || '918258229988'}" target="_blank" class="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container border border-outline text-on-surface" title="WhatsApp">
              <span class="material-symbols-outlined text-[18px]">chat</span>
            </a>
            <a href="#booking-panel" class="px-4 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm" onclick="document.getElementById('booking-panel').scrollIntoView({behavior: 'smooth'})">
              Request Hold
            </a>
          </div>
        </div>

      </div>
    `;
  },

  postRender() {
    this.initMap();
  },

  initMap() {
    const mapEl = document.getElementById('hall-leaflet-map');
    if (!mapEl || typeof L === 'undefined') return;

    const hall = window.appStore.getHallById(this.currentHallId);
    if (!hall || !hall.latitude || !hall.longitude) return;

    const map = L.map('hall-leaflet-map', {
      scrollWheelZoom: false
    }).setView([hall.latitude, hall.longitude], 14);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap & CARTO',
      maxZoom: 18
    }).addTo(map);

    const customIcon = L.divIcon({
      className: 'custom-pin-wrapper',
      html: `
        <div class="custom-map-pin active">
          <span class="material-symbols-outlined pin-icon">castle</span>
          <span>${hall.name.split(' ')[0]}</span>
        </div>
      `,
      iconSize: [64, 26],
      iconAnchor: [32, 13]
    });

    L.marker([hall.latitude, hall.longitude], { icon: customIcon }).addTo(map)
      .bindPopup(`<strong>${hall.name}</strong><br>${hall.address || hall.city}`)
      .openPopup();
  },

  selectSlot(date, slot, price) {
    this.selectedDate = date;
    this.selectedSlot = slot;
    this.selectedPrice = price;

    // Immediately re-render calendar container so the visual highlight moves to the chosen date and slot!
    const hall = window.appStore.getHallById(this.currentHallId);
    const calContainer = document.getElementById('calendar-grid-container');
    if (calContainer && hall) {
      calContainer.innerHTML = this.renderCalendar(hall);
    }

    const slotDisp = document.getElementById('selected-slot-display');
    const priceDisp = document.getElementById('selected-price-display');
    if (slotDisp) slotDisp.innerHTML = `<span class="text-secondary font-bold">${date}</span> • <span class="font-bold text-on-surface">${slot}</span>`;
    if (priceDisp) priceDisp.innerText = `₹${price.toLocaleString('en-IN')} Shift Tariff`;

    Toast.info('Slot Selected', `Configured reservation for ${date} (${slot}).`);
  },

  setBookingTab(tab) {
    this.activeBookingTab = tab;
    const container = document.getElementById('app-content');
    if (container) {
      container.innerHTML = this.render(this.currentHallId);
      this.postRender();
    }
  },

  focusEnquiry() {
    this.setBookingTab('enquiry');
    const bp = document.getElementById('booking-panel');
    if (bp) bp.scrollIntoView({ behavior: 'smooth' });
  },

  submitDirectBooking() {
    const hall = window.appStore.getHallById(this.currentHallId);
    if (!hall) return;

    if (!this.selectedDate || !this.selectedSlot) {
      Toast.error('Please Select a Slot', 'Click an available shift from the Live Availability calendar above.');
      const availSec = document.getElementById('availability-section');
      if (availSec) availSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const occasion = document.getElementById('dt-occasion')?.value;
    if (!occasion) {
      Toast.error('Occasion Required', 'Please select an occasion for your event.');
      document.getElementById('dt-occasion')?.focus();
      return;
    }

    const guestsInput = document.getElementById('dt-guests');
    const guests = Number(guestsInput?.value);
    if (!guests || guests <= 0) {
      Toast.error('Guest Count Required', 'Please enter your estimated guest count.');
      guestsInput?.focus();
      return;
    }

    const notes = document.getElementById('dt-notes')?.value || '';
    let name = document.getElementById('dt-name')?.value?.trim() || '';
    let phone = document.getElementById('dt-phone')?.value?.trim() || '';
    let email = document.getElementById('dt-email')?.value?.trim() || '';

    // If customer is not logged in: intercept with Auth modal
    if (!window.Auth || !window.Auth.isLoggedIn()) {
      // Open Auth modal (default to Sign In tab with 1-click switch to Sign Up)
      Modals.openAuthModal((user) => {
        // Auto sign-in has completed!
        // Requirement: "Show the pre-filled booking form for review one last time before submitting after sign-up"
        const nameInput = document.getElementById('dt-name');
        const phoneInput = document.getElementById('dt-phone');
        const emailInput = document.getElementById('dt-email');
        const banner = document.getElementById('auth-review-banner');
        const bannerName = document.getElementById('auth-banner-name');

        if (nameInput) nameInput.value = user.name || name;
        if (phoneInput) phoneInput.value = user.phone || phone;
        if (emailInput) emailInput.value = user.email || email;

        if (banner) {
          if (bannerName) bannerName.textContent = user.name || 'Customer';
          banner.classList.remove('hidden');
        }

        const panel = document.getElementById('booking-panel');
        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const btn = document.getElementById('btn-submit-hold');
        if (btn) {
          btn.classList.add('ring-4', 'ring-secondary/40', 'animate-pulse');
          setTimeout(() => btn.classList.remove('ring-4', 'ring-secondary/40', 'animate-pulse'), 4000);
        }

        Toast.info('Signed In!', `Welcome, ${user.name}! Please review your details and click "Request Direct Slot Hold" below to confirm.`);
      }, 'login', {
        title: 'Sign In to Reserve',
        subtitle: `Sign in or create an account to finalize your hold for ${hall.name}`
      });
      return;
    }

    // Customer IS authenticated
    const currentUser = window.Auth.getCurrentUser();
    name = currentUser.name || name;
    phone = currentUser.phone || phone;
    email = currentUser.email || email;

    if (!name || !phone || !email) {
      Toast.error('Missing details', 'Please ensure name, phone, and email are filled.');
      return;
    }

    const newBooking = window.appStore.createBooking({
      hall_id: hall.id,
      hall_name: hall.name,
      customer_id: currentUser.id,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      event_type: occasion,
      date: this.selectedDate,
      slot: this.selectedSlot,
      guests,
      notes,
      amount: this.selectedPrice
    });

    // Immediately refresh calendar so pending slot turns yellow
    this.refreshCalendar();

    // Directly open booking confirmation modal with owner contact details!
    Modals.openBookingSuccessModal(newBooking, hall);
  },

  submitEnquiry() {
    const hall = window.appStore.getHallById(this.currentHallId);
    if (!hall) return;
    const name = document.getElementById('enq-name')?.value || '';
    const phone = document.getElementById('enq-phone')?.value || '';
    const dates = document.getElementById('enq-dates')?.value || '';
    const notes = document.getElementById('enq-notes')?.value || '';

    if (!name || !phone) {
      Toast.error('Missing details', 'Please enter your name and phone number.');
      return;
    }

    const enquiryId = 'ENQ-' + Date.now();
    const enquiryData = {
      id: enquiryId,
      hall_id: hall.id,
      hall_name: hall.name,
      customer_name: name,
      customer_phone: phone,
      dates,
      notes,
      created_at: new Date().toISOString()
    };

    if (window.fbDb) {
      window.fbDb.collection('enquiries').doc(enquiryId).set(enquiryData).catch(err => {
        console.warn('[Firestore] Notice saving enquiry:', err.message);
      });
    }

    window.appStore.addNotification(
      'New Custom Enquiry',
      `Walkthrough / Enquiry request from ${name} (${phone}) for "${hall.name}".`,
      '#/owner'
    );

    Toast.success('Enquiry Sent', `Your enquiry has been transmitted to ${hall.contact?.owner_name || 'the hall owner'}.`);
    window.location.hash = '#/customer';
  },

  updateFavoriteState() {
    const container = document.getElementById('app-content');
    if (container) {
      container.innerHTML = this.render(this.currentHallId);
      this.postRender();
    }
  }
};

window.DetailsView = DetailsView;

// Keep details page booking form in sync with user auth state without wiping user's date/slot selection
window.addEventListener('authChanged', (e) => {
  const user = e.detail?.user;
  const nameInput = document.getElementById('dt-name');
  const phoneInput = document.getElementById('dt-phone');
  const emailInput = document.getElementById('dt-email');
  const enqName = document.getElementById('enq-name');
  const enqPhone = document.getElementById('enq-phone');

  if (nameInput && user && !nameInput.value) nameInput.value = user.name || '';
  if (phoneInput && user && !phoneInput.value) phoneInput.value = user.phone || '';
  if (emailInput && user && !emailInput.value) emailInput.value = user.email || '';
  if (enqName && user && !enqName.value) enqName.value = user.name || '';
  if (enqPhone && user && !enqPhone.value) enqPhone.value = user.phone || '';
});
