// VenueLuxe Interactive Modal System
// Includes: Role Switcher, 9-Step Add Hall Wizard, Booking Modal, Review Modal, Share Modal, Lightbox, Report Modal

const Modals = {
  currentWizardStep: 1,
  wizardData: {},

  init() {
    let container = document.getElementById('modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-container';
      document.body.appendChild(container);
    }
  },

  close() {
    const container = document.getElementById('modal-container');
    if (container) container.innerHTML = '';
  },

  // --- 1. Role Selection Modal (Requirement #2) ---
  openRoleSelectorModal() {
    this.init();
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-xl w-full rounded-2xl shadow-2xl p-6 md:p-8 modal-content border border-surface-container">
          <div class="flex items-center justify-between pb-4 border-b border-surface-container">
            <div>
              <span class="font-label-sm text-xs font-bold text-secondary uppercase tracking-widest">Platform Access</span>
              <h2 class="font-headline-sm text-2xl font-semibold text-on-surface mt-1">Select Your Experience</h2>
            </div>
            <button onclick="Modals.close()" class="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
          
          <p class="font-body-md text-sm text-on-surface-variant my-4">
            VenueLuxe supports tailored workflows for both prospective event hosts, venue owners, and platform administrators.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <!-- Option 1: Customer -->
            <div class="border-2 border-surface-container hover:border-primary p-5 rounded-xl cursor-pointer transition-all hover:shadow-md bg-surface-container-low/40 group flex flex-col justify-between" onclick="HeaderComponent.switchRole('customer'); Modals.close();">
              <div>
                <div class="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined text-[26px]">festival</span>
                </div>
                <h3 class="font-title-md text-base font-bold text-on-surface">I'm Looking for a Hall</h3>
                <p class="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Discover wedding halls, banquet spaces, and convention centers with verified pricing, real-time availability, and instant holds.
                </p>
              </div>
              <span class="inline-flex items-center gap-1 font-label-sm text-xs font-bold text-secondary mt-4 group-hover:underline">
                Continue as Customer <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>

            <!-- Option 2: Hall Owner -->
            <div class="border-2 border-surface-container hover:border-secondary p-5 rounded-xl cursor-pointer transition-all hover:shadow-md bg-surface-container-low/40 group flex flex-col justify-between" onclick="HeaderComponent.switchRole('owner'); Modals.close();">
              <div>
                <div class="w-12 h-12 rounded-xl bg-secondary text-on-secondary flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
                  <span class="material-symbols-outlined text-[26px]">domain</span>
                </div>
                <h3 class="font-title-md text-base font-bold text-on-surface">I'm a Hall Owner</h3>
                <p class="font-body-sm text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  List your banquet hall, manage morning/evening shift allotments, review direct booking requests, and audit revenue.
                </p>
              </div>
              <span class="inline-flex items-center gap-1 font-label-sm text-xs font-bold text-secondary mt-4 group-hover:underline">
                Enter Owner Workspace <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
          </div>

          <!-- Quick Super Admin Jump -->
          <div class="pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
            <span>Website Administrator?</span>
            <button class="font-bold text-on-surface hover:text-secondary flex items-center gap-1" onclick="HeaderComponent.switchRole('admin'); Modals.close();">
              Super Admin Control Tower <span class="material-symbols-outlined text-[14px]">shield</span>
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // --- 2. Nine-Step Add Hall Wizard (Requirement #12 & #13) ---
  openAddHallWizard() {
    this.currentWizardStep = 1;
    this.wizardData = {
      name: '',
      hall_type: 'Wedding Palace & Convention',
      description: '',
      area: '',
      city: 'Karkala',
      state: 'Karnataka',
      pincode: '574104',
      address: '',
      size_sqft: 12000,
      length_ft: 130,
      width_ft: 90,
      seating_capacity: 600,
      maximum_capacity: 1200,
      ac_status: 'Central AC (VRF)',
      indoor_outdoor: 'Indoor Auditorium',
      facilities: ['Central AC (VRF)', 'Separate AC Dining Hall', 'Industrial Kitchen', 'Car Parking', 'Stage & Sound System', 'Generator Backup', 'Wi-Fi'],
      pricing: { morning: 65000, afternoon: 45000, evening: 85000, night: 70000, full_day: 180000 },
      cover_image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      latitude: 13.2185,
      longitude: 74.9983,
      contact: {
        owner_name: 'Vikram Hegde',
        phone: '+91 82582 29988',
        whatsapp: '+91 82582 29988',
        email: 'vikram.hegde@monarchpalace.com',
        alternate_phone: '+91 82582 29989'
      },
      public_availability: true,
      privacy_settings: {
        show_availability: true,
        show_phone: true,
        show_whatsapp: true,
        show_email: true
      }
    };
    this.renderWizard();
  },

  renderWizard() {
    this.init();
    const container = document.getElementById('modal-container');
    const step = this.currentWizardStep;

    const stepTitles = [
      'Basic Information',
      'Hall Specifications',
      'Facilities & Amenities',
      'Slot Pricing',
      'Photos & Media Vault',
      'Location & Map Coordinates',
      'Contact Information',
      'Availability & Privacy Toggles',
      'Review & Submit for Verification'
    ];

    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-3xl w-full rounded-2xl shadow-2xl overflow-hidden modal-content border border-surface-container flex flex-col max-h-[90vh]">
          
          <!-- Stepper Header -->
          <div class="p-6 bg-surface-container-low border-b border-surface-container shrink-0">
            <div class="flex items-center justify-between mb-3">
              <div>
                <span class="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-widest">Venue Onboarding Engine</span>
                <h2 class="font-headline-sm text-xl font-bold text-on-surface">Step ${step} of 9: ${stepTitles[step - 1]}</h2>
              </div>
              <button onclick="Modals.close()" class="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div class="bg-secondary h-full transition-all duration-300" style="width: ${(step / 9) * 100}%"></div>
            </div>
          </div>

          <!-- Step Content Body -->
          <div class="p-6 md:p-8 overflow-y-auto flex-1 space-y-4 text-left font-body-md" id="wizard-step-body">
            ${this.getWizardStepHTML(step)}
          </div>

          <!-- Wizard Footer Navigation -->
          <div class="p-4 px-6 bg-surface-container-low border-t border-surface-container flex items-center justify-between shrink-0">
            <button class="px-4 py-2 text-xs font-bold rounded-lg border border-surface-container text-on-surface hover:bg-surface-container transition-colors ${step === 1 ? 'opacity-30 pointer-events-none' : ''}" onclick="Modals.prevWizardStep()">
              ← Back
            </button>

            <div class="flex items-center gap-2">
              <span class="text-xs text-on-surface-variant hidden sm:inline">Requires Super Admin approval before going live</span>
              ${step < 9 ? `
                <button class="px-6 py-2 text-xs font-bold rounded-lg bg-primary text-on-primary hover:bg-inverse-surface shadow-sm transition-all flex items-center gap-1" onclick="Modals.nextWizardStep()">
                  Next Step →
                </button>
              ` : `
                <button class="px-6 py-2.5 text-xs font-bold rounded-lg bg-secondary text-on-secondary hover:bg-on-secondary-container shadow-md transition-all flex items-center gap-1 uppercase tracking-wider" onclick="Modals.submitHallForVerification()">
                  <span class="material-symbols-outlined text-[16px]">verified</span> Submit for Verification
                </button>
              `}
            </div>
          </div>

        </div>
      </div>
    `;
  },

  getWizardStepHTML(step) {
    const d = this.wizardData;
    switch (step) {
      case 1:
        return `
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Hall / Venue Name *</label>
              <input type="text" id="wz-name" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary" value="${d.name || 'Gilded Magnolia Grand Hall'}" placeholder="e.g. Royal Emerald Ballroom">
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Hall Type</label>
                <select id="wz-hall-type" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm">
                  <option ${d.hall_type === 'Wedding Palace & Convention' ? 'selected' : ''}>Wedding Palace & Convention</option>
                  <option ${d.hall_type === 'Reception Banquet Hall' ? 'selected' : ''}>Reception Banquet Hall</option>
                  <option ${d.hall_type === 'Party & Birthday Venue' ? 'selected' : ''}>Party & Birthday Venue</option>
                  <option ${d.hall_type === 'Open-Air Lawn & Poolside' ? 'selected' : ''}>Open-Air Lawn & Poolside</option>
                  <option ${d.hall_type === 'Community & Cultural Hall' ? 'selected' : ''}>Community & Cultural Hall</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">City / Town</label>
                <input type="text" id="wz-city" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.city || 'Karkala'}">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Neighborhood / Area</label>
              <input type="text" id="wz-area" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.area || 'Highway Junction, Bypass Road'}" placeholder="e.g. Near Venkataramana Temple">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Full Postal Address</label>
              <textarea id="wz-address" rows="2" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm">${d.address || 'Opposite Royal Orchid Estate, Bypass Highway, Karkala 574104'}</textarea>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Description & Architecture</label>
              <textarea id="wz-desc" rows="3" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" placeholder="Detail high ceilings, pillarless sightlines, and decor features...">${d.description || 'Stunning architectural hall featuring high 22-foot clearance, Italian marble flooring, and dedicated dining pavilion.'}</textarea>
            </div>
          </div>
        `;

      case 2:
        return `
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Total Area (sq ft)</label>
                <input type="number" id="wz-size" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm font-semibold" value="${d.size_sqft}">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Length (ft)</label>
                <input type="number" id="wz-length" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.length_ft}">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Width (ft)</label>
                <input type="number" id="wz-width" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.width_ft}">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Seating Capacity (Guests)</label>
                <input type="number" id="wz-seat" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm font-bold text-secondary" value="${d.seating_capacity}">
                <span class="text-[11px] text-on-surface-variant">e.g. Formal theater/sofa seating</span>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Maximum Floating Capacity</label>
                <input type="number" id="wz-max" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm font-bold text-secondary" value="${d.maximum_capacity}">
                <span class="text-[11px] text-on-surface-variant">Total maximum guest turnaround</span>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Air Conditioning</label>
                <select id="wz-ac" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm">
                  <option>Central AC (VRF)</option>
                  <option>Split AC Units</option>
                  <option>Non-AC (Airy Cross Ventilation)</option>
                  <option>Hall AC + Open Lawn</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Indoor / Outdoor Format</label>
                <select id="wz-indoor-outdoor" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm">
                  <option>Indoor Auditorium</option>
                  <option>Both Indoor & Outdoor Lawn</option>
                  <option>Open-Air Garden Lawn</option>
                  <option>Covered Pavilion</option>
                </select>
              </div>
            </div>
          </div>
        `;

      case 3:
        const commonFacilities = [
          'Central AC', 'Separate Dining Hall', 'Industrial Stainless Kitchen', 'Car Parking & Valet',
          'Elevated Hardwood Stage', 'Line-Array Audio & 4K LED Screen', 'Green Suites / Bridal Rooms',
          'Dual Elevators', '100% Silent DG Backup', 'Wheelchair Ramp Access', '24/7 CCTV & Security',
          'Dedicated Pooja / Mandap Area', 'High-Speed Wi-Fi', 'Decoration & Florist Desk'
        ];
        return `
          <div class="space-y-4">
            <p class="text-xs text-on-surface-variant">Select all infrastructure and technical amenities available at this venue:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto p-1">
              ${commonFacilities.map(f => `
                <label class="flex items-center gap-2 p-2.5 rounded-lg border border-surface-container bg-surface-container-low/50 hover:bg-surface-container cursor-pointer text-xs font-medium text-on-surface">
                  <input type="checkbox" class="wz-facility accent-primary rounded" value="${f}" ${d.facilities.includes(f) ? 'checked' : ''}>
                  ${f}
                </label>
              `).join('')}
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Add Custom Facility</label>
              <input type="text" id="wz-custom-facility" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" placeholder="e.g. VIP Helipad Access">
            </div>
          </div>
        `;

      case 4:
        return `
          <div class="space-y-4">
            <p class="text-xs text-on-surface-variant">Specify pricing tariffs for each standard event shift. Pricing is optional and can be updated anytime.</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-3 bg-surface-container-low rounded-lg border border-surface-container">
                <span class="text-xs font-bold text-on-surface uppercase">Morning Shift (7 AM – 2 PM)</span>
                <input type="number" id="wz-price-morn" class="w-full mt-2 p-2 rounded bg-surface-container-lowest border border-surface-container text-sm font-bold text-on-surface" value="${d.pricing.morning}">
              </div>
              <div class="p-3 bg-surface-container-low rounded-lg border border-surface-container">
                <span class="text-xs font-bold text-on-surface uppercase">Afternoon Shift (12 PM – 4 PM)</span>
                <input type="number" id="wz-price-aft" class="w-full mt-2 p-2 rounded bg-surface-container-lowest border border-surface-container text-sm font-bold text-on-surface" value="${d.pricing.afternoon}">
              </div>
              <div class="p-3 bg-surface-container-low rounded-lg border border-surface-container">
                <span class="text-xs font-bold text-on-surface uppercase">Evening Shift (4 PM – 11 PM)</span>
                <input type="number" id="wz-price-eve" class="w-full mt-2 p-2 rounded bg-surface-container-lowest border border-surface-container text-sm font-bold text-on-surface" value="${d.pricing.evening}">
              </div>
              <div class="p-3 bg-surface-container-low rounded-lg border border-surface-container">
                <span class="text-xs font-bold text-on-surface uppercase">Night Shift (7 PM – 1 AM)</span>
                <input type="number" id="wz-price-night" class="w-full mt-2 p-2 rounded bg-surface-container-lowest border border-surface-container text-sm font-bold text-on-surface" value="${d.pricing.night}">
              </div>
            </div>
            <div class="p-3 bg-surface-container-low rounded-lg border border-surface-container">
              <span class="text-xs font-bold text-secondary uppercase">Full Day Tariff (24 Hours Exclusive Lease)</span>
              <input type="number" id="wz-price-full" class="w-full mt-2 p-2 rounded bg-surface-container-lowest border border-secondary/30 text-sm font-bold text-secondary" value="${d.pricing.full_day}">
            </div>
          </div>
        `;

      case 5:
        return `
          <div class="space-y-4">
            <p class="text-xs text-on-surface-variant">Provide high-resolution imagery for your hall. Cover image will be prominently featured on search cards.</p>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Main Cover Photo URL *</label>
              <input type="text" id="wz-cover-img" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" value="${d.cover_image}">
            </div>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="aspect-video bg-surface-container rounded-lg overflow-hidden relative border border-surface-container">
                <img src="${d.cover_image}" class="w-full h-full object-cover">
                <span class="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded">Cover</span>
              </div>
              <div class="aspect-video bg-surface-container rounded-lg flex flex-col items-center justify-center p-2 text-center text-xs text-on-surface-variant border border-dashed border-outline-variant">
                <span class="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                <span class="text-[10px] mt-1">Interior Ballroom</span>
              </div>
              <div class="aspect-video bg-surface-container rounded-lg flex flex-col items-center justify-center p-2 text-center text-xs text-on-surface-variant border border-dashed border-outline-variant">
                <span class="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                <span class="text-[10px] mt-1">Dining Hall</span>
              </div>
              <div class="aspect-video bg-surface-container rounded-lg flex flex-col items-center justify-center p-2 text-center text-xs text-on-surface-variant border border-dashed border-outline-variant">
                <span class="material-symbols-outlined text-[20px]">add_photo_alternate</span>
                <span class="text-[10px] mt-1">Lawn & Stage</span>
              </div>
            </div>
          </div>
        `;

      case 6:
        return `
          <div class="space-y-4">
            <p class="text-xs text-on-surface-variant">Pinpoint the venue geolocation for OpenStreetMap search indexing.</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Latitude</label>
                <input type="number" step="0.0001" id="wz-lat" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-mono" value="${d.latitude}">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Longitude</label>
                <input type="number" step="0.0001" id="wz-lng" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-mono" value="${d.longitude}">
              </div>
            </div>
            <div class="p-4 bg-surface-container-low rounded-xl border border-surface-container flex items-center justify-between">
              <div>
                <span class="text-xs font-bold text-on-surface block">Automatic Geocoding</span>
                <span class="text-[11px] text-on-surface-variant">Coordinates preset for Karkala Heritage Corridor</span>
              </div>
              <button class="px-3 py-1.5 text-xs bg-primary text-on-primary rounded font-semibold" type="button" onclick="Toast.info('Location Pin', 'Coordinates successfully verified.');">
                Verify Pin
              </button>
            </div>
          </div>
        `;

      case 7:
        return `
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Host / Proprietor Name *</label>
                <input type="text" id="wz-owner-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="${d.contact.owner_name}">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Official Desk Phone *</label>
                <input type="text" id="wz-owner-phone" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="${d.contact.phone}">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Direct WhatsApp Number</label>
                <input type="text" id="wz-owner-wa" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" value="${d.contact.whatsapp}">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Reservations Email</label>
                <input type="email" id="wz-owner-email" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" value="${d.contact.email}">
              </div>
            </div>
          </div>
        `;

      case 8:
        return `
          <div class="space-y-4">
            <div class="p-4 bg-surface-container-low rounded-xl border border-surface-container space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-surface-container">
                <div>
                  <span class="text-sm font-bold text-on-surface block">Show Availability Calendar Publicly</span>
                  <span class="text-xs text-on-surface-variant block mt-0.5">
                    If ON, patrons can view slot availability live. If OFF, patrons must contact owner for availability.
                  </span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" id="wz-toggle-avail" class="sr-only peer" ${d.public_availability ? 'checked' : ''}>
                  <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div class="flex items-center justify-between pb-3 border-b border-surface-container">
                <div>
                  <span class="text-sm font-bold text-on-surface block">Show Phone Number Publicly</span>
                  <span class="text-xs text-on-surface-variant block mt-0.5">Display direct call desk on public hall profile.</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" id="wz-toggle-phone" class="sr-only peer" checked>
                  <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm font-bold text-on-surface block">Show WhatsApp Button Publicly</span>
                  <span class="text-xs text-on-surface-variant block mt-0.5">Allow prospective event organizers to chat directly.</span>
                </div>
                <label class="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" id="wz-toggle-wa" class="sr-only peer" checked>
                  <div class="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-on-tertiary-container"></div>
                </label>
              </div>
            </div>
          </div>
        `;

      case 9:
        return `
          <div class="space-y-4 text-center py-4">
            <div class="w-16 h-16 bg-secondary-fixed text-on-secondary-fixed rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <span class="material-symbols-outlined text-[32px]">shield</span>
            </div>
            <h3 class="font-headline-sm text-xl font-bold text-on-surface">Ready for Verification</h3>
            <p class="font-body-md text-xs text-on-surface-variant max-w-md mx-auto leading-relaxed">
              Upon submission, your hall will be placed in <strong>PENDING APPROVAL</strong> status. 
              The Super Admin team will audit physical dimensions, safety certificates, and pricing accuracy before publishing it live to public search.
            </p>

            <div class="p-4 bg-surface-container-low rounded-xl border border-surface-container text-left text-xs space-y-1.5 max-w-lg mx-auto">
              <div class="flex justify-between font-semibold text-on-surface">
                <span>Venue Name:</span>
                <span class="text-primary">${d.name || 'Gilded Magnolia Grand Hall'}</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Location:</span>
                <span>${d.city}, Karnataka</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Seating / Max Pax:</span>
                <span>${d.seating_capacity} / ${d.maximum_capacity} Guests</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Public Availability:</span>
                <span class="${d.public_availability ? 'text-on-tertiary-container font-bold' : 'text-secondary'}">
                  ${d.public_availability ? 'Public Calendar Active' : 'Private (Contact Owner)'}
                </span>
              </div>
            </div>
          </div>
        `;
    }
  },

  saveCurrentStepInputs() {
    const step = this.currentWizardStep;
    if (step === 1) {
      const name = document.getElementById('wz-name');
      const type = document.getElementById('wz-hall-type');
      const city = document.getElementById('wz-city');
      const area = document.getElementById('wz-area');
      const address = document.getElementById('wz-address');
      const desc = document.getElementById('wz-desc');
      if (name) this.wizardData.name = name.value;
      if (type) this.wizardData.hall_type = type.value;
      if (city) this.wizardData.city = city.value;
      if (area) this.wizardData.area = area.value;
      if (address) this.wizardData.address = address.value;
      if (desc) this.wizardData.description = desc.value;
    } else if (step === 2) {
      const size = document.getElementById('wz-size');
      const length = document.getElementById('wz-length');
      const width = document.getElementById('wz-width');
      const seat = document.getElementById('wz-seat');
      const max = document.getElementById('wz-max');
      const ac = document.getElementById('wz-ac');
      const io = document.getElementById('wz-indoor-outdoor');
      if (size) this.wizardData.size_sqft = Number(size.value);
      if (length) this.wizardData.length_ft = Number(length.value);
      if (width) this.wizardData.width_ft = Number(width.value);
      if (seat) this.wizardData.seating_capacity = Number(seat.value);
      if (max) this.wizardData.maximum_capacity = Number(max.value);
      if (ac) this.wizardData.ac_status = ac.value;
      if (io) this.wizardData.indoor_outdoor = io.value;
    } else if (step === 3) {
      const checkboxes = document.querySelectorAll('.wz-facility:checked');
      const facilities = Array.from(checkboxes).map(cb => cb.value);
      const custom = document.getElementById('wz-custom-facility');
      if (custom && custom.value.trim()) facilities.push(custom.value.trim());
      this.wizardData.facilities = facilities;
    } else if (step === 4) {
      const morn = document.getElementById('wz-price-morn');
      const aft = document.getElementById('wz-price-aft');
      const eve = document.getElementById('wz-price-eve');
      const night = document.getElementById('wz-price-night');
      const full = document.getElementById('wz-price-full');
      this.wizardData.pricing = {
        morning: morn ? Number(morn.value) : 65000,
        afternoon: aft ? Number(aft.value) : 45000,
        evening: eve ? Number(eve.value) : 85000,
        night: night ? Number(night.value) : 70000,
        full_day: full ? Number(full.value) : 180000
      };
    } else if (step === 5) {
      const img = document.getElementById('wz-cover-img');
      if (img && img.value) {
        this.wizardData.cover_image = img.value;
        this.wizardData.images = { main: img.value };
      }
    } else if (step === 6) {
      const lat = document.getElementById('wz-lat');
      const lng = document.getElementById('wz-lng');
      if (lat) this.wizardData.latitude = Number(lat.value);
      if (lng) this.wizardData.longitude = Number(lng.value);
    } else if (step === 7) {
      const owner = document.getElementById('wz-owner-name');
      const phone = document.getElementById('wz-owner-phone');
      const wa = document.getElementById('wz-owner-wa');
      const email = document.getElementById('wz-owner-email');
      this.wizardData.contact = {
        owner_name: owner ? owner.value : 'Host',
        phone: phone ? phone.value : '+91 82582 29988',
        whatsapp: wa ? wa.value : '+91 82582 29988',
        email: email ? email.value : 'owner@venueluxe.com'
      };
    } else if (step === 8) {
      const avail = document.getElementById('wz-toggle-avail');
      const phone = document.getElementById('wz-toggle-phone');
      const wa = document.getElementById('wz-toggle-wa');
      this.wizardData.public_availability = avail ? avail.checked : true;
      this.wizardData.privacy_settings = {
        show_availability: avail ? avail.checked : true,
        show_phone: phone ? phone.checked : true,
        show_whatsapp: wa ? wa.checked : true,
        show_email: true
      };
    }
  },

  nextWizardStep() {
    this.saveCurrentStepInputs();
    if (this.currentWizardStep < 9) {
      this.currentWizardStep++;
      this.renderWizard();
    }
  },

  prevWizardStep() {
    this.saveCurrentStepInputs();
    if (this.currentWizardStep > 1) {
      this.currentWizardStep--;
      this.renderWizard();
    }
  },

  submitHallForVerification() {
    this.saveCurrentStepInputs();
    const newHall = window.appStore.addHall(this.wizardData);
    this.close();

    Toast.luxury('Submission Received', `"${newHall.name}" was submitted for verification and is now in PENDING APPROVAL queue.`);

    // Switch to owner dashboard or admin dashboard
    window.location.hash = '#/owner';
  },

  // --- 3. Booking Request Modal (Requirement #10) ---
  openBookingModal(hallId, preselectedDate = '', preselectedSlot = '', preselectedPrice = null) {
    this.init();
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl p-6 md:p-8 modal-content border border-surface-container">
          
          <div class="flex items-center justify-between pb-4 border-b border-surface-container">
            <div>
              <span class="font-label-sm text-xs font-bold text-secondary uppercase tracking-widest">Hold Request</span>
              <h2 class="font-headline-sm text-xl font-bold text-on-surface mt-1">Book ${hall.name}</h2>
            </div>
            <button onclick="Modals.close()" class="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form id="direct-booking-form" class="space-y-4 my-4" onsubmit="event.preventDefault(); Modals.submitBooking('${hall.id}')">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Occasion / Event</label>
                <select id="bk-occasion" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-medium">
                  <option>Wedding & Reception</option>
                  <option>Birthday / Anniversary</option>
                  <option>Corporate Summit</option>
                  <option>Cultural Festival</option>
                  <option>Cocktail & Sangeet</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Estimated Guests</label>
                <input type="number" id="bk-guests" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="450" min="50" max="${hall.maximum_capacity}">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Event Date</label>
                <input type="date" id="bk-date" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="${preselectedDate || '2025-11-20'}">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Shift Slot</label>
                <select id="bk-slot" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold">
                  <option ${preselectedSlot.includes('Morning') ? 'selected' : ''}>Morning (7AM - 2PM)</option>
                  <option ${preselectedSlot.includes('Afternoon') ? 'selected' : ''}>Afternoon (12PM - 4PM)</option>
                  <option ${preselectedSlot.includes('Evening') ? 'selected' : ''}>Evening (4PM - 11PM)</option>
                  <option ${preselectedSlot.includes('Night') ? 'selected' : ''}>Night (7PM - 1AM)</option>
                  <option ${preselectedSlot.includes('Full Day') ? 'selected' : ''}>Full Day (24 Hours Exclusive)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Your Full Name</label>
                <input type="text" id="bk-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="Ayush Poojary" required>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Contact Phone</label>
                <input type="tel" id="bk-phone" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="+91 98450 12345" required>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Email Address</label>
              <input type="email" id="bk-email" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="ayush@example.com" required>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Additional Requirements</label>
              <textarea id="bk-notes" rows="2" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" placeholder="e.g. Stage mandap setup by 9 AM, VIP green room access..."></textarea>
            </div>

            <div class="p-3 bg-surface-container-low rounded-xl border border-surface-container flex items-center justify-between text-xs">
              <span class="text-on-surface-variant">Estimated Slot Tariff:</span>
              <span class="font-bold text-sm text-on-surface">${preselectedPrice ? '₹' + preselectedPrice.toLocaleString() : '₹95,000'}</span>
            </div>

            <p class="text-[11px] text-on-surface-variant leading-relaxed">
              * Direct hold will be sent to the hall owner. Status will remain <strong>PENDING</strong> until approved by the proprietor.
            </p>

            <button type="submit" class="w-full py-3 bg-primary text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-inverse-surface transition-all">
              Transmit Booking Request
            </button>
          </form>

        </div>
      </div>
    `;
  },

  submitBooking(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    const occasion = document.getElementById('bk-occasion').value;
    const date = document.getElementById('bk-date').value;
    const slot = document.getElementById('bk-slot').value;
    const guests = document.getElementById('bk-guests').value;
    const name = document.getElementById('bk-name').value;
    const phone = document.getElementById('bk-phone').value;
    const email = document.getElementById('bk-email').value;
    const notes = document.getElementById('bk-notes').value;

    const newBooking = window.appStore.createBooking({
      hall_id: hall.id,
      hall_name: hall.name,
      customer_id: window.appStore.getCurrentUser().id,
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      event_type: occasion,
      date,
      slot,
      guests: Number(guests),
      notes,
      amount: hall.pricing ? hall.pricing.evening || 95000 : 95000
    });

    this.close();
    Toast.success('Booking Request Transmitted', `Reference ${newBooking.id} submitted for ${hall.name}.`);
  },

  // --- 4. Write Review Modal (Requirement #20) ---
  openReviewModal(hallId) {
    this.init();
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl p-6 modal-content border border-surface-container">
          
          <div class="flex items-center justify-between pb-3 border-b border-surface-container">
            <h3 class="font-headline-sm text-lg font-bold text-on-surface">Write a Review</h3>
            <button onclick="Modals.close()" class="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onsubmit="event.preventDefault(); Modals.submitReview('${hall.id}')" class="space-y-4 my-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Rating</label>
              <div class="flex items-center gap-2 text-secondary text-2xl" id="star-rating-selector">
                <span class="cursor-pointer" onclick="Modals.setRating(1)">★</span>
                <span class="cursor-pointer" onclick="Modals.setRating(2)">★</span>
                <span class="cursor-pointer" onclick="Modals.setRating(3)">★</span>
                <span class="cursor-pointer" onclick="Modals.setRating(4)">★</span>
                <span class="cursor-pointer" onclick="Modals.setRating(5)">★</span>
                <input type="hidden" id="rev-rating-val" value="5">
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Your Name</label>
              <input type="text" id="rev-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="Ayush Poojary" required>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Your Review Feedback</label>
              <textarea id="rev-text" rows="3" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" placeholder="Share details about acoustics, air conditioning, parking, staff hospitality..." required></textarea>
            </div>

            <button type="submit" class="w-full py-2.5 bg-primary text-on-primary font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:bg-inverse-surface transition-all">
              Publish Verified Review
            </button>
          </form>

        </div>
      </div>
    `;
  },

  setRating(val) {
    const input = document.getElementById('rev-rating-val');
    if (input) input.value = val;
    const stars = document.querySelectorAll('#star-rating-selector span');
    stars.forEach((s, idx) => {
      s.style.opacity = idx < val ? '1' : '0.3';
    });
  },

  submitReview(hallId) {
    const rating = Number(document.getElementById('rev-rating-val').value) || 5;
    const name = document.getElementById('rev-name').value;
    const text = document.getElementById('rev-text').value;

    window.appStore.addReview({
      hall_id: hallId,
      customer_name: name,
      rating,
      text
    });

    this.close();
    Toast.success('Review Published', 'Thank you for contributing verified feedback!');
    window.dispatchEvent(new CustomEvent('hashchange'));
  },

  // --- 5. Share Modal (Requirement #21) ---
  openShareModal(hallId) {
    this.init();
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    const shareUrl = window.location.origin + window.location.pathname + `#/hall/${hall.id}`;
    const shareText = `Explore ${hall.name} in ${hall.city} on VenueLuxe — seats up to ${hall.seating_capacity} guests!`;

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-sm w-full rounded-2xl shadow-2xl p-6 modal-content border border-surface-container space-y-4">
          
          <div class="flex items-center justify-between pb-2 border-b border-surface-container">
            <h3 class="font-headline-sm text-lg font-bold text-on-surface">Share Venue</h3>
            <button onclick="Modals.close()" class="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Preview Card -->
          <div class="p-3 bg-surface-container-low rounded-xl flex items-center gap-3 border border-surface-container">
            <img src="${hall.cover_image}" class="w-12 h-12 rounded-lg object-cover shrink-0">
            <div class="truncate">
              <div class="font-bold text-xs text-on-surface truncate">${hall.name}</div>
              <div class="text-[11px] text-on-surface-variant">${hall.city} • Seats ${hall.seating_capacity}</div>
            </div>
          </div>

          <!-- Sharing Buttons -->
          <div class="grid grid-cols-4 gap-2 text-center text-xs">
            <a href="https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}" target="_blank" class="p-3 bg-emerald-50 text-emerald-800 rounded-xl hover:bg-emerald-100 flex flex-col items-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-[22px]">chat</span>
              <span class="text-[10px] font-semibold">WhatsApp</span>
            </a>
            <a href="https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}" target="_blank" class="p-3 bg-sky-50 text-sky-800 rounded-xl hover:bg-sky-100 flex flex-col items-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-[22px]">send</span>
              <span class="text-[10px] font-semibold">Telegram</span>
            </a>
            <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" class="p-3 bg-blue-50 text-blue-800 rounded-xl hover:bg-blue-100 flex flex-col items-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-[22px]">share</span>
              <span class="text-[10px] font-semibold">Facebook</span>
            </a>
            <a href="mailto:?subject=${encodeURIComponent(hall.name)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}" class="p-3 bg-slate-100 text-slate-800 rounded-xl hover:bg-slate-200 flex flex-col items-center gap-1 transition-colors">
              <span class="material-symbols-outlined text-[22px]">mail</span>
              <span class="text-[10px] font-semibold">Email</span>
            </a>
          </div>

          <!-- Copy Link -->
          <div class="flex items-center gap-2 p-2 rounded-lg bg-surface-container border border-surface-container">
            <input type="text" readonly value="${shareUrl}" class="bg-transparent text-xs w-full text-on-surface truncate focus:outline-none">
            <button class="px-3 py-1 bg-primary text-on-primary text-xs rounded font-bold shrink-0 hover:bg-inverse-surface" onclick="navigator.clipboard.writeText('${shareUrl}'); Toast.success('Copied', 'Link copied to clipboard!');">
              Copy
            </button>
          </div>

        </div>
      </div>
    `;
  },

  // --- 6. Photo Lightbox ---
  openLightbox(imageUrl, caption = '') {
    this.init();
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md modal-backdrop" onclick="Modals.close()">
        <div class="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center" onclick="event.stopPropagation()">
          <button onclick="Modals.close()" class="absolute -top-12 right-0 text-white hover:opacity-80 p-2">
            <span class="material-symbols-outlined text-[32px]">close</span>
          </button>
          <img src="${imageUrl}" class="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl">
          ${caption ? `<p class="text-white/80 text-sm mt-3 font-body-sm text-center">${caption}</p>` : ''}
        </div>
      </div>
    `;
  },

  // --- 7. Report Modal (Requirement #31) ---
  openReportModal(hallId) {
    this.init();
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl p-6 modal-content border border-surface-container space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-surface-container">
            <h3 class="font-headline-sm text-lg font-bold text-on-surface">Report Listing</h3>
            <button onclick="Modals.close()" class="p-1 rounded-full text-on-surface-variant hover:bg-surface-container">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onsubmit="event.preventDefault(); Modals.submitReport('${hall.id}')" class="space-y-3">
            <div>
              <label class="block text-xs font-bold uppercase text-on-surface mb-1">Reason</label>
              <select id="rep-reason" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface">
                <option>Incorrect Information / Wrong Capacity</option>
                <option>Fake Hall Listing</option>
                <option>Wrong Location / Map Pin</option>
                <option>Inappropriate Images / Content</option>
                <option>Suspicious / Fraudulent Pricing</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase text-on-surface mb-1">Explanation</label>
              <textarea id="rep-details" rows="3" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" placeholder="Provide context for admin compliance review..." required></textarea>
            </div>
            <button type="submit" class="w-full py-2.5 bg-error text-on-error font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm">
              Submit Report to Super Admin
            </button>
          </form>
        </div>
      </div>
    `;
  },

  submitReport(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;
    const reason = document.getElementById('rep-reason').value;
    const details = document.getElementById('rep-details').value;

    window.appStore.addReport({
      hall_id: hall.id,
      hall_name: hall.name,
      reporter_name: window.appStore.getCurrentUser().name,
      reason,
      details
    });

    this.close();
    Toast.info('Report Transmitted', 'Super Admin compliance will audit this venue listing.');
  }
};

window.Modals = Modals;
