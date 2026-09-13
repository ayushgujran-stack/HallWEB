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
    if (this._wizardMapInstance) {
      try { this._wizardMapInstance.remove(); } catch (e) {}
      this._wizardMapInstance = null;
      this._wizardMarkerInstance = null;
    }
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
            <div class="border-2 border-surface-container hover:border-primary p-5 rounded-xl cursor-pointer transition-all hover:shadow-md bg-surface-container-low/40 group flex flex-col justify-between" onclick="Modals.switchPortal('customer'); Modals.close();">
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
            <div class="border-2 border-surface-container hover:border-secondary p-5 rounded-xl cursor-pointer transition-all hover:shadow-md bg-surface-container-low/40 group flex flex-col justify-between" onclick="Modals.switchPortal('owner'); Modals.close();">
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

        </div>
      </div>
    `;
  },

  switchPortal(role) {
    if (role === 'owner') {
      window.location.href = '/owner/';
    } else if (role === 'admin') {
      window.location.href = '/admin/';
    } else {
      window.location.href = '/customer/';
    }
  },

  // --- 2. Nine-Step Add Hall Wizard (Requirement #12 & #13) ---
  openAddHallWizard() {
    this.currentWizardStep = 1;

    // Pre-fill contact from the currently signed-in user so the wizard starts with real data
    const authUser = window.Auth && window.Auth.getCurrentUser();

    this.wizardData = {
      name: '',
      hall_type: 'Wedding Palace & Convention',
      description: '',
      area: '',
      city: '',
      state: 'Karnataka',
      pincode: '',
      address: '',
      size_sqft: 10000,
      length_ft: 120,
      width_ft: 80,
      seating_capacity: 500,
      maximum_capacity: 1000,
      ac_status: 'Central AC (VRF)',
      indoor_outdoor: 'Indoor Auditorium',
      facilities: [],
      pricing: { morning: 0, afternoon: 0, evening: 0, night: 0, full_day: 0 },
      cover_image: '',
      images: [],   // Array of base64 data URLs (up to 6)
      website: '',  // Official website URL (optional)
      latitude: 13.2185,
      longitude: 74.9983,
      contact: {
        owner_name: authUser ? authUser.name : '',
        phone: authUser ? (authUser.phone || '') : '',
        whatsapp: authUser ? (authUser.phone || '') : '',
        email: authUser ? authUser.email : '',
        alternate_phone: ''
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
    if (step === 6) {
      setTimeout(() => this.initWizardMap(), 60);
    }
  },

  getWizardStepHTML(step) {
    const d = this.wizardData;
    switch (step) {
      case 1:
        return `
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Hall / Venue Name *</label>
              <input type="text" id="wz-name" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-primary" value="${d.name || ''}" placeholder="e.g. Royal Emerald Ballroom">
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
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">City / Town *</label>
                <input type="text" id="wz-city" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.city || ''}" placeholder="e.g. Karkala, Udupi, Mangalore">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">State</label>
                <input type="text" id="wz-state" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.state || 'Karnataka'}" placeholder="e.g. Karnataka">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Pincode</label>
                <input type="text" id="wz-pincode" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.pincode || ''}" placeholder="e.g. 574104">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Neighborhood / Area</label>
              <input type="text" id="wz-area" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.area || ''}" placeholder="e.g. Near Venkataramana Temple, Bypass Road">
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Full Postal Address</label>
              <textarea id="wz-address" rows="2" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" placeholder="Full address including landmark...">${d.address || ''}</textarea>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Description & Architecture</label>
              <textarea id="wz-desc" rows="3" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" placeholder="Describe the hall: high ceilings, pillarless sightlines, décor features, seating style...">${d.description || ''}</textarea>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Official Hall Website <span class="text-on-surface-variant font-normal normal-case">(Optional)</span></label>
              <input type="url" id="wz-website-step1" class="w-full p-3 rounded-lg bg-surface-container-low border border-surface-container text-on-surface text-sm" value="${d.website || ''}" placeholder="https://www.yourhallname.com">
              <p class="text-[11px] text-on-surface-variant mt-1">If your hall has an official website, it will be prominently showcased at the top of the photo gallery and with the pictures.</p>
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

      case 5: {
        const imgs = d.images || [];
        const maxImages = 6;
        const remaining = maxImages - imgs.length;
        return `
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-bold text-on-surface">Upload Hall Photos</p>
                <p class="text-xs text-on-surface-variant mt-0.5">Upload up to 6 images from your device. Specify your own custom name/tag for each photo below.</p>
              </div>
              <span class="px-3 py-1 rounded-full text-xs font-bold ${imgs.length >= maxImages ? 'bg-error-container text-error' : 'bg-surface-container text-on-surface-variant'} border border-outline">
                ${imgs.length} / ${maxImages}
              </span>
            </div>

            ${imgs.length < maxImages ? `
              <label for="wz-img-upload" class="flex flex-col items-center justify-center w-full py-7 border-2 border-dashed border-secondary/40 rounded-xl bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors group">
                <span class="material-symbols-outlined text-[40px] text-secondary group-hover:scale-110 transition-transform">add_photo_alternate</span>
                <p class="mt-2 text-sm font-bold text-on-surface">Click to select photos from device</p>
                <p class="text-xs text-on-surface-variant mt-0.5">JPG, PNG, WEBP • ${remaining} slot${remaining !== 1 ? 's' : ''} remaining</p>
                <input type="file" id="wz-img-upload" accept="image/*" multiple class="hidden" onchange="Modals.handleImageUpload(event)">
              </label>
            ` : `
              <div class="p-3 rounded-xl bg-surface-container text-center text-xs text-on-surface-variant">
                Maximum 6 images reached. Remove a photo to add a new one.
              </div>
            `}

            ${imgs.length > 0 ? `
              <div>
                <div class="flex items-center justify-between mb-2.5">
                  <p class="text-xs font-bold uppercase tracking-wider text-on-surface">
                    Uploaded Photos <span class="text-on-surface-variant font-normal">(Name / tag each photo yourself)</span>
                  </p>
                  <span class="text-[11px] text-secondary font-semibold">First photo will be your Main Cover</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5" id="wz-img-preview-grid">
                  ${imgs.map((item, idx) => {
                    const src = typeof item === 'object' ? item.url : item;
                    const tag = (typeof item === 'object' && item.tag) ? item.tag : '';
                    return `
                      <div class="p-2.5 bg-surface-container-low rounded-xl border-2 ${idx === 0 ? 'border-secondary' : 'border-surface-container'} flex flex-col gap-2 relative">
                        <div class="relative aspect-video rounded-lg overflow-hidden bg-surface-container group">
                          <img src="${src}" class="w-full h-full object-cover" alt="Photo ${idx + 1}">
                          ${idx === 0 ? '<span class="absolute top-1.5 left-1.5 bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">COVER PHOTO</span>' : ''}
                          <button type="button" onclick="Modals.removeWizardImage(${idx})" class="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-error text-white rounded-full flex items-center justify-center transition-colors shadow" title="Remove photo">
                            <span class="material-symbols-outlined text-[14px]">close</span>
                          </button>
                        </div>
                        <div class="space-y-1">
                          <div class="flex items-center justify-between">
                            <label class="block text-[10px] font-bold uppercase tracking-wider text-secondary">Picture Tag / Name *</label>
                            <span class="text-[10px] text-on-surface-variant">${idx === 0 ? 'Cover' : '#' + (idx + 1)}</span>
                          </div>
                          <input type="text" class="wz-img-tag-input w-full p-2 text-xs font-semibold rounded-lg bg-surface-container-lowest border border-surface-container text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary" placeholder="e.g. Grand Ballroom, Dining Pavilion, Lawn" value="${tag}" data-idx="${idx}" oninput="Modals.updateWizardImageTag(${idx}, this.value)">
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      }


      case 6:
        return `
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-bold text-on-surface">Pinpoint Venue Geolocation</h3>
                <p class="text-xs text-on-surface-variant">Click anywhere on the map or drag the pin marker to set the exact hall entrance for guests.</p>
              </div>
              <span id="wz-coords-badge" class="px-2.5 py-1 rounded bg-secondary-fixed text-on-secondary-fixed text-[11px] font-mono font-bold shrink-0 self-start sm:self-auto border border-secondary-fixed-dim">
                ${d.latitude ? `${d.latitude}° N, ${d.longitude}° E` : '13.2172° N, 74.9966° E'}
              </span>
            </div>

            <!-- Search Address & GPS Quick Actions -->
            <div class="flex flex-col sm:flex-row gap-2">
              <div class="relative flex-1">
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">search</span>
                <input type="text" id="wz-map-search-query" class="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-surface-container-low border border-surface-container text-on-surface focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Search landmark, street, area, or town..." value="${[d.area, d.city].filter(Boolean).join(', ')}" onkeydown="if(event.key === 'Enter'){ event.preventDefault(); Modals.searchWizardMapAddress(); }">
              </div>
              <button type="button" onclick="Modals.searchWizardMapAddress()" class="px-3.5 py-2 text-xs font-bold rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container shrink-0 flex items-center justify-center gap-1.5 transition-colors">
                <span class="material-symbols-outlined text-[16px] text-secondary">travel_explore</span>
                <span>Find on Map</span>
              </button>
              <button type="button" onclick="Modals.locateWizardGPS()" class="px-3.5 py-2 text-xs font-bold rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-surface-container shrink-0 flex items-center justify-center gap-1.5 transition-colors">
                <span class="material-symbols-outlined text-[16px] text-primary">my_location</span>
                <span>Current GPS</span>
              </button>
            </div>

            <!-- Interactive Leaflet Map Picker -->
            <div class="relative w-full h-64 md:h-72 rounded-xl overflow-hidden border border-surface-container bg-surface-container shadow-inner">
              <div id="wz-map-picker" class="w-full h-full z-0"></div>
              <div class="absolute bottom-2 left-2 z-[400] bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] text-on-surface font-medium border border-surface-container shadow-sm pointer-events-none flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px] text-secondary">pin_drop</span>
                <span>Drag pin marker or click anywhere on the map</span>
              </div>
            </div>

            <!-- Manual Lat/Lng inputs (automatically synchronized) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Latitude</label>
                <input type="number" step="0.000001" id="wz-lat" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-mono" value="${d.latitude || 13.2172}">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Longitude</label>
                <input type="number" step="0.000001" id="wz-lng" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-mono" value="${d.longitude || 74.9966}">
              </div>
            </div>
          </div>
        `;

      case 7:
        return `
          <div class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Host / Proprietor Name *</label>
                <input type="text" id="wz-owner-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="${d.contact.owner_name}" placeholder="Your full name">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Official Desk Phone *</label>
                <input type="text" id="wz-owner-phone" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="${d.contact.phone}" placeholder="+91 XXXXX XXXXX">
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Direct WhatsApp Number</label>
                <input type="text" id="wz-owner-wa" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" value="${d.contact.whatsapp}" placeholder="+91 XXXXX XXXXX">
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Reservations Email</label>
                <input type="email" id="wz-owner-email" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" value="${d.contact.email}" placeholder="hall@example.com">
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Official Website URL <span class="text-on-surface-variant font-normal normal-case">(Optional — for Premium members)</span></label>
              <input type="url" id="wz-website" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" value="${d.website || ''}" placeholder="https://www.yourhallname.com">
              <p class="text-[11px] text-on-surface-variant mt-1">If you have your own website, it will appear on your hall's detail page for Premium-tier listings.</p>
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
      const state = document.getElementById('wz-state');
      const pincode = document.getElementById('wz-pincode');
      const area = document.getElementById('wz-area');
      const address = document.getElementById('wz-address');
      const desc = document.getElementById('wz-desc');
      const web1 = document.getElementById('wz-website-step1');
      if (name) this.wizardData.name = name.value;
      if (type) this.wizardData.hall_type = type.value;
      if (city) this.wizardData.city = city.value;
      if (state) this.wizardData.state = state.value;
      if (pincode) this.wizardData.pincode = pincode.value;
      if (area) this.wizardData.area = area.value;
      if (address) this.wizardData.address = address.value;
      if (desc) this.wizardData.description = desc.value;
      if (web1 && web1.value.trim()) this.wizardData.website = web1.value.trim();
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
        morning: morn ? Number(morn.value) : 0,
        afternoon: aft ? Number(aft.value) : 0,
        evening: eve ? Number(eve.value) : 0,
        night: night ? Number(night.value) : 0,
        full_day: full ? Number(full.value) : 0
      };
    } else if (step === 5) {
      // Save custom user-defined image tags from input fields
      const tagInputs = document.querySelectorAll('.wz-img-tag-input');
      tagInputs.forEach(input => {
        const idx = parseInt(input.dataset.idx, 10);
        if (this.wizardData.images && this.wizardData.images[idx]) {
          const val = input.value.trim();
          if (typeof this.wizardData.images[idx] === 'string') {
            this.wizardData.images[idx] = { url: this.wizardData.images[idx], tag: val };
          } else {
            this.wizardData.images[idx].tag = val;
          }
        }
      });
      // Sync cover_image from first image in the array
      if (this.wizardData.images && this.wizardData.images.length > 0) {
        const first = this.wizardData.images[0];
        this.wizardData.cover_image = typeof first === 'object' ? first.url : first;
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
      const website = document.getElementById('wz-website');
      this.wizardData.contact = {
        owner_name: owner ? owner.value : '',
        phone: phone ? phone.value : '',
        whatsapp: wa ? wa.value : '',
        email: email ? email.value : ''
      };
      if (website) this.wizardData.website = website.value.trim();
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

  initWizardMap() {
    const mapEl = document.getElementById('wz-map-picker');
    if (!mapEl || typeof L === 'undefined') return;

    let lat = Number(this.wizardData.latitude) || 13.2172;
    let lng = Number(this.wizardData.longitude) || 74.9966;

    if (this._wizardMapInstance) {
      try {
        this._wizardMapInstance.remove();
      } catch (e) {}
      this._wizardMapInstance = null;
      this._wizardMarkerInstance = null;
    }

    const map = L.map('wz-map-picker', {
      zoomControl: true
    }).setView([lat, lng], 15);
    this._wizardMapInstance = map;

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    let tileOpts = {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 19
    };
    if (window.VENUELUXE_CONFIG && typeof window.VENUELUXE_CONFIG.getTileLayerConfig === 'function') {
      const cfg = window.VENUELUXE_CONFIG.getTileLayerConfig();
      tileUrl = cfg.url;
      tileOpts = cfg.options;
    }
    L.tileLayer(tileUrl, tileOpts).addTo(map);

    const pinIcon = L.divIcon({
      className: 'wz-draggable-pin-wrapper',
      html: `
        <div style="width:38px; height:50px; cursor:grab; transform:translate(-19px, -46px); filter:drop-shadow(0 4px 8px rgba(0,0,0,0.35));">
          <svg viewBox="0 0 24 24" width="38" height="50" fill="#A65B2B" stroke="#ffffff" stroke-width="1.2">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
          </svg>
        </div>
      `,
      iconSize: [38, 50],
      iconAnchor: [19, 50]
    });

    const marker = L.marker([lat, lng], {
      icon: pinIcon,
      draggable: true
    }).addTo(map);
    this._wizardMarkerInstance = marker;

    const updateCoords = (newLat, newLng) => {
      const roundedLat = Number(Number(newLat).toFixed(6));
      const roundedLng = Number(Number(newLng).toFixed(6));
      this.wizardData.latitude = roundedLat;
      this.wizardData.longitude = roundedLng;
      const latInput = document.getElementById('wz-lat');
      const lngInput = document.getElementById('wz-lng');
      if (latInput) latInput.value = roundedLat;
      if (lngInput) lngInput.value = roundedLng;
      const badge = document.getElementById('wz-coords-badge');
      if (badge) badge.innerText = `${roundedLat}° N, ${roundedLng}° E`;
    };

    marker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      updateCoords(pos.lat, pos.lng);
      if (window.Toast) window.Toast.info('Pin Moved', `Updated coordinates: ${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}`);
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      updateCoords(e.latlng.lat, e.latlng.lng);
    });

    const latInput = document.getElementById('wz-lat');
    const lngInput = document.getElementById('wz-lng');
    const onManualChange = () => {
      const nLat = parseFloat(latInput?.value);
      const nLng = parseFloat(lngInput?.value);
      if (!isNaN(nLat) && !isNaN(nLng)) {
        marker.setLatLng([nLat, nLng]);
        map.panTo([nLat, nLng]);
        this.wizardData.latitude = nLat;
        this.wizardData.longitude = nLng;
        const badge = document.getElementById('wz-coords-badge');
        if (badge) badge.innerText = `${nLat}° N, ${nLng}° E`;
      }
    };
    if (latInput) latInput.addEventListener('input', onManualChange);
    if (lngInput) lngInput.addEventListener('input', onManualChange);

    // Call invalidateSize multiple times to ensure tiles render immediately as modal opens
    setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 50);
    setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 250);
    setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 500);
  },

  locateWizardGPS() {
    if (!navigator.geolocation) {
      if (window.Toast) window.Toast.error('GPS Unavailable', 'Geolocation is not supported by your browser.');
      return;
    }
    if (window.Toast) window.Toast.info('Detecting Location', 'Acquiring GPS coordinates from your device...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        if (this._wizardMarkerInstance && this._wizardMapInstance) {
          this._wizardMarkerInstance.setLatLng([lat, lng]);
          this._wizardMapInstance.setView([lat, lng], 16);
        }
        const latInput = document.getElementById('wz-lat');
        const lngInput = document.getElementById('wz-lng');
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;
        this.wizardData.latitude = lat;
        this.wizardData.longitude = lng;
        const badge = document.getElementById('wz-coords-badge');
        if (badge) badge.innerText = `${lat}° N, ${lng}° E`;
        if (window.Toast) window.Toast.success('GPS Located', 'Pin dropped at your current location.');
      },
      (err) => {
        if (window.Toast) window.Toast.warning('GPS Denied', 'Could not access GPS. You can drag the pin on the map directly.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  },

  async searchWizardMapAddress() {
    const searchInput = document.getElementById('wz-map-search-query');
    let query = searchInput ? searchInput.value.trim() : '';
    if (!query) {
      query = [this.wizardData.address, this.wizardData.area, this.wizardData.city, this.wizardData.state].filter(Boolean).join(', ');
    }
    if (!query) {
      if (window.Toast) window.Toast.warning('Query Required', 'Please enter a landmark, street or town name.');
      return;
    }

    if (window.Toast) window.Toast.info('Searching Address', `Locating "${query}"...`);
    try {
      let result = null;
      if (window.VENUELUXE_CONFIG && typeof window.VENUELUXE_CONFIG.geocodeAddress === 'function') {
        result = await window.VENUELUXE_CONFIG.geocodeAddress(query);
      }
      if (result && result.lat && result.lng) {
        const lat = Number(result.lat.toFixed(6));
        const lng = Number(result.lng.toFixed(6));
        if (this._wizardMarkerInstance && this._wizardMapInstance) {
          this._wizardMarkerInstance.setLatLng([lat, lng]);
          this._wizardMapInstance.setView([lat, lng], 16);
        }
        const latInput = document.getElementById('wz-lat');
        const lngInput = document.getElementById('wz-lng');
        if (latInput) latInput.value = lat;
        if (lngInput) lngInput.value = lng;
        this.wizardData.latitude = lat;
        this.wizardData.longitude = lng;
        const badge = document.getElementById('wz-coords-badge');
        if (badge) badge.innerText = `${lat}° N, ${lng}° E`;
        if (window.Toast) window.Toast.success('Location Found', result.displayName || 'Pin updated on map.');
      } else {
        if (window.Toast) window.Toast.warning('Not Found', 'Could not locate that spot. Drag the pin directly on the map to pinpoint.');
      }
    } catch (e) {
      if (window.Toast) window.Toast.error('Search Failed', 'Could not complete geocoding search.');
    }
  },

  handleImageUpload(event) {
    const input = event.target;
    if (!input || !input.files || input.files.length === 0) return;

    if (!Array.isArray(this.wizardData.images)) {
      this.wizardData.images = [];
    }

    const maxImages = 6;
    const remainingSlots = maxImages - this.wizardData.images.length;
    if (remainingSlots <= 0) {
      if (window.Toast) window.Toast.error('Limit Reached', 'Maximum 6 photos allowed.');
      return;
    }

    const filesToUpload = Array.from(input.files).slice(0, remainingSlots);

    const compressImage = (dataUrl, maxDimension = 960, quality = 0.72) => {
      return new Promise((res) => {
        const img = new Image();
        img.onload = () => {
          let w = img.width;
          let h = img.height;
          if (w > maxDimension || h > maxDimension) {
            if (w > h) {
              h = Math.round((h * maxDimension) / w);
              w = maxDimension;
            } else {
              w = Math.round((w * maxDimension) / h);
              h = maxDimension;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          res(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => res(dataUrl);
        img.src = dataUrl;
      });
    };

    const readers = filesToUpload.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, ' ').trim();
          const tag = cleanName ? (cleanName.charAt(0).toUpperCase() + cleanName.slice(1)) : '';
          const compressedUrl = await compressImage(e.target.result);
          resolve({
            url: compressedUrl,
            tag: tag
          });
        };
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      const validImages = results.filter(Boolean);
      this.wizardData.images.push(...validImages);
      if (this.wizardData.images.length > 0) {
        const first = this.wizardData.images[0];
        this.wizardData.cover_image = typeof first === 'object' ? first.url : first;
      }
      const stepBody = document.getElementById('wizard-step-body');
      if (stepBody) {
        stepBody.innerHTML = this.getWizardStepHTML(5);
      }
    });
  },

  updateWizardImageTag(idx, tag) {
    if (this.wizardData && Array.isArray(this.wizardData.images) && this.wizardData.images[idx]) {
      if (typeof this.wizardData.images[idx] === 'string') {
        this.wizardData.images[idx] = { url: this.wizardData.images[idx], tag: tag };
      } else {
        this.wizardData.images[idx].tag = tag;
      }
    }
  },

  removeWizardImage(idx) {
    this.saveCurrentStepInputs();
    if (this.wizardData && Array.isArray(this.wizardData.images)) {
      this.wizardData.images.splice(idx, 1);
      if (this.wizardData.images.length > 0) {
        const first = this.wizardData.images[0];
        this.wizardData.cover_image = typeof first === 'object' ? first.url : first;
      } else {
        this.wizardData.cover_image = '';
      }
    }
    const stepBody = document.getElementById('wizard-step-body');
    if (stepBody) {
      stepBody.innerHTML = this.getWizardStepHTML(5);
    }
  },

  submitHallForVerification() {
    this.saveCurrentStepInputs();

    // Check if user is logged in
    if (!window.Auth || !window.Auth.isLoggedIn()) {
      // Prompt auth modal so they sign up / sign in before submitting
      this.openAuthModal(
        (user) => {
          if (window.Auth) window.Auth.upgradeToOwner(user.id);
          this.wizardData.owner_id = user.id;
          if (!this.wizardData.contact) this.wizardData.contact = {};
          this.wizardData.contact.owner_name = user.name || this.wizardData.contact.owner_name || 'Venue Host';
          this.wizardData.contact.email = user.email || this.wizardData.contact.email || '';
          this.wizardData.contact.phone = user.phone || this.wizardData.contact.phone || '';

          const newHall = window.appStore.addHall(this.wizardData);
          this.close();
          Toast.luxury('Venue Listing Submitted!', `"${newHall.name}" was submitted for audit. Redirecting to your Owner Workspace...`);
          setTimeout(() => {
            window.location.href = '/owner/';
          }, 800);
        },
        'signup',
        {
          subtitle: 'Create or sign in to your host account to publish your venue listing'
        }
      );
      return;
    }

    // Already logged in
    const currentUser = window.Auth.getCurrentUser();
    if (window.Auth) window.Auth.upgradeToOwner(currentUser.id);
    this.wizardData.owner_id = currentUser.id;
    if (!this.wizardData.contact) this.wizardData.contact = {};
    this.wizardData.contact.owner_name = currentUser.name || this.wizardData.contact.owner_name;
    this.wizardData.contact.email = currentUser.email || this.wizardData.contact.email;

    const newHall = window.appStore.addHall(this.wizardData);
    this.close();

    Toast.luxury('Venue Listing Submitted!', `"${newHall.name}" was submitted for audit. Redirecting to your Owner Workspace...`);
    setTimeout(() => {
      window.location.href = '/owner/';
    }, 800);
  },

  // --- 3. Auth Gate: fires before booking, then continues ---
  _afterAuthCallback: null,

  /**
   * Open auth modal. If callback provided, it fires after successful login/signup.
   */
  openAuthModal(afterAuthCallback = null, defaultTab = 'login', contextInfo = null) {
    this._afterAuthCallback = afterAuthCallback;
    this.init();
    const container = document.getElementById('modal-container');
    const isSignup = defaultTab === 'signup';
    
    container.innerHTML = `
      <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl modal-content border border-surface-container overflow-hidden">
          
          <!-- Context Banner if Booking -->
          ${contextInfo ? `
            <div class="bg-surface-container-low border-b border-surface-container px-6 py-2.5 flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-[18px]">lock</span>
              <p class="text-xs font-semibold text-on-surface">
                ${contextInfo.subtitle || 'Sign in or create an account to proceed with your booking'}
              </p>
            </div>
          ` : ''}

          <!-- Header -->
          <div class="p-6 pb-0">
            <div class="flex items-center justify-between mb-4">
              <div>
                <span class="font-label-sm text-xs font-bold text-secondary uppercase tracking-widest">VenueLuxe Account</span>
                <h2 class="font-headline-sm text-2xl font-bold text-on-surface mt-0.5" id="auth-modal-title">${isSignup ? 'Create Account' : 'Welcome Back'}</h2>
              </div>
              <button onclick="Modals.close()" class="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Tabs -->
            <div class="flex gap-1 p-1 bg-surface-container rounded-xl mb-5">
              <button id="tab-login" onclick="Modals._switchAuthTab('login')" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all ${!isSignup ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant'}">Sign In</button>
              <button id="tab-signup" onclick="Modals._switchAuthTab('signup')" class="flex-1 py-2 text-xs font-bold rounded-lg transition-all ${isSignup ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant'}">Sign Up</button>
            </div>
          </div>

          <!-- Login Form -->
          <div id="auth-form-login" class="${isSignup ? 'hidden' : ''} px-6 pb-6 space-y-3.5">
            <!-- 1-Click Google Sign-In -->
            <button type="button" id="btn-google-login" onclick="Modals._submitGoogleLogin()" class="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div class="flex items-center my-2">
              <div class="flex-grow border-t border-outline"></div>
              <span class="px-2 text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">or with email</span>
              <div class="flex-grow border-t border-outline"></div>
            </div>

            <form onsubmit="event.preventDefault(); Modals._submitLogin()" class="space-y-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Email Address</label>
                <input type="email" id="auth-login-email" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="you@example.com" required>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Password</label>
                <input type="password" id="auth-login-password" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="••••••••" required>
              </div>
              <div id="auth-login-error" class="hidden text-xs text-error font-semibold px-1"></div>
              <button type="submit" id="btn-auth-signin" class="w-full py-2.5 bg-primary text-on-primary font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-inverse-surface transition-all flex items-center justify-center gap-2">
                <span>Sign In</span>
              </button>
            </form>
            <p class="text-center text-xs text-on-surface-variant">
              Don't have an account? <button onclick="Modals._switchAuthTab('signup')" class="text-secondary font-bold hover:underline">Sign Up</button>
            </p>
          </div>

          <!-- Signup Form -->
          <div id="auth-form-signup" class="${!isSignup ? 'hidden' : ''} px-6 pb-6 space-y-3.5">
            <!-- 1-Click Google Sign-Up -->
            <button type="button" onclick="Modals._submitGoogleLogin()" class="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
              <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Sign Up with Google</span>
            </button>

            <div class="flex items-center my-2">
              <div class="flex-grow border-t border-outline"></div>
              <span class="px-2 text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">or with email</span>
              <div class="flex-grow border-t border-outline"></div>
            </div>

            <form onsubmit="event.preventDefault(); Modals._submitSignup()" class="space-y-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Full Name *</label>
                <input type="text" id="auth-signup-name" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="Your full name" required>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Phone *</label>
                  <input type="tel" id="auth-signup-phone" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="+91 98000 00000" required>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Email *</label>
                  <input type="email" id="auth-signup-email" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="you@example.com" required>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Password *</label>
                <input type="password" id="auth-signup-password" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="Min. 6 characters" required>
              </div>
              <div id="auth-signup-error" class="hidden text-xs text-error font-semibold px-1"></div>
              <button type="submit" id="btn-auth-signup" class="w-full py-2.5 bg-secondary text-on-secondary font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:bg-secondary-container transition-all flex items-center justify-center gap-2">
                <span>Create Account &amp; Continue</span>
              </button>
            </form>
            <p class="text-center text-xs text-on-surface-variant">
              Already have an account? <button onclick="Modals._switchAuthTab('login')" class="text-secondary font-bold hover:underline">Sign In</button>
            </p>
          </div>

        </div>
      </div>
    `;
  },

  _switchAuthTab(tab) {
    const loginForm = document.getElementById('auth-form-login');
    const signupForm = document.getElementById('auth-form-signup');
    const loginTab = document.getElementById('tab-login');
    const signupTab = document.getElementById('tab-signup');
    const title = document.getElementById('auth-modal-title');
    if (!loginForm) return;

    if (tab === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
      loginTab.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
      loginTab.classList.remove('text-on-surface-variant');
      signupTab.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
      signupTab.classList.add('text-on-surface-variant');
      if (title) title.textContent = 'Welcome Back';
    } else {
      signupForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
      signupTab.classList.add('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
      signupTab.classList.remove('text-on-surface-variant');
      loginTab.classList.remove('bg-surface-container-lowest', 'text-on-surface', 'shadow-sm');
      loginTab.classList.add('text-on-surface-variant');
      if (title) title.textContent = 'Create Account';
    }
  },

  async _submitLogin() {
    const email = document.getElementById('auth-login-email')?.value || '';
    const password = document.getElementById('auth-login-password')?.value || '';
    const errorEl = document.getElementById('auth-login-error');
    const btn = document.getElementById('btn-auth-signin');

    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Signing in...'; }

    try {
      const result = await window.Auth.login({ email, password });
      if (!result.success) {
        if (errorEl) { errorEl.textContent = result.error; errorEl.classList.remove('hidden'); }
        if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
        return;
      }
      this.close();
      if (window.CustomerHeaderComponent) window.CustomerHeaderComponent.update();
      Toast.success('Welcome back!', `Signed in as ${result.user.name}.`);

      if (result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl;
        }, 500);
        return;
      }

      if (this._afterAuthCallback) {
        const cb = this._afterAuthCallback;
        this._afterAuthCallback = null;
        cb(result.user);
      }
    } catch (err) {
      if (errorEl) { errorEl.textContent = err.message || 'Login failed.'; errorEl.classList.remove('hidden'); }
      if (btn) { btn.disabled = false; btn.textContent = 'Sign In'; }
    }
  },

  async _submitSignup() {
    const name = document.getElementById('auth-signup-name')?.value || '';
    const phone = document.getElementById('auth-signup-phone')?.value || '';
    const email = document.getElementById('auth-signup-email')?.value || '';
    const password = document.getElementById('auth-signup-password')?.value || '';
    const errorEl = document.getElementById('auth-signup-error');
    const btn = document.getElementById('btn-auth-signup');

    if (btn) { btn.disabled = true; btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Creating account...'; }

    try {
      const result = await window.Auth.register({ name, phone, email, password });
      if (!result.success) {
        if (errorEl) { errorEl.textContent = result.error; errorEl.classList.remove('hidden'); }
        if (btn) { btn.disabled = false; btn.textContent = 'Create Account & Continue'; }
        return;
      }
      this.close();
      if (window.CustomerHeaderComponent) window.CustomerHeaderComponent.update();
      Toast.success('Account Created!', `Signed in as ${result.user.name}.`);

      if (result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl;
        }, 500);
        return;
      }

      if (this._afterAuthCallback) {
        const cb = this._afterAuthCallback;
        this._afterAuthCallback = null;
        cb(result.user);
      }
    } catch (err) {
      if (errorEl) { errorEl.textContent = err.message || 'Registration failed.'; errorEl.classList.remove('hidden'); }
      if (btn) { btn.disabled = false; btn.textContent = 'Create Account & Continue'; }
    }
  },

  async _submitGoogleLogin() {
    try {
      Toast.info('Connecting to Google', 'Opening Google authentication window...');
      const result = await window.Auth.loginWithGoogle();
      if (!result.success) {
        Toast.error('Google Sign-In', result.error);
        return;
      }
      this.close();
      if (window.CustomerHeaderComponent) window.CustomerHeaderComponent.update();
      Toast.success('Signed In with Google!', `Welcome, ${result.user.name}!`);

      if (result.redirectUrl) {
        setTimeout(() => {
          window.location.href = result.redirectUrl;
        }, 500);
        return;
      }

      if (this._afterAuthCallback) {
        const cb = this._afterAuthCallback;
        this._afterAuthCallback = null;
        cb(result.user);
      }
    } catch (err) {
      Toast.error('Google Sign-In Error', err.message || 'Failed to authenticate with Google.');
    }
  },

  // --- 3b. Booking Request Modal (full form, auth required) ---
  openBookingModal(hallId, preselectedDate = '', preselectedSlot = '', preselectedPrice = null) {
    // Auth gate: if not logged in, show auth modal first, then re-open booking
    if (!window.Auth || !window.Auth.isLoggedIn()) {
      this.openAuthModal(() => this.openBookingModal(hallId, preselectedDate, preselectedSlot, preselectedPrice));
      return;
    }

    this.init();
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;
    const user = window.Auth.getCurrentUser();

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl modal-content border border-surface-container overflow-hidden">
          
          <!-- Modal Header -->
          <div class="p-6 pb-4 border-b border-surface-container bg-surface-container-low">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-label-sm text-xs font-bold text-secondary uppercase tracking-widest">Booking Request</span>
                <h2 class="font-headline-sm text-xl font-bold text-on-surface mt-0.5">${hall.name}</h2>
                <p class="text-xs text-on-surface-variant mt-0.5">${hall.city}, ${hall.state}</p>
              </div>
              <button onclick="Modals.close()" class="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <!-- Form Body -->
          <div class="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form id="direct-booking-form" class="space-y-4" onsubmit="event.preventDefault(); Modals.submitBooking('${hall.id}')">
              
              <!-- Customer Info (pre-filled, read-only) -->
              <div class="p-3 bg-surface-container rounded-xl border border-surface-container">
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">${user.name ? user.name[0].toUpperCase() : 'U'}</span>
                  <span class="text-xs font-bold text-on-surface">${user.name}</span>
                  <span class="ml-auto text-[10px] text-secondary font-semibold uppercase tracking-wider">Booking as you</span>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[11px] text-on-surface-variant">
                  <span>📞 ${user.phone}</span>
                  <span>✉ ${user.email}</span>
                </div>
              </div>

              <!-- Hidden customer fields -->
              <input type="hidden" id="bk-name" value="${user.name}">
              <input type="hidden" id="bk-phone" value="${user.phone}">
              <input type="hidden" id="bk-email" value="${user.email}">
              <input type="hidden" id="bk-customer-id" value="${user.id}">

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Event Type *</label>
                  <select id="bk-occasion" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-medium" required>
                    <option value="" disabled ${!preselectedSlot ? 'selected' : ''}>Select Event Type</option>
                    <option value="Wedding & Reception">Wedding &amp; Reception</option>
                    <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                    <option value="Corporate Summit">Corporate Summit</option>
                    <option value="Cultural Festival">Cultural Festival</option>
                    <option value="Cocktail & Sangeet">Cocktail &amp; Sangeet</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Estimated Guests *</label>
                  <input type="number" id="bk-guests" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="" placeholder="e.g. 250" min="10" max="${hall.maximum_capacity || 2000}" required>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Preferred Date *</label>
                  <input type="date" id="bk-date" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" value="${preselectedDate || ''}" min="${new Date().toISOString().split('T')[0]}" required>
                </div>
                <div>
                  <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Shift *</label>
                  <select id="bk-slot" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold" required>
                    <option value="" disabled ${!preselectedSlot ? 'selected' : ''}>Select Shift</option>
                    <option value="Morning (7AM - 2PM)" ${preselectedSlot && preselectedSlot.includes('Morning') ? 'selected' : ''}>Morning (7AM - 2PM)</option>
                    <option value="Afternoon (12PM - 4PM)" ${preselectedSlot && preselectedSlot.includes('Afternoon') ? 'selected' : ''}>Afternoon (12PM - 4PM)</option>
                    <option value="Evening (4PM - 11PM)" ${preselectedSlot && preselectedSlot.includes('Evening') ? 'selected' : ''}>Evening (4PM - 11PM)</option>
                    <option value="Night (7PM - 1AM)" ${preselectedSlot && preselectedSlot.includes('Night') ? 'selected' : ''}>Night (7PM - 1AM)</option>
                    <option value="Full Day (24 Hours Exclusive)" ${preselectedSlot && preselectedSlot.includes('Full Day') ? 'selected' : ''}>Full Day (24 Hours Exclusive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Additional Notes</label>
                <textarea id="bk-notes" rows="2" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface" placeholder="e.g. Stage mandap setup by 9 AM, VIP green room access, specific dietary needs..."></textarea>
              </div>

              <!-- Price indicator -->
              <div class="p-3 bg-secondary-fixed/50 rounded-xl border border-secondary/20 flex items-center justify-between text-xs">
                <div>
                  <span class="text-on-surface-variant">Starting from</span>
                  <div class="font-bold text-base text-on-surface">₹${(preselectedPrice || (hall.pricing ? Math.min(...Object.values(hall.pricing)) : 32000)).toLocaleString('en-IN')}</div>
                </div>
                <span class="text-[11px] text-on-surface-variant leading-tight text-right max-w-[160px]">Final price decided between you and the owner after approval</span>
              </div>

              <p class="text-[11px] text-on-surface-variant leading-relaxed">
                * Your phone <strong>${user.phone}</strong> and email <strong>${user.email}</strong> will be shared with the owner to coordinate details.
              </p>

              <button type="submit" id="bk-submit-btn" class="w-full py-3 bg-primary text-on-primary font-bold text-sm uppercase tracking-wider rounded-xl shadow-md hover:bg-inverse-surface transition-all flex items-center justify-center gap-2">
                <span class="material-symbols-outlined text-[18px]">send</span>
                Send Booking Request
              </button>
            </form>
          </div>

        </div>
      </div>
    `;
  },

  submitBooking(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;
    const user = window.Auth.getCurrentUser();
    if (!user) { this.openAuthModal(); return; }

    const occasion = document.getElementById('bk-occasion')?.value;
    if (!occasion) {
      document.getElementById('bk-occasion')?.focus();
      Toast.error('Event Type Required', 'Please select an event type.');
      return;
    }

    const guestsInput = document.getElementById('bk-guests');
    const guests = Number(guestsInput?.value);
    if (!guests || guests <= 0) {
      guestsInput?.focus();
      Toast.error('Guests Required', 'Please enter estimated guest count.');
      return;
    }

    const date = document.getElementById('bk-date')?.value || '';
    if (!date) {
      const dateEl = document.getElementById('bk-date');
      if (dateEl) dateEl.focus();
      Toast.error('Date Required', 'Please select a preferred date for your event.');
      return;
    }

    const slot = document.getElementById('bk-slot')?.value;
    if (!slot) {
      document.getElementById('bk-slot')?.focus();
      Toast.error('Shift Required', 'Please select a shift for your event.');
      return;
    }

    const notes = document.getElementById('bk-notes')?.value || '';

    // Disable button to prevent double submit
    const btn = document.getElementById('bk-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }

    // Determine price from slot
    const slotPriceMap = {
      'Morning': hall.pricing?.morning,
      'Afternoon': hall.pricing?.afternoon,
      'Evening': hall.pricing?.evening,
      'Night': hall.pricing?.night,
      'Full Day': hall.pricing?.full_day
    };
    const slotKey = Object.keys(slotPriceMap).find(k => slot.toLowerCase().startsWith(k.toLowerCase())) || 'Evening';
    const price = slotPriceMap[slotKey] || 95000;

    const newBooking = window.appStore.createBooking({
      hall_id: hall.id,
      hall_name: hall.name,
      customer_id: user.id,
      customer_name: user.name,
      customer_phone: user.phone,
      customer_email: user.email,
      event_type: occasion,
      date,
      slot,
      guests: Number(guests),
      notes,
      amount: price
    });

    this.close();
    // Show success screen instead of just a toast
    this.openBookingSuccessModal(newBooking, hall);
  },

  // --- 3c. Booking Success / Confirmation Screen ---
  openBookingSuccessModal(booking, hall) {
    this.init();
    const contact = hall.contact || {};
    const showPhone = hall.privacy_settings?.show_phone !== false;
    const showWhatsapp = hall.privacy_settings?.show_whatsapp !== false;
    const showEmail = hall.privacy_settings?.show_email !== false;

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md modal-backdrop">
        <div class="bg-surface-container-lowest max-w-md w-full rounded-2xl shadow-2xl modal-content border border-surface-container overflow-hidden">
          
          <!-- Success Header -->
          <div class="p-8 pb-6 text-center bg-gradient-to-b from-surface-container-low to-surface-container-lowest">
            <div class="w-16 h-16 rounded-2xl bg-tertiary-container text-on-tertiary-container flex items-center justify-center mx-auto mb-4 shadow-md">
              <span class="material-symbols-outlined text-[36px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
            </div>
            <h2 class="font-headline-sm text-2xl font-bold text-on-surface">Request Sent!</h2>
            <p class="text-sm text-on-surface-variant mt-2 leading-relaxed">
              Your booking request has been sent to the hall owner. They will review and get back to you.
            </p>
          </div>

          <div class="px-6 pb-6 space-y-4">
            <!-- Booking Summary -->
            <div class="p-4 bg-surface-container rounded-xl border border-surface-container space-y-2 text-xs">
              <div class="flex justify-between font-semibold text-on-surface">
                <span class="text-on-surface-variant">Reference No.</span>
                <span class="font-mono font-bold text-secondary">${booking.id}</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Hall</span>
                <span class="text-on-surface font-semibold text-right max-w-[200px] truncate">${hall.name}</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Date & Shift</span>
                <span class="text-on-surface font-semibold">${booking.date} • ${booking.slot}</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Guests</span>
                <span class="text-on-surface font-semibold">${booking.guests} guests</span>
              </div>
              <div class="flex justify-between text-on-surface-variant">
                <span>Event</span>
                <span class="text-on-surface font-semibold">${booking.event_type}</span>
              </div>
              <div class="pt-1 border-t border-surface-container">
                <div class="flex justify-between text-on-surface-variant">
                  <span>Status</span>
                  <span class="px-2 py-0.5 rounded-full bg-status-pending-bg text-status-pending font-bold text-[10px] uppercase tracking-wider">Pending Owner Approval</span>
                </div>
              </div>
            </div>

            <!-- Owner Contact -->
            <div class="p-4 bg-surface-container-low rounded-xl border border-outline">
              <div class="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">Owner Contact Details</div>
              <div class="space-y-2">
                <div class="text-sm font-bold text-on-surface">${contact.owner_name || hall.name}</div>
                ${showPhone && contact.phone ? `
                  <a href="tel:${contact.phone}" class="flex items-center gap-2 text-xs text-secondary hover:underline">
                    <span class="material-symbols-outlined text-[16px]">call</span>
                    ${contact.phone}
                  </a>
                ` : ''}
                ${showWhatsapp && contact.whatsapp ? `
                  <a href="https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="flex items-center gap-2 text-xs text-emerald-700 hover:underline">
                    <span class="material-symbols-outlined text-[16px]">chat</span>
                    WhatsApp: ${contact.whatsapp}
                  </a>
                ` : ''}
                ${showEmail && contact.email ? `
                  <a href="mailto:${contact.email}" class="flex items-center gap-2 text-xs text-on-surface-variant hover:text-on-surface">
                    <span class="material-symbols-outlined text-[16px]">mail</span>
                    ${contact.email}
                  </a>
                ` : ''}
              </div>
              <p class="text-[11px] text-on-surface-variant mt-3 leading-relaxed">
                The owner will call you at <strong>${booking.customer_phone}</strong> or email <strong>${booking.customer_email}</strong> to coordinate offline advance payment and finalize scheduling.
              </p>
            </div>

            <!-- Direct Offline Settlement Policy Card -->
            <div class="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-left space-y-1">
              <div class="flex items-center gap-1.5 font-bold text-xs text-secondary">
                <span class="material-symbols-outlined text-[15px]">payments</span>
                <span>Direct Offline Settlement</span>
              </div>
              <p class="text-[11px] text-on-surface-variant leading-tight">
                No money is collected on this platform. Advance tokens, contracts, and catering packages are settled directly between you and the hall proprietor offline.
              </p>
            </div>

            <!-- Direct WhatsApp Coordinate Action -->
            ${contact.whatsapp ? `
              <a href="https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I submitted a hold for ${hall.name} on ${booking.date} (${booking.slot}) on VenueLuxe (Ref: ${booking.id}). I'd like to discuss advance payment and event arrangements.`)}" target="_blank" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all">
                <span class="material-symbols-outlined text-[18px]">chat</span>
                <span>Chat with Owner on WhatsApp</span>
              </a>
            ` : ''}

            <!-- CTAs -->
            <div class="flex gap-2.5">
              <button onclick="Modals.close(); window.location.hash='#/customer';" class="flex-1 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl hover:bg-inverse-surface transition-all">
                View My Bookings
              </button>
              <button onclick="Modals.close()" class="flex-1 py-2.5 bg-surface-container text-on-surface font-bold text-xs rounded-xl hover:bg-surface-container-high transition-all border border-surface-container">
                Done
              </button>
            </div>
          </div>

        </div>
      </div>
    `;

    if (window.CustomerHeaderComponent) window.CustomerHeaderComponent.update();
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

  // --- 6. Photo Lightbox & Interactive Gallery Modal ---
  _currentGallery: null,

  openGalleryModal(hallId, startIndex = 0) {
    this.init();
    const hall = (typeof hallId === 'object' && hallId !== null) ? hallId : window.appStore.getHallById(hallId);
    if (!hall) return;

    // Normalize gallery items preserving custom tags given by the user
    const items = [];
    if (Array.isArray(hall.images) && hall.images.length > 0) {
      hall.images.forEach((img, idx) => {
        if (typeof img === 'string') {
          items.push({ url: img, tag: idx === 0 ? 'Cover Photo' : `Photo ${idx + 1}` });
        } else if (img && typeof img === 'object') {
          items.push({
            url: img.url || hall.cover_image,
            tag: img.tag || (idx === 0 ? 'Cover Photo' : `Photo ${idx + 1}`)
          });
        }
      });
    } else if (hall.images && typeof hall.images === 'object') {
      const defaultTags = {
        main: 'Main Ballroom',
        dining: 'Dining Pavilion',
        courtyard: 'Courtyard Garden Lawn',
        suite: 'VIP Bridal Suite',
        exterior: 'Campus Facade'
      };
      Object.entries(hall.images).forEach(([k, v]) => {
        if (typeof v === 'string' && v) {
          items.push({ url: v, tag: defaultTags[k] || k });
        } else if (v && typeof v === 'object' && v.url) {
          items.push({ url: v.url, tag: v.tag || defaultTags[k] || k });
        }
      });
    }

    if (items.length === 0 && hall.cover_image) {
      items.push({ url: hall.cover_image, tag: 'Cover Photo' });
    }

    this._currentGallery = {
      hall,
      items,
      currentIndex: Math.max(0, Math.min(startIndex, items.length - 1))
    };

    this.renderGalleryModal();
  },

  renderGalleryModal() {
    if (!this._currentGallery || !this._currentGallery.hall || !this._currentGallery.items.length) return;
    const { hall, items, currentIndex } = this._currentGallery;
    const currentItem = items[currentIndex] || items[0];

    const rawWebsite = (hall.website || '').trim();
    const websiteUrl = rawWebsite ? (rawWebsite.startsWith('http') ? rawWebsite : 'https://' + rawWebsite) : '';
    const cleanDisplayWebsite = rawWebsite ? rawWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '') : '';

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md modal-backdrop" onclick="Modals.close()">
        <div class="relative max-w-5xl w-full flex flex-col max-h-[96vh] rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 shadow-2xl" onclick="event.stopPropagation()">
          
          <!-- Top Bar: Hall Website Just Before The Pictures -->
          <div class="p-3 sm:p-4 bg-neutral-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[20px]">photo_library</span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white tracking-tight">${hall.name}</h3>
                <p class="text-[11px] text-white/60">${hall.area || ''}, ${hall.city || ''}</p>
              </div>
            </div>

            <div class="flex items-center gap-2.5">
              ${websiteUrl ? `
                <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary hover:bg-secondary-container text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                  <span class="material-symbols-outlined text-[15px]">language</span>
                  <span>Visit Hall Website</span>
                  <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              ` : ''}
              <button onclick="Modals.close()" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors" title="Close">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
          </div>

          <!-- Main Picture Display Area -->
          <div class="relative flex-1 min-h-[320px] max-h-[62vh] sm:max-h-[68vh] flex items-center justify-center p-2 sm:p-4 bg-black overflow-hidden">
            <img src="${currentItem.url}" alt="${currentItem.tag}" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-all duration-300">
            
            ${items.length > 1 ? `
              <!-- Navigation Controls -->
              <button onclick="Modals.galleryPrev()" class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all shadow-lg" title="Previous photo">
                <span class="material-symbols-outlined text-[24px]">chevron_left</span>
              </button>
              <button onclick="Modals.galleryNext()" class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 transition-all shadow-lg" title="Next photo">
                <span class="material-symbols-outlined text-[24px]">chevron_right</span>
              </button>
            ` : ''}
          </div>

          <!-- Bottom Footer Bar: Custom Picture Tag Given by User & Website Link with Picture -->
          <div class="p-3 sm:p-4 bg-neutral-900 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div class="flex items-center gap-2.5">
              <span class="px-2.5 py-1 bg-secondary text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-sm">
                ${currentItem.tag}
              </span>
              <span class="text-xs text-white/60 font-medium">
                ${currentIndex + 1} of ${items.length}
              </span>
            </div>

            ${websiteUrl ? `
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-white/60 hidden sm:inline">Official Hall Website:</span>
                <a href="${websiteUrl}" target="_blank" rel="noopener noreferrer" class="text-xs font-semibold text-secondary hover:text-white underline flex items-center gap-1">
                  <span>${cleanDisplayWebsite}</span>
                  <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              </div>
            ` : ''}
          </div>

          <!-- Thumbnail Strip -->
          ${items.length > 1 ? `
            <div class="px-3 py-2 bg-black/80 border-t border-white/5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-thin">
              ${items.map((item, idx) => `
                <button onclick="Modals.galleryGoTo(${idx})" class="relative w-16 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all ${idx === currentIndex ? 'border-secondary scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}" title="${item.tag}">
                  <img src="${item.url}" class="w-full h-full object-cover">
                </button>
              `).join('')}
            </div>
          ` : ''}

        </div>
      </div>
    `;
  },

  galleryPrev() {
    if (!this._currentGallery || !this._currentGallery.items) return;
    const len = this._currentGallery.items.length;
    this._currentGallery.currentIndex = (this._currentGallery.currentIndex - 1 + len) % len;
    this.renderGalleryModal();
  },

  galleryNext() {
    if (!this._currentGallery || !this._currentGallery.items) return;
    const len = this._currentGallery.items.length;
    this._currentGallery.currentIndex = (this._currentGallery.currentIndex + 1) % len;
    this.renderGalleryModal();
  },

  galleryGoTo(idx) {
    if (!this._currentGallery || !this._currentGallery.items) return;
    this._currentGallery.currentIndex = idx;
    this.renderGalleryModal();
  },

  openLightbox(imageUrl, caption = '', websiteUrl = '') {
    this.init();
    const cleanWeb = (websiteUrl || '').trim();
    const webHref = cleanWeb ? (cleanWeb.startsWith('http') ? cleanWeb : 'https://' + cleanWeb) : '';
    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-md modal-backdrop" onclick="Modals.close()">
        <div class="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center bg-neutral-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl" onclick="event.stopPropagation()">
          
          <!-- Top bar with website just before picture -->
          <div class="w-full p-3 px-4 bg-neutral-900 border-b border-white/10 flex items-center justify-between">
            <div class="flex items-center gap-2 text-white">
              <span class="material-symbols-outlined text-secondary text-[20px]">photo</span>
              <span class="text-xs font-bold">${caption || 'Venue Photo'}</span>
            </div>
            <div class="flex items-center gap-2">
              ${webHref ? `
                <a href="${webHref}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-secondary-container transition-colors">
                  <span class="material-symbols-outlined text-[14px]">language</span>
                  <span>Visit Website</span>
                  <span class="material-symbols-outlined text-[12px]">open_in_new</span>
                </a>
              ` : ''}
              <button onclick="Modals.close()" class="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                <span class="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>
          </div>

          <!-- Image -->
          <div class="p-3 sm:p-6 flex items-center justify-center max-h-[75vh]">
            <img src="${imageUrl}" class="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl">
          </div>

          <!-- Bottom with caption and website -->
          ${(caption || webHref) ? `
            <div class="w-full p-3 px-4 bg-neutral-900 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span class="text-white/80 font-medium">${caption}</span>
              ${webHref ? `
                <a href="${webHref}" target="_blank" class="text-secondary hover:underline flex items-center gap-1 font-semibold">
                  <span>Visit Hall Website</span>
                  <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                </a>
              ` : ''}
            </div>
          ` : ''}

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
    const user = window.appStore.getCurrentUser();

    window.appStore.addReport({
      hall_id: hall.id,
      hall_name: hall.name,
      reporter_name: user ? user.name : 'Anonymous',
      reason,
      details
    });

    this.close();
    Toast.info('Report Transmitted', 'Super Admin compliance will audit this venue listing.');
  },

  // --- 8. Edit Hall Specifications Modal for Hall Owners ---
  openEditHall(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) {
      Toast.error('Hall Not Found', 'Could not locate the requested venue specifications.');
      return;
    }

    this.init();
    const container = document.getElementById('modal-container');
    const p = hall.pricing || { morning: 65000, afternoon: 45000, evening: 85000, night: 70000, full_day: 180000 };
    const priv = hall.privacy_settings || { show_phone: true, show_whatsapp: true, show_email: true, show_availability: true };
    const facs = hall.facilities || [];

    const commonFacilities = [
      'Central AC (VRF)', 'Separate AC Dining Hall', 'Industrial Kitchen',
      'Car Parking', 'Stage & Sound System', 'Generator Backup', 'Wi-Fi',
      'Valet Parking', 'Lawn Stage', 'Green Rooms', 'CCTV Security', 'Elevator Access'
    ];

    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-3xl w-full max-h-[92vh] flex flex-col rounded-2xl shadow-2xl modal-content border border-outline overflow-hidden">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between p-5 md:p-6 border-b border-outline bg-surface-container-low shrink-0">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-widest">Host Operational Tool</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hall.status === 'LIVE' ? 'bg-status-available-bg text-status-available border border-status-available-border' : 'bg-status-pending-bg text-status-pending border border-status-pending-border'}">${hall.status}</span>
              </div>
              <h2 class="font-headline-sm text-xl md:text-2xl font-bold text-on-surface mt-1">Edit Venue Specifications</h2>
              <p class="text-xs text-on-surface-variant">${hall.name}</p>
            </div>
            <button onclick="Modals.close()" class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container" aria-label="Close dialog">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Form Body -->
          <form id="edit-hall-form" onsubmit="event.preventDefault(); Modals.submitEditHall('${hall.id}')" class="p-5 md:p-6 space-y-6 overflow-y-auto flex-1 text-xs">
            
            <!-- SECTION 1: Core Details -->
            <div class="space-y-3">
              <h4 class="font-title-md text-xs font-bold uppercase tracking-wider text-secondary border-b border-outline pb-1.5 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">domain</span>
                General Venue Details
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-on-surface mb-1">Venue Name *</label>
                  <input type="text" id="eh-name" value="${hall.name || ''}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-medium" required>
                </div>
                <div>
                  <label class="block font-bold text-on-surface mb-1">Venue Type</label>
                  <select id="eh-type" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-medium">
                    <option ${hall.hall_type === 'Wedding Palace & Convention' ? 'selected' : ''}>Wedding Palace & Convention</option>
                    <option ${hall.hall_type === 'Heritage Cultural Hall' ? 'selected' : ''}>Heritage Cultural Hall</option>
                    <option ${hall.hall_type === 'Grand Open Lawn & Banquet' ? 'selected' : ''}>Grand Open Lawn & Banquet</option>
                    <option ${hall.hall_type === 'Corporate & Convention Centre' ? 'selected' : ''}>Corporate & Convention Centre</option>
                    <option ${hall.hall_type === 'Intimate Banquet Hall' ? 'selected' : ''}>Intimate Banquet Hall</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-bold text-on-surface mb-1">Description</label>
                <textarea id="eh-desc" rows="2" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-medium">${hall.description || ''}</textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block font-bold text-on-surface mb-1">City</label>
                  <input type="text" id="eh-city" value="${hall.city || 'Karkala'}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-medium">
                </div>
                <div>
                  <label class="block font-bold text-on-surface mb-1">Area / Landmark</label>
                  <input type="text" id="eh-area" value="${hall.area || ''}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-medium">
                </div>
                <div>
                  <label class="block font-bold text-on-surface mb-1">Cover Image URL</label>
                  <input type="url" id="eh-cover" value="${hall.cover_image || ''}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-medium">
                </div>
              </div>
            </div>

            <!-- SECTION 2: Dimensions & Capacity -->
            <div class="space-y-3">
              <h4 class="font-title-md text-xs font-bold uppercase tracking-wider text-secondary border-b border-outline pb-1.5 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">straighten</span>
                Dimensions & Capacity
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label class="block font-bold text-on-surface mb-1">Seating Capacity *</label>
                  <input type="number" id="eh-seating" value="${hall.seating_capacity || 500}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-bold" required>
                </div>
                <div>
                  <label class="block font-bold text-on-surface mb-1">Max Floating *</label>
                  <input type="number" id="eh-max-capacity" value="${hall.maximum_capacity || 1000}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-bold" required>
                </div>
                <div>
                  <label class="block font-bold text-on-surface mb-1">Size (Sq.Ft.)</label>
                  <input type="number" id="eh-sqft" value="${hall.size_sqft || 10000}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-medium">
                </div>
                <div>
                  <label class="block font-bold text-on-surface mb-1">AC Specification</label>
                  <select id="eh-ac" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface focus:border-secondary outline-none font-medium">
                    <option ${hall.ac_status?.includes('VRF') ? 'selected' : ''}>Central AC (VRF)</option>
                    <option ${hall.ac_status?.includes('HVAC') ? 'selected' : ''}>Full Central HVAC</option>
                    <option ${hall.ac_status?.includes('Split') ? 'selected' : ''}>Split ACs Installed</option>
                    <option ${hall.ac_status?.includes('Non-AC') ? 'selected' : ''}>Non-AC Natural Ventilation</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SECTION 3: Shift Tariffs -->
            <div class="space-y-3">
              <h4 class="font-title-md text-xs font-bold uppercase tracking-wider text-secondary border-b border-outline pb-1.5 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">payments</span>
                Shift Tariff Schedule (₹)
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <div>
                  <label class="block text-[11px] font-bold text-on-surface mb-1">Morning</label>
                  <input type="number" id="eh-price-morning" value="${p.morning || 65000}" class="w-full p-2 rounded-lg bg-surface-container-low border border-outline text-on-surface font-semibold">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-on-surface mb-1">Afternoon</label>
                  <input type="number" id="eh-price-afternoon" value="${p.afternoon || 45000}" class="w-full p-2 rounded-lg bg-surface-container-low border border-outline text-on-surface font-semibold">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-on-surface mb-1">Evening</label>
                  <input type="number" id="eh-price-evening" value="${p.evening || 85000}" class="w-full p-2 rounded-lg bg-surface-container-low border border-outline text-on-surface font-semibold">
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-on-surface mb-1">Night</label>
                  <input type="number" id="eh-price-night" value="${p.night || 70000}" class="w-full p-2 rounded-lg bg-surface-container-low border border-outline text-on-surface font-semibold">
                </div>
                <div class="col-span-2 sm:col-span-1">
                  <label class="block text-[11px] font-bold text-on-surface mb-1">Full Day</label>
                  <input type="number" id="eh-price-fullday" value="${p.full_day || 180000}" class="w-full p-2 rounded-lg bg-surface-container-low border border-outline text-on-surface font-bold text-secondary">
                </div>
              </div>
            </div>

            <!-- SECTION 4: Facilities & Amenities -->
            <div class="space-y-2">
              <h4 class="font-title-md text-xs font-bold uppercase tracking-wider text-secondary border-b border-outline pb-1.5 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">checklist</span>
                Facilities & Amenities
              </h4>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                ${commonFacilities.map(f => `
                  <label class="flex items-center gap-2 p-2 rounded-lg bg-surface-container-low border border-outline hover:bg-surface-container cursor-pointer">
                    <input type="checkbox" name="eh-facility" value="${f}" class="rounded text-secondary focus:ring-secondary" ${facs.includes(f) ? 'checked' : ''}>
                    <span class="text-xs text-on-surface font-medium">${f}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <!-- SECTION 5: Contact & Privacy Toggles -->
            <div class="space-y-3">
              <h4 class="font-title-md text-xs font-bold uppercase tracking-wider text-secondary border-b border-outline pb-1.5 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">visibility</span>
                Host Contact & Privacy Controls
              </h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block font-bold text-on-surface mb-1">Owner Contact Name</label>
                  <input type="text" id="eh-owner-name" value="${hall.contact?.owner_name || ''}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-medium">
                </div>
                <div>
                  <label class="block font-bold text-on-surface mb-1">Direct Phone</label>
                  <input type="text" id="eh-phone" value="${hall.contact?.phone || ''}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-medium">
                </div>
                <div>
                  <label class="block font-bold text-on-surface mb-1">WhatsApp Number</label>
                  <input type="text" id="eh-whatsapp" value="${hall.contact?.whatsapp || ''}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-medium">
                </div>
              </div>

              <div class="p-3 bg-surface-container-low rounded-xl border border-outline grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="eh-show-avail" class="rounded text-secondary" ${hall.public_availability ? 'checked' : ''}>
                  <span class="text-xs text-on-surface font-semibold">Public Availability Calendar</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="eh-show-phone" class="rounded text-secondary" ${priv.show_phone ? 'checked' : ''}>
                  <span class="text-xs text-on-surface font-semibold">Show Phone on Page</span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="eh-show-wa" class="rounded text-secondary" ${priv.show_whatsapp ? 'checked' : ''}>
                  <span class="text-xs text-on-surface font-semibold">Show WhatsApp on Page</span>
                </label>
              </div>
            </div>

            <!-- Footer Action Buttons -->
            <div class="pt-4 border-t border-outline flex items-center justify-end gap-3 sticky bottom-0 bg-surface-container-lowest">
              <button type="button" onclick="Modals.close()" class="px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs uppercase tracking-wider transition-colors">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2.5 rounded-lg bg-primary hover:bg-inverse-surface text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2">
                <span class="material-symbols-outlined text-[16px]">save</span>
                Save Changes
              </button>
            </div>
          </form>

        </div>
      </div>
    `;
  },

  submitEditHall(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    // Collect checked facilities
    const facilityCheckboxes = document.querySelectorAll('input[name="eh-facility"]:checked');
    const facilities = Array.from(facilityCheckboxes).map(cb => cb.value);

    const updatedData = {
      name: document.getElementById('eh-name').value.trim() || hall.name,
      hall_type: document.getElementById('eh-type').value,
      description: document.getElementById('eh-desc').value.trim(),
      city: document.getElementById('eh-city').value.trim(),
      area: document.getElementById('eh-area').value.trim(),
      cover_image: document.getElementById('eh-cover').value.trim() || hall.cover_image,
      seating_capacity: parseInt(document.getElementById('eh-seating').value, 10) || hall.seating_capacity,
      maximum_capacity: parseInt(document.getElementById('eh-max-capacity').value, 10) || hall.maximum_capacity,
      size_sqft: parseInt(document.getElementById('eh-sqft').value, 10) || hall.size_sqft,
      ac_status: document.getElementById('eh-ac').value,
      pricing: {
        morning: parseInt(document.getElementById('eh-price-morning').value, 10) || 65000,
        afternoon: parseInt(document.getElementById('eh-price-afternoon').value, 10) || 45000,
        evening: parseInt(document.getElementById('eh-price-evening').value, 10) || 85000,
        night: parseInt(document.getElementById('eh-price-night').value, 10) || 70000,
        full_day: parseInt(document.getElementById('eh-price-fullday').value, 10) || 180000
      },
      facilities,
      contact: {
        ...(hall.contact || {}),
        owner_name: document.getElementById('eh-owner-name').value.trim(),
        phone: document.getElementById('eh-phone').value.trim(),
        whatsapp: document.getElementById('eh-whatsapp').value.trim()
      },
      public_availability: document.getElementById('eh-show-avail').checked,
      privacy_settings: {
        show_availability: document.getElementById('eh-show-avail').checked,
        show_phone: document.getElementById('eh-show-phone').checked,
        show_whatsapp: document.getElementById('eh-show-wa').checked,
        show_email: true
      }
    };

    window.appStore.updateHall(hallId, updatedData);
    this.close();
    Toast.success('Specifications Updated', `Changes to "${updatedData.name}" have been saved.`);

    // Refresh view
    if (window.OwnerDashboardView && window.OwnerRouter) {
      window.OwnerRouter.handleRoute();
    }
  },

  // --- 9. Direct / Walk-in Booking Modal for Hall Owners ---
  openWalkinBookingModal(defaultHallId = null) {
    const halls = window.appStore.getHalls();
    const myHalls = halls.filter(h => h.owner_id === 'owner-1' || true);
    if (!myHalls.length) {
      Toast.error('No Venues Found', 'Please add a venue before recording reservations.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    this.init();
    const container = document.getElementById('modal-container');

    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl modal-content border border-outline overflow-hidden">
          
          <div class="flex items-center justify-between p-5 border-b border-outline bg-surface-container-low shrink-0">
            <div>
              <span class="font-label-sm text-[11px] font-bold text-secondary uppercase tracking-widest">Offline Reservation</span>
              <h3 class="font-headline-sm text-lg font-bold text-on-surface mt-0.5">Record Walk-in / Phone Booking</h3>
            </div>
            <button onclick="Modals.close()" class="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form onsubmit="event.preventDefault(); Modals.submitWalkinBooking()" class="p-5 space-y-3.5 text-xs">
            <div>
              <label class="block font-bold text-on-surface mb-1">Select Venue *</label>
              <select id="wb-hall" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-semibold focus:border-secondary outline-none" required>
                ${myHalls.map(h => `
                  <option value="${h.id}" ${h.id === defaultHallId ? 'selected' : ''}>${h.name} (${h.city})</option>
                `).join('')}
              </select>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-on-surface mb-1">Customer Full Name *</label>
                <input type="text" id="wb-customer-name" placeholder="e.g. Ramesh Hegde" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-medium focus:border-secondary outline-none" required>
              </div>
              <div>
                <label class="block font-bold text-on-surface mb-1">Phone Number *</label>
                <input type="tel" id="wb-customer-phone" placeholder="+91 98765 43210" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-medium focus:border-secondary outline-none" required>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-on-surface mb-1">Event Date *</label>
                <input type="date" id="wb-date" value="${todayStr}" min="${todayStr}" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-semibold focus:border-secondary outline-none" required>
              </div>
              <div>
                <label class="block font-bold text-on-surface mb-1">Shift / Slot *</label>
                <select id="wb-slot" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-semibold focus:border-secondary outline-none" required>
                  <option value="Morning (7AM - 2PM)">Morning (7AM - 2PM)</option>
                  <option value="Afternoon (12PM - 5PM)">Afternoon (12PM - 5PM)</option>
                  <option value="Evening (4PM - 11PM)" selected>Evening (4PM - 11PM)</option>
                  <option value="Night (7PM - 1AM)">Night (7PM - 1AM)</option>
                  <option value="Full Day (7AM - 11PM)">Full Day (7AM - 11PM)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block font-bold text-on-surface mb-1">Event Type</label>
                <select id="wb-event-type" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-medium focus:border-secondary outline-none">
                  <option>Wedding & Reception</option>
                  <option>Engagement Ceremony</option>
                  <option>Birthday & Jubilee</option>
                  <option>Corporate Summit</option>
                  <option>Cultural Fest</option>
                </select>
              </div>
              <div>
                <label class="block font-bold text-on-surface mb-1">Guest Count</label>
                <input type="number" id="wb-guests" value="450" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-semibold focus:border-secondary outline-none">
              </div>
              <div>
                <label class="block font-bold text-on-surface mb-1">Agreed Tariff (₹)</label>
                <input type="number" id="wb-amount" value="85000" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-bold text-secondary focus:border-secondary outline-none">
              </div>
            </div>

            <div>
              <label class="block font-bold text-on-surface mb-1">Internal Owner Notes</label>
              <input type="text" id="wb-notes" placeholder="Direct phone booking. 50% advance received offline." class="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline text-on-surface font-medium focus:border-secondary outline-none">
            </div>

            <div class="pt-3 border-t border-outline flex items-center justify-end gap-2.5">
              <button type="button" onclick="Modals.close()" class="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-bold uppercase tracking-wider text-xs">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2 rounded-lg bg-primary hover:bg-inverse-surface text-white font-bold uppercase tracking-wider text-xs shadow-sm flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">lock</span>
                Confirm & Lock Slot
              </button>
            </div>
          </form>

        </div>
      </div>
    `;
  },

  submitWalkinBooking() {
    const hallId = document.getElementById('wb-hall').value;
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    const customerName = document.getElementById('wb-customer-name').value.trim();
    const customerPhone = document.getElementById('wb-customer-phone').value.trim();
    const date = document.getElementById('wb-date').value;
    const slot = document.getElementById('wb-slot').value;
    const eventType = document.getElementById('wb-event-type').value;
    const guests = parseInt(document.getElementById('wb-guests').value, 10) || 100;
    const amount = parseInt(document.getElementById('wb-amount').value, 10) || 50000;
    const notes = document.getElementById('wb-notes').value.trim();

    // Check for conflict
    const isConflict = window.appStore.hasConflictingBooking(hallId, date, slot);
    if (isConflict) {
      const proceed = confirm(`⚠️ Warning: An approved booking already exists for ${hall.name} on ${date} (${slot}). Do you wish to override and double-book?`);
      if (!proceed) return;
    }

    window.appStore.createWalkinBooking({
      hall_id: hall.id,
      hall_name: hall.name,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: 'walkin@customer.direct',
      date,
      slot,
      event_type: eventType,
      guests,
      amount,
      notes: notes || 'Direct offline booking created by hall owner.'
    });

    this.close();
    Toast.success('Walk-in Booking Confirmed', `Slot ${slot} on ${date} is now locked for ${customerName}.`);

    if (window.OwnerRouter) {
      window.OwnerRouter.handleRoute();
    }
  },

  // --- Owner Date Range Blockout Modal ---
  openBlockRangeModal(hallId, defaultDate = '') {
    this.init();
    const hall = window.appStore.getHallById(hallId) || window.appStore.getHalls()[0];
    if (!hall) return;

    const today = new Date().toISOString().split('T')[0];
    const startDate = defaultDate || today;

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl modal-content border border-surface-container overflow-hidden">
          
          <div class="p-6 pb-4 border-b border-surface-container bg-surface-container-low flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-error/10 text-error flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">block</span>
              </span>
              <div>
                <span class="font-label-sm text-[11px] font-bold text-error uppercase tracking-widest">Date Blockout</span>
                <h3 class="font-headline-sm text-base font-bold text-on-surface">${hall.name}</h3>
              </div>
            </div>
            <button onclick="Modals.close()" class="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form class="p-6 space-y-4" onsubmit="event.preventDefault(); Modals.submitBlockRange('${hall.id}')">
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Block availability for maintenance, family functions, or offline reservations. Blocked slots will appear unavailable to prospective guests on the customer site.
            </p>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Start Date *</label>
                <input type="date" id="blk-start" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold focus:border-secondary outline-none" value="${startDate}" min="${today}" required>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">End Date *</label>
                <input type="date" id="blk-end" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold focus:border-secondary outline-none" value="${startDate}" min="${startDate}" required>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Shifts to Block *</label>
              <select id="blk-shift" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold focus:border-secondary outline-none">
                <option value="all" selected>All Shifts (Full Day Blockout)</option>
                <option value="Morning">Morning (7AM - 2PM) Only</option>
                <option value="Afternoon">Afternoon (12PM - 4PM) Only</option>
                <option value="Evening">Evening (4PM - 11PM) Only</option>
                <option value="Night">Night (7PM - 1AM) Only</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Reason for Blockout *</label>
              <input type="text" id="blk-reason" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold focus:border-secondary outline-none" placeholder="e.g. Annual Maintenance & Painting" value="Proprietor Maintenance" required>
              <div class="flex items-center gap-1.5 flex-wrap mt-2">
                <span class="text-[10px] text-on-surface-variant font-medium">Suggestions:</span>
                ${['Annual Maintenance', 'Private Family Event', 'VIP Booking Hold', 'Deep Cleaning & Audio Overhaul'].map(s => `
                  <button type="button" onclick="document.getElementById('blk-reason').value = '${s}'" class="text-[10px] px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors border border-outline">
                    ${s}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="pt-2 flex items-center justify-end gap-2 border-t border-surface-container">
              <button type="button" onclick="Modals.close()" class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container rounded-lg">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2.5 bg-error text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-error/90 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">lock</span>
                <span>Confirm Blockout</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    `;
  },

  submitBlockRange(hallId) {
    const start = document.getElementById('blk-start')?.value;
    const end = document.getElementById('blk-end')?.value;
    const shift = document.getElementById('blk-shift')?.value || 'all';
    const reason = document.getElementById('blk-reason')?.value?.trim() || 'Proprietor Blockout';

    if (!start || !end) {
      Toast.error('Dates Required', 'Please select both start and end dates.');
      return;
    }
    if (new Date(end) < new Date(start)) {
      Toast.error('Invalid Date Range', 'End date cannot be earlier than start date.');
      return;
    }

    window.appStore.blockDateRange(start, end, reason, hallId, shift);
    this.close();
    Toast.success('Dates Blocked', `Availability blocked from ${start} to ${end}.`);

    if (window.OwnerDashboardView) {
      const container = document.getElementById('app-content');
      if (container) container.innerHTML = window.OwnerDashboardView.render();
    }
  },

  // --- Owner Peak / Festival Tariff Modal ---
  openPeakPricingModal(hallId, defaultDate = '') {
    this.init();
    const hall = window.appStore.getHallById(hallId) || window.appStore.getHalls()[0];
    if (!hall) return;

    const today = new Date().toISOString().split('T')[0];
    const startDate = defaultDate || today;

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl modal-content border border-surface-container overflow-hidden">
          
          <div class="p-6 pb-4 border-b border-surface-container bg-surface-container-low flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">trending_up</span>
              </span>
              <div>
                <span class="font-label-sm text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Surge & Peak Pricing</span>
                <h3 class="font-headline-sm text-base font-bold text-on-surface">${hall.name}</h3>
              </div>
            </div>
            <button onclick="Modals.close()" class="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form class="p-6 space-y-4" onsubmit="event.preventDefault(); Modals.submitPeakPricing('${hall.id}')">
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Configure premium festival rates, auspicious wedding muhurat surge, or seasonal holiday tariffs across specific date windows.
            </p>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Start Date *</label>
                <input type="date" id="pk-start" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold focus:border-secondary outline-none" value="${startDate}" min="${today}" required>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">End Date *</label>
                <input type="date" id="pk-end" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold focus:border-secondary outline-none" value="${startDate}" min="${startDate}" required>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Rate Surge Multiplier *</label>
              <div class="grid grid-cols-3 gap-2">
                <label class="p-2.5 rounded-xl border border-surface-container bg-surface-container-low hover:bg-surface-container cursor-pointer flex flex-col items-center text-center">
                  <input type="radio" name="pk-mult" value="1.15" class="sr-only peer">
                  <span class="font-bold text-sm text-on-surface peer-checked:text-secondary">+15%</span>
                  <span class="text-[10px] text-on-surface-variant">High Season</span>
                </label>
                <label class="p-2.5 rounded-xl border border-secondary bg-secondary-fixed/30 cursor-pointer flex flex-col items-center text-center">
                  <input type="radio" name="pk-mult" value="1.25" class="sr-only peer" checked>
                  <span class="font-bold text-sm text-secondary font-black">+25%</span>
                  <span class="text-[10px] text-secondary font-semibold">Auspicious</span>
                </label>
                <label class="p-2.5 rounded-xl border border-surface-container bg-surface-container-low hover:bg-surface-container cursor-pointer flex flex-col items-center text-center">
                  <input type="radio" name="pk-mult" value="1.50" class="sr-only peer">
                  <span class="font-bold text-sm text-on-surface peer-checked:text-secondary">+50%</span>
                  <span class="text-[10px] text-on-surface-variant">Festival / NYE</span>
                </label>
              </div>
            </div>

            <div class="p-3 bg-surface-container-low rounded-xl border border-outline text-xs text-on-surface-variant">
              💡 The updated tariff will be displayed directly on the customer storefront calendar and applied to all incoming hold deposits.
            </div>

            <div class="pt-2 flex items-center justify-end gap-2 border-t border-surface-container">
              <button type="button" onclick="Modals.close()" class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container rounded-lg">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2.5 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-secondary/90 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">price_check</span>
                <span>Apply Peak Tariff</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    `;
  },

  submitPeakPricing(hallId) {
    const start = document.getElementById('pk-start')?.value;
    const end = document.getElementById('pk-end')?.value;
    const multEl = document.querySelector('input[name="pk-mult"]:checked');
    const multiplier = multEl ? parseFloat(multEl.value) : 1.25;

    if (!start || !end) {
      Toast.error('Dates Required', 'Please select both start and end dates.');
      return;
    }
    if (new Date(end) < new Date(start)) {
      Toast.error('Invalid Date Range', 'End date cannot be earlier than start date.');
      return;
    }

    window.appStore.setPeakTariffRange(start, end, multiplier, hallId);
    this.close();
    Toast.success('Peak Tariff Applied', `Set ${Math.round((multiplier - 1) * 100)}% surge for ${start} to ${end}.`);

    if (window.OwnerDashboardView) {
      const container = document.getElementById('app-content');
      if (container) container.innerHTML = window.OwnerDashboardView.render();
    }
  },

  // --- Owner Date Range Unblock Modal ---
  openUnblockRangeModal(hallId, defaultDate = '') {
    this.init();
    const hall = window.appStore.getHallById(hallId) || window.appStore.getHalls()[0];
    if (!hall) return;

    const today = new Date().toISOString().split('T')[0];
    const startDate = defaultDate || today;

    const container = document.getElementById('modal-container');
    container.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) Modals.close()">
        <div class="bg-surface-container-lowest max-w-lg w-full rounded-2xl shadow-2xl modal-content border border-surface-container overflow-hidden">
          
          <div class="p-6 pb-4 border-b border-surface-container bg-surface-container-low flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-status-available-bg text-status-available flex items-center justify-center">
                <span class="material-symbols-outlined text-[20px]">lock_open</span>
              </span>
              <div>
                <span class="font-label-sm text-[11px] font-bold text-status-available uppercase tracking-widest">Restore Availability</span>
                <h3 class="font-headline-sm text-base font-bold text-on-surface">${hall.name}</h3>
              </div>
            </div>
            <button onclick="Modals.close()" class="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <form class="p-6 space-y-4" onsubmit="event.preventDefault(); Modals.submitUnblockRange('${hall.id}')">
            <p class="text-xs text-on-surface-variant leading-relaxed">
              Remove blockouts and restore standard open availability on the customer website for this date window.
            </p>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">Start Date *</label>
                <input type="date" id="ubk-start" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold focus:border-secondary outline-none" value="${startDate}" min="${today}" required>
              </div>
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-on-surface mb-1">End Date *</label>
                <input type="date" id="ubk-end" class="w-full p-2.5 rounded-lg bg-surface-container-low border border-surface-container text-xs text-on-surface font-semibold focus:border-secondary outline-none" value="${startDate}" min="${startDate}" required>
              </div>
            </div>

            <div class="pt-2 flex items-center justify-end gap-2 border-t border-surface-container">
              <button type="button" onclick="Modals.close()" class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:bg-surface-container rounded-lg">
                Cancel
              </button>
              <button type="submit" class="px-5 py-2.5 bg-status-available text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-status-available/90 flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[16px]">check_circle</span>
                <span>Restore Availability</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    `;
  },

  submitUnblockRange(hallId) {
    const start = document.getElementById('ubk-start')?.value;
    const end = document.getElementById('ubk-end')?.value;

    if (!start || !end) {
      Toast.error('Dates Required', 'Please select both start and end dates.');
      return;
    }
    if (new Date(end) < new Date(start)) {
      Toast.error('Invalid Date Range', 'End date cannot be earlier than start date.');
      return;
    }

    window.appStore.unblockDateRange(start, end, hallId, 'all');
    this.close();
    Toast.success('Availability Restored', `Unlocked dates from ${start} to ${end}.`);

    if (window.OwnerDashboardView) {
      const container = document.getElementById('app-content');
      if (container) container.innerHTML = window.OwnerDashboardView.render();
    }
  }
};

window.Modals = Modals;
