// VenueLuxe Admin Dashboard & Verification Center
// Meets requirements for Super Admin governance, review workflows, and mobile responsiveness

const AdminDashboardView = {
  currentTab: 'queue', // 'queue', 'all_halls', 'audit', 'reports'

  render() {
    const halls = window.appStore.getHalls();
    const pendingHalls = halls.filter(h => h.status === 'PENDING_APPROVAL');
    const liveHalls = halls.filter(h => h.status === 'LIVE');
    const suspendedHalls = halls.filter(h => h.status === 'SUSPENDED');
    const bookings = window.appStore.getBookings();
    const users = window.appStore.getUsers();
    const auditLogs = window.appStore.getAuditLogs();
    const reports = window.appStore.getReports();
    const allReports = reports;
    const openReports = allReports.filter(r => r.status !== 'RESOLVED');
    const resolvedReports = allReports.filter(r => r.status === 'RESOLVED');

    return `
      <div class="flex flex-col w-full min-h-[calc(100vh-5rem)] bg-surface py-6 md:py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
          
          <!-- Admin Verification Center Header -->
          <div class="bg-primary text-on-primary p-6 md:p-8 rounded-2xl shadow-sm border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-wider">
                  Platform Moderation
                </span>
                <span class="text-xs text-stone-300">• Venue Verification Center</span>
              </div>
              <h1 class="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Admin Dashboard & Verification Center
              </h1>
              <p class="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
                Review submitted venues, audit capacity certifications and safety compliance, manage live listings, and address safety reports.
              </p>
            </div>
          </div>

          <!-- Urgent Governance Action Bar (if items pending) -->
          ${(pendingHalls.length > 0 || openReports.length > 0) ? `
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[20px]">priority_high</span>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-amber-900 uppercase tracking-wider">Urgent Attention Required</h4>
                  <p class="text-xs text-amber-800 mt-0.5">
                    <strong>${pendingHalls.length} venue(s)</strong> awaiting publication audit & <strong>${openReports.length} open safety report(s)</strong> logged.
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 self-end sm:self-auto">
                ${pendingHalls.length > 0 ? `
                  <button onclick="AdminDashboardView.setTab('queue')" class="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors">
                    Review Queue (${pendingHalls.length})
                  </button>
                ` : ''}
                ${openReports.length > 0 ? `
                  <button onclick="AdminDashboardView.setTab('reports')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors">
                    View Reports (${openReports.length})
                  </button>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <!-- KPI Metric Cards -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            
            <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div class="flex items-center justify-between text-stone-500 mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider">Total Users</span>
                <span class="material-symbols-outlined text-[18px]">group</span>
              </div>
              <div class="font-display text-2xl font-bold text-stone-900">${users.length}</div>
              <p class="text-[11px] text-stone-500 mt-0.5">Registered accounts</p>
            </div>

            <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div class="flex items-center justify-between text-stone-500 mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider">Hall Hosts</span>
                <span class="material-symbols-outlined text-[18px]">badge</span>
              </div>
              <div class="font-display text-2xl font-bold text-stone-900">${new Set(halls.map(h => h.owner_id || h.ownerId).filter(Boolean)).size || 1}</div>
              <p class="text-[11px] text-stone-500 mt-0.5">Active proprietors</p>
            </div>

            <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div class="flex items-center justify-between text-stone-500 mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider">Total Halls</span>
                <span class="material-symbols-outlined text-[18px]">corporate_fare</span>
              </div>
              <div class="font-display text-2xl font-bold text-stone-900">${halls.length}</div>
              <p class="text-[11px] text-stone-500 mt-0.5">${liveHalls.length} live in catalog</p>
            </div>

            <div class="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
              <div class="flex items-center justify-between text-amber-800 mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider">Pending Review</span>
                <span class="material-symbols-outlined text-[18px]">verified</span>
              </div>
              <div class="font-display text-2xl font-bold text-amber-900">${pendingHalls.length}</div>
              <p class="text-[11px] text-amber-700 font-semibold mt-0.5">Verification queue</p>
            </div>

            <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div class="flex items-center justify-between text-stone-500 mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider">Bookings</span>
                <span class="material-symbols-outlined text-[18px]">calendar_today</span>
              </div>
              <div class="font-display text-2xl font-bold text-stone-900">${bookings.length}</div>
              <p class="text-[11px] text-emerald-700 font-semibold mt-0.5">${bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'APPROVED').length} active holds</p>
            </div>

            <div class="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
              <div class="flex items-center justify-between text-rose-600 mb-1">
                <span class="text-[11px] font-bold uppercase tracking-wider">Safety Reports</span>
                <span class="material-symbols-outlined text-[18px]">report</span>
              </div>
              <div class="font-display text-2xl font-bold text-rose-700">${reports.length}</div>
              <p class="text-[11px] text-stone-500 mt-0.5">${reports.length === 0 ? 'All clear' : 'Requires review'}</p>
            </div>

          </div>

          <!-- Moderation Queue Tabs with Badges -->
          <div class="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto" role="tablist">
            <button 
              role="tab"
              aria-selected="${this.currentTab === 'queue'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'queue' ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:text-stone-900'}" 
              onclick="AdminDashboardView.setTab('queue')">
              <span>Verification Queue</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'queue' ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-800'}">
                ${pendingHalls.length}
              </span>
            </button>

            <button 
              role="tab"
              aria-selected="${this.currentTab === 'all_halls'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'all_halls' ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:text-stone-900'}" 
              onclick="AdminDashboardView.setTab('all_halls')">
              <span>All Venues</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'all_halls' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-800'}">
                ${halls.length}
              </span>
            </button>

            <button 
              role="tab"
              aria-selected="${this.currentTab === 'audit'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'audit' ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:text-stone-900'}" 
              onclick="AdminDashboardView.setTab('audit')">
              <span>Audit Log</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'audit' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-800'}">
                ${auditLogs.length}
              </span>
            </button>

            <button 
              role="tab"
              aria-selected="${this.currentTab === 'reports'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'reports' ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:text-stone-900'}" 
              onclick="AdminDashboardView.setTab('reports')">
              <span>Safety & Complaints</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'reports' ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-800'}">
                ${reports.length}
              </span>
            </button>

            <button 
              role="tab"
              aria-selected="${this.currentTab === 'bookings'}"
              class="px-4 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center gap-2 shrink-0 min-h-[44px] ${this.currentTab === 'bookings' ? 'bg-primary text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:text-stone-900'}" 
              onclick="AdminDashboardView.setTab('bookings')">
              <span class="material-symbols-outlined text-[16px]">visibility</span>
              <span>All Bookings (Info)</span>
              <span class="px-1.5 py-0.5 rounded-full text-[10px] ${this.currentTab === 'bookings' ? 'bg-stone-800 text-white' : 'bg-stone-200 text-stone-800'}">
                ${bookings.length}
              </span>
            </button>
          </div>

          <!-- TAB 1: PENDING VERIFICATION QUEUE -->
          ${this.currentTab === 'queue' ? `
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
                <div>
                  <span class="text-xs uppercase tracking-widest text-secondary font-bold">Compliance Gate</span>
                  <h2 class="font-display text-lg sm:text-xl font-bold text-stone-900">Pending Verification Queue</h2>
                </div>
                <span class="text-xs text-stone-500">Only verified listings are published to the public search directory</span>
              </div>

              ${pendingHalls.length === 0 ? `
                <div class="py-12 px-4 text-center bg-stone-50 rounded-xl border border-dashed border-stone-300">
                  <div class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <span class="material-symbols-outlined text-[26px]">verified</span>
                  </div>
                  <p class="font-bold text-sm text-stone-900 mt-3">All Submissions Audited!</p>
                  <p class="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                    No pending venue onboarding submissions are waiting. New venue requests submitted by owners will appear here.
                  </p>
                </div>
              ` : `
                <!-- Desktop Table (>= 768px) -->
                <div class="hidden md:block overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="bg-stone-50 text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                        <th class="p-3 rounded-l-lg">Venue &amp; Host</th>
                        <th class="p-3">Phone &amp; Field Coordination</th>
                        <th class="p-3">Physical Location</th>
                        <th class="p-3">Field Inspection</th>
                        <th class="p-3">Official Website</th>
                        <th class="p-3">Listing Fee</th>
                        <th class="p-3 text-right rounded-r-lg">Audit Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                      ${pendingHalls.map(hall => {
                        const v = hall.physical_verification || {};
                        const hasInspected = (v.status === 'VERIFIED');
                        const hasWebsite = Boolean(hall.website_verified && hall.website);
                        const hasFee = Boolean(hall.listing_fee_paid);

                        return `
                        <tr class="hover:bg-stone-50/70 transition-colors">
                          <td class="p-3 text-stone-900">
                            <div class="font-bold line-clamp-1">${hall.name}</div>
                            <div class="text-[11px] text-stone-500">${hall.hall_type} • ${hall.contact?.owner_name || 'Proprietor'}</div>
                          </td>
                          <td class="p-3 text-stone-900">
                            <div class="flex items-center gap-1.5">
                              <span class="font-mono font-bold text-xs">${hall.contact?.phone || '+91 82582 29988'}</span>
                              <a href="tel:${hall.contact?.phone || '+918258229988'}" class="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700" title="Call">
                                <span class="material-symbols-outlined text-[13px]">call</span>
                              </a>
                              <a href="https://wa.me/${hall.contact?.phone ? hall.contact.phone.replace(/[^0-9]/g, '') : '918258229988'}" target="_blank" class="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200" title="WhatsApp">
                                <span class="material-symbols-outlined text-[13px]">chat</span>
                              </a>
                            </div>
                          </td>
                          <td class="p-3 text-stone-700">
                            <div class="line-clamp-1">${hall.address || hall.area + ', ' + hall.city}</div>
                            <a href="https://maps.google.com/?q=${hall.latitude || 13.2185},${hall.longitude || 74.9983}" target="_blank" class="text-secondary font-bold text-[11px] hover:underline flex items-center gap-0.5 mt-0.5">
                              <span>Map Pin</span>
                              <span class="material-symbols-outlined text-[12px]">open_in_new</span>
                            </a>
                          </td>
                          <td class="p-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hasInspected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                              ${hasInspected ? '✅ Verified' : '⏳ Visit Needed'}
                            </span>
                          </td>
                          <td class="p-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hasWebsite ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}">
                              ${hasWebsite ? '🌐 Verified' : '⚠️ Missing'}
                            </span>
                          </td>
                          <td class="p-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hasFee ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}">
                              ${hasFee ? '🌟 Paid' : '📄 Unpaid'}
                            </span>
                          </td>
                          <td class="p-3 text-right">
                            <div class="flex items-center justify-end gap-1.5">
                              <button 
                                class="px-3 py-1.5 bg-primary text-white hover:bg-inverse-surface rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                                onclick="AdminDashboardView.openReviewModal('${hall.id}')">
                                <span class="material-symbols-outlined text-[14px]">checklist</span>
                                <span>Audit &amp; Verify</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>

                <!-- Mobile Moderation Stacked Cards (< 768px) -->
                <div class="md:hidden space-y-4">
                  ${pendingHalls.map(hall => `
                    <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                      <div class="flex items-start gap-3">
                        <img 
                          src="${hall.cover_image}" 
                          class="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
                          onerror="this.src=window.appStore.getPlaceholderImage('Venue')">
                        <div class="flex-1 min-w-0">
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 inline-block mb-1">
                            Pending Review
                          </span>
                          <h3 class="font-bold text-sm text-stone-900 truncate">${hall.name}</h3>
                          <p class="text-xs text-stone-500">${hall.hall_type} • ${hall.city}</p>
                        </div>
                      </div>

                      <div class="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-200">
                        <div>
                          <span class="text-stone-500 block text-[10px] uppercase">Capacity:</span>
                          <span class="font-semibold text-stone-900">${hall.seating_capacity} Sit / ${hall.maximum_capacity} Max</span>
                        </div>
                        <div>
                          <span class="text-stone-500 block text-[10px] uppercase">Tariff:</span>
                          <span class="font-bold text-stone-900">₹${(hall.pricing?.evening || 75000).toLocaleString()}</span>
                        </div>
                        <div>
                          <span class="text-stone-500 block text-[10px] uppercase">Host:</span>
                          <span class="font-semibold text-stone-900 truncate">${hall.contact?.owner_name || 'Host'}</span>
                        </div>
                        <div>
                          <span class="text-stone-500 block text-[10px] uppercase">Phone:</span>
                          <span class="font-mono text-stone-900">${hall.contact?.phone || '+91 82582 29988'}</span>
                        </div>
                      </div>

                      <div class="flex flex-col gap-2 pt-1">
                        <button 
                          class="w-full py-2.5 bg-stone-200 text-stone-800 rounded-lg text-xs font-bold hover:bg-stone-300 transition-colors min-h-[44px]"
                          onclick="AdminDashboardView.openReviewModal('${hall.id}')">
                          Review Full Venue Details
                        </button>
                        <div class="flex items-center gap-2">
                          <button 
                            class="flex-1 py-2.5 bg-emerald-700 text-white rounded-lg text-xs font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-1 min-h-[44px]"
                            onclick="AdminDashboardView.approveListing('${hall.id}')">
                            <span class="material-symbols-outlined text-[16px]">check</span> Approve & Publish
                          </button>
                          <button 
                            class="px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors min-h-[44px]"
                            onclick="AdminDashboardView.rejectListing('${hall.id}')">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>
          ` : ''}

          <!-- TAB 2: MASTER HALL INVENTORY -->
          ${this.currentTab === 'all_halls' ? `
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <span class="text-xs uppercase tracking-widest text-secondary font-bold">Platform Master Registry</span>
                  <h2 class="font-display text-lg sm:text-xl font-bold text-stone-900">Complete Venue Oversight</h2>
                </div>
                <button 
                  class="px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors self-start sm:self-auto min-h-[44px]" 
                  onclick="Modals.openAddHallWizard()">
                  + Direct Add Hall (Admin Override)
                </button>
              </div>

              <!-- Desktop Table -->
              <div class="hidden md:block overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr class="bg-stone-50 text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                      <th class="p-3 rounded-l-lg">Venue Name</th>
                      <th class="p-3">Location</th>
                      <th class="p-3">Capacity & Specs</th>
                      <th class="p-3">Showcase Tier</th>
                      <th class="p-3">Listing State</th>
                      <th class="p-3 text-right rounded-r-lg">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100">
                    ${halls.map(h => {
                      const isPaid = (h.listing_fee_paid === true || h.listing_tier === 'PREMIUM');
                      const customerUrl = AdminDashboardView.getCustomerHallUrl(h.id);
                      return `
                        <tr class="hover:bg-stone-50/70 transition-colors">
                          <td class="p-3 font-bold text-stone-900">
                            <div class="flex items-center gap-3">
                              <img 
                                src="${h.cover_image}" 
                                class="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                                onerror="this.src=window.appStore.getPlaceholderImage('Venue')">
                              <div>
                                <div class="font-semibold line-clamp-1">${h.name}</div>
                                <div class="text-[10px] text-stone-400 font-mono">${h.id}</div>
                              </div>
                            </div>
                          </td>
                          <td class="p-3 text-stone-700">${h.city}, ${h.area || ''}</td>
                          <td class="p-3 text-stone-700">
                            <div class="font-semibold">${h.seating_capacity || 0} Sit / ${h.maximum_capacity || 0} Max</div>
                            <div class="text-[11px] text-stone-500">${(h.size_sqft || 0).toLocaleString()} sq ft</div>
                          </td>
                          <td class="p-3">
                            ${isPaid ? `
                              <div class="space-y-1">
                                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                                  <span class="material-symbols-outlined text-[13px] text-emerald-600">star</span>
                                  <span>Premium Showcase</span>
                                </span>
                                <div class="text-[10px] text-stone-400 font-mono">Ref: ${h.listing_fee_receipt || 'PAID'}</div>
                              </div>
                            ` : `
                              <div class="space-y-1">
                                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-semibold border border-stone-200">
                                  Directory (Unpaid)
                                </span>
                                <button 
                                  class="block px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-[10px] font-bold transition-colors shadow-xs"
                                  onclick="AdminDashboardView.promptUpgradeToPremium('${h.id}')"
                                  title="Owner paid later? Click to upgrade this venue to Premium and restore full features.">
                                  ★ Upgrade to Premium
                                </button>
                              </div>
                            `}
                          </td>
                          <td class="p-3">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${h.status === 'LIVE' ? 'bg-emerald-700 text-white' : (h.status === 'PENDING_APPROVAL' ? 'bg-amber-600 text-white' : 'bg-stone-600 text-white')}">
                              ${h.status}
                            </span>
                          </td>
                          <td class="p-3 text-right">
                            <div class="flex items-center justify-end gap-1.5">
                              <!-- View Venue Details & Specifications Modal -->
                              <button 
                                class="p-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors" 
                                onclick="AdminDashboardView.openVenueInspectionModal('${h.id}')" 
                                title="Inspect Venue Specifications & Full Records">
                                <span class="material-symbols-outlined text-[16px]">visibility</span>
                              </button>

                              <!-- Direct Customer View Link -->
                              <a 
                                href="${customerUrl}" 
                                target="_blank" 
                                class="p-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition-colors" 
                                title="Open Live Customer View (New Tab)">
                                <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                              </a>

                              ${h.status === 'LIVE' ? `
                                <button class="px-2.5 py-1.5 bg-stone-100 text-amber-800 hover:bg-amber-100 rounded-lg text-[11px] font-bold transition-colors" onclick="AdminDashboardView.suspendListing('${h.id}')">
                                  Suspend
                                </button>
                              ` : `
                                <button class="px-2.5 py-1.5 bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg text-[11px] font-bold transition-colors" onclick="AdminDashboardView.restoreListing('${h.id}')">
                                  Restore
                                </button>
                              `}

                              <button class="p-2 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors" onclick="AdminDashboardView.deleteListing('${h.id}')" title="Delete Venue">
                                <span class="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Mobile Master Hall Cards -->
              <div class="md:hidden space-y-3">
                ${halls.map(h => {
                  const isPaid = (h.listing_fee_paid === true || h.listing_tier === 'PREMIUM');
                  const customerUrl = AdminDashboardView.getCustomerHallUrl(h.id);
                  return `
                    <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                      <div class="flex items-center gap-3">
                        <img 
                          src="${h.cover_image}" 
                          class="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                          onerror="this.src=window.appStore.getPlaceholderImage('Venue')">
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${h.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}">
                              ${h.status}
                            </span>
                            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}">
                              ${isPaid ? '★ PREMIUM' : 'DIRECTORY'}
                            </span>
                          </div>
                          <h4 class="font-bold text-sm text-stone-900 truncate mt-1">${h.name}</h4>
                          <p class="text-xs text-stone-500">${h.city} • ${h.seating_capacity || 0} seats</p>
                        </div>
                      </div>

                      ${!isPaid ? `
                        <div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
                          <span class="text-[11px] text-amber-900 font-medium">Non-Paying Directory</span>
                          <button 
                            class="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold transition-colors"
                            onclick="AdminDashboardView.promptUpgradeToPremium('${h.id}')">
                            ★ Upgrade to Premium
                          </button>
                        </div>
                      ` : ''}

                      <div class="flex items-center justify-between pt-2 border-t border-stone-200 text-xs gap-2">
                        <div class="flex items-center gap-1.5">
                          <button onclick="AdminDashboardView.openVenueInspectionModal('${h.id}')" class="px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-bold text-stone-700 flex items-center gap-1">
                            <span class="material-symbols-outlined text-[15px]">visibility</span>
                            <span>Inspect</span>
                          </button>
                          <a href="${customerUrl}" target="_blank" class="p-1.5 bg-white border border-stone-300 rounded-lg text-stone-700" title="Open Customer View">
                            <span class="material-symbols-outlined text-[15px]">open_in_new</span>
                          </a>
                        </div>
                        <div class="flex items-center gap-1.5">
                          ${h.status === 'LIVE' ? `
                            <button class="px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg font-bold" onclick="AdminDashboardView.suspendListing('${h.id}')">
                              Suspend
                            </button>
                          ` : `
                            <button class="px-3 py-1.5 bg-emerald-700 text-white rounded-lg font-bold" onclick="AdminDashboardView.restoreListing('${h.id}')">
                              Restore
                            </button>
                          `}
                          <button class="p-1.5 text-rose-700 hover:bg-rose-50 rounded-lg" onclick="AdminDashboardView.deleteListing('${h.id}')">
                            <span class="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- TAB 3: ADMIN AUDIT LOG -->
          ${this.currentTab === 'audit' ? `
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span class="text-xs uppercase tracking-widest text-secondary font-bold">Platform Governance</span>
                  <h2 class="font-display text-lg sm:text-xl font-bold text-stone-900">Administrative Audit Log</h2>
                </div>
                <span class="text-xs text-stone-500">${auditLogs.length} Events Logged</span>
              </div>

              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs border-collapse min-w-[650px]">
                  <thead>
                    <tr class="bg-stone-50 text-stone-600 text-[11px] font-bold uppercase tracking-wider border-b border-stone-200">
                      <th class="p-3 rounded-l-lg">Timestamp</th>
                      <th class="p-3">Operator</th>
                      <th class="p-3">Action Executed</th>
                      <th class="p-3">Target Entity</th>
                      <th class="p-3 rounded-r-lg">Details</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-stone-100">
                    ${auditLogs.map(l => `
                      <tr class="hover:bg-stone-50/70 transition-colors">
                        <td class="p-3 text-stone-500 whitespace-nowrap">${l.date}</td>
                        <td class="p-3 font-semibold text-stone-900">${l.admin_name}</td>
                        <td class="p-3 font-bold text-secondary">${l.action}</td>
                        <td class="p-3 font-semibold text-stone-900">${l.affected_record}</td>
                        <td class="p-3 text-stone-600">${l.details}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}

          <!-- TAB 4: REPORTS & COMPLAINTS -->
          ${this.currentTab === 'reports' ? `
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span class="text-xs uppercase tracking-widest text-rose-700 font-bold">Trust & Safety</span>
                  <h2 class="font-display text-lg sm:text-xl font-bold text-stone-900">Flagged Customer Complaints</h2>
                </div>
                <span class="text-xs text-stone-500 font-medium">${openReports.length} Open Reports</span>
              </div>

              ${openReports.length === 0 ? `
                <div class="py-12 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200 space-y-2">
                  <span class="material-symbols-outlined text-[32px] text-emerald-600">verified</span>
                  <p class="text-xs font-bold text-stone-700">All Clear — No Open Safety Complaints</p>
                  <p class="text-[11px] text-stone-500">Active listings are compliant with safety and listing policies.</p>
                </div>
              ` : `
                <div class="space-y-3">
                  ${openReports.map(r => {
                    const venue = window.appStore.getHallById(r.hall_id) || window.appStore.getHalls().find(h => h.name === r.hall_name);
                    const isSuspended = venue && venue.status === 'SUSPENDED';
                    const targetHallId = venue ? venue.id : (r.hall_id || '');
                    return `
                      <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div class="space-y-1">
                          <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold uppercase">${r.reason}</span>
                            <span class="font-bold text-xs text-stone-900">${r.hall_name}</span>
                            ${isSuspended ? `
                              <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                                Venue Suspended
                              </span>
                            ` : `
                              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                Venue Active (Live)
                              </span>
                            `}
                            <span class="text-[11px] text-stone-500">• Reported by ${r.reporter_name} on ${r.date || 'Recent'}</span>
                          </div>
                          <p class="text-xs text-stone-600 leading-relaxed">${r.details}</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0 self-end md:self-auto flex-wrap">
                          ${targetHallId ? `
                            <button 
                              class="p-2 bg-white hover:bg-stone-200 text-stone-700 text-xs rounded-lg border border-stone-300 transition-colors"
                              onclick="AdminDashboardView.openVenueInspectionModal('${targetHallId}')"
                              title="Inspect Venue Specifications">
                              <span class="material-symbols-outlined text-[16px]">visibility</span>
                            </button>
                          ` : ''}
                          <button 
                            class="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition-colors min-h-[38px]" 
                            onclick="AdminDashboardView.dismissReport('${r.id}')">
                            Dismiss Ticket
                          </button>
                          ${!isSuspended ? `
                            <button 
                              class="px-3.5 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg transition-colors min-h-[38px] flex items-center gap-1 shadow-xs" 
                              onclick="AdminDashboardView.suspendFromReport('${r.id}', '${targetHallId}')">
                              <span class="material-symbols-outlined text-[15px]">block</span>
                              <span>Suspend Venue</span>
                            </button>
                          ` : `
                            <button 
                              class="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 text-xs font-bold rounded-lg min-h-[38px] cursor-not-allowed opacity-90"
                              disabled>
                              Already Suspended
                            </button>
                          `}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}

              <!-- Resolved Complaints Archive -->
              ${resolvedReports.length > 0 ? `
                <div class="pt-4 border-t border-stone-200 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-stone-700">Resolved Complaints History (${resolvedReports.length})</span>
                  </div>
                  <div class="space-y-2 opacity-80">
                    ${resolvedReports.slice(0, 5).map(r => `
                      <div class="p-3 bg-stone-100/70 rounded-lg border border-stone-200 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <span class="font-bold text-stone-800">${r.hall_name}</span>
                          <span class="text-stone-500">• ${r.reason}</span>
                          <div class="text-[11px] text-emerald-800 font-medium mt-0.5">✓ ${r.resolution || 'Resolved by administrator'}</div>
                        </div>
                        <span class="px-2 py-0.5 rounded bg-stone-200 text-stone-600 text-[10px] font-bold uppercase">
                          Resolved
                        </span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

            </div>
          ` : ''}

          <!-- TAB 5: ALL BOOKINGS (READ-ONLY OVERSIGHT) -->
          ${this.currentTab === 'bookings' ? `
            <div class="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs uppercase tracking-widest text-secondary font-bold">Platform Oversight</span>
                    <span class="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-bold uppercase tracking-wider border border-stone-200">Read-Only</span>
                  </div>
                  <h2 class="font-display text-lg sm:text-xl font-bold text-stone-900 mt-0.5">All Platform Bookings & Inquiries</h2>
                </div>
                <div class="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800 flex items-center gap-2 max-w-md">
                  <span class="material-symbols-outlined text-[18px] text-amber-600 shrink-0">info</span>
                  <span><strong>Informational Panel:</strong> Pricing and booking approvals are handled directly between hall owners and customers.</span>
                </div>
              </div>

              ${bookings.length === 0 ? `
                <div class="py-12 text-center bg-stone-50 rounded-xl border border-dashed border-stone-200">
                  <span class="material-symbols-outlined text-[32px] text-stone-400">calendar_today</span>
                  <p class="text-xs text-stone-500 mt-2">No bookings recorded on the platform yet.</p>
                </div>
              ` : `
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr class="border-b border-stone-200 text-stone-400 font-semibold uppercase tracking-wider text-[10px] bg-stone-50/50">
                        <th class="py-3 px-3">Ref ID</th>
                        <th class="py-3 px-3">Customer Details</th>
                        <th class="py-3 px-3">Hall Name</th>
                        <th class="py-3 px-3">Date & Shift</th>
                        <th class="py-3 px-3">Event Details</th>
                        <th class="py-3 px-3">Status</th>
                        <th class="py-3 px-3">Created</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-stone-100">
                      ${bookings.map(b => {
                        const statusColors = {
                          'APPROVED': 'bg-emerald-100 text-emerald-800 border-emerald-300',
                          'PENDING': 'bg-amber-100 text-amber-800 border-amber-300',
                          'REJECTED': 'bg-rose-100 text-rose-800 border-rose-300',
                          'CANCELLED': 'bg-stone-100 text-stone-600 border-stone-300'
                        };
                        const statusCls = statusColors[b.status] || 'bg-stone-100 text-stone-700 border-stone-200';
                        return `
                          <tr class="hover:bg-stone-50/60 transition-colors">
                            <td class="py-3 px-3 font-mono font-bold text-stone-800 text-[11px]">
                              #${b.id.slice(-6).toUpperCase()}
                            </td>
                            <td class="py-3 px-3">
                              <div class="font-bold text-stone-900">${b.customer_name || 'Anonymous Guest'}</div>
                              <div class="text-[11px] text-stone-500">${b.customer_phone || '—'}</div>
                              <div class="text-[10px] text-stone-400">${b.customer_email || '—'}</div>
                            </td>
                            <td class="py-3 px-3 font-semibold text-stone-800 max-w-[180px] truncate">
                              ${b.hall_name || b.hall_id}
                            </td>
                            <td class="py-3 px-3">
                              <div class="font-bold text-stone-800">${b.date}</div>
                              <span class="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-600 uppercase mt-0.5">
                                ${b.slot ? b.slot.replace('_', ' ') : 'Full Day'}
                              </span>
                            </td>
                            <td class="py-3 px-3">
                              <div class="text-stone-700 font-medium">${b.event_type || 'Event'}</div>
                              <div class="text-[11px] text-stone-500">${b.guest_count ? b.guest_count + ' guests' : '—'}</div>
                            </td>
                            <td class="py-3 px-3">
                              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusCls}">
                                ${b.status}
                              </span>
                            </td>
                            <td class="py-3 px-3 text-[11px] text-stone-400 font-mono">
                              ${b.created_at ? new Date(b.created_at).toLocaleDateString() : '—'}
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
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

  openReviewModal(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-container';
      document.body.appendChild(modalContainer);
    }

    const verification = hall.physical_verification || {};
    const hasPassedInspection = (verification.status === 'VERIFIED');
    const hasVerifiedWebsite = Boolean(hall.website_verified && hall.website);
    const hasPaidFee = Boolean(hall.listing_fee_paid);

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) AdminDashboardView.closeModal()">
        <div class="bg-white max-w-3xl w-full rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col text-left">
          
          <!-- Header -->
          <div class="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center font-bold">
                <span class="material-symbols-outlined text-[20px]">verified_user</span>
              </span>
              <div>
                <span class="text-[11px] font-bold text-secondary uppercase tracking-widest">Venue Onboarding Audit</span>
                <h3 class="font-display text-lg font-bold text-stone-900">${hall.name}</h3>
              </div>
            </div>
            <button onclick="AdminDashboardView.closeModal()" class="p-1.5 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 flex-1">
            
            <!-- 1. Physical Location & Owner Contact Coordinates -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <!-- Location Card -->
              <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-stone-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                    <span class="material-symbols-outlined text-[15px] text-stone-600">location_on</span> Physical Location
                  </span>
                  <a href="https://maps.google.com/?q=${hall.latitude || 13.2185},${hall.longitude || 74.9983}" target="_blank" class="text-secondary font-bold text-[11px] hover:underline flex items-center gap-0.5">
                    <span>Google Maps</span>
                    <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                </div>
                <div class="text-stone-900 font-medium">${hall.address || hall.area + ', ' + hall.city}</div>
                <div class="text-[11px] text-stone-500">Coordinates: ${hall.latitude || '13.2185'}° N, ${hall.longitude || '74.9983'}° E</div>
              </div>

              <!-- Owner Phone & Direct Contact -->
              <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span class="font-bold text-stone-900 uppercase text-[10px] tracking-wider flex items-center gap-1">
                  <span class="material-symbols-outlined text-[15px] text-stone-600">contact_phone</span> Owner Verification Contact
                </span>
                <div class="text-stone-900 font-bold">${hall.contact?.owner_name || 'Hall Proprietor'}</div>
                <div class="flex items-center justify-between pt-1">
                  <span class="font-mono font-bold text-stone-800 text-xs">${hall.contact?.phone || '+91 82582 29988'}</span>
                  <div class="flex items-center gap-1.5">
                    <a href="tel:${hall.contact?.phone || '+918258229988'}" class="p-1.5 rounded-md bg-white hover:bg-stone-200 border border-stone-300 text-stone-800 transition-colors" title="Call Owner">
                      <span class="material-symbols-outlined text-[15px]">call</span>
                    </a>
                    <a href="https://wa.me/${hall.contact?.phone ? hall.contact.phone.replace(/[^0-9]/g, '') : '918258229988'}" target="_blank" class="p-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white transition-colors" title="WhatsApp Owner">
                      <span class="material-symbols-outlined text-[15px]">chat</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

            <!-- 2. AUDIT STEP 1: In-Person Physical Inspection -->
            <div class="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-stone-100">
                <span class="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-bold">1</span>
                  In-Person Physical Premises Inspection
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hasPassedInspection ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                  ${hasPassedInspection ? '✅ Verified' : '⏳ Awaiting Inspection'}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-bold uppercase text-stone-600 mb-1">Field Auditor Name / ID *</label>
                  <input type="text" id="audit-agent" value="${verification.inspected_by || 'Rohan Sharma (Field Auditor - Udupi Desk)'}" class="w-full p-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 font-semibold focus:border-secondary outline-none" placeholder="e.g. Ramesh Hegde (Field Inspector)">
                </div>

                <div>
                  <label class="block text-[11px] font-bold uppercase text-stone-600 mb-1">Physical Verification Result *</label>
                  <select id="audit-physical-status" class="w-full p-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 font-semibold focus:border-secondary outline-none">
                    <option value="PENDING_INSPECTION" ${verification.status === 'PENDING_INSPECTION' ? 'selected' : ''}>⏳ Pending On-Site Visit</option>
                    <option value="VERIFIED" ${verification.status === 'VERIFIED' ? 'selected' : ''}>✅ Physically Verified (Passed)</option>
                    <option value="REJECTED" ${verification.status === 'REJECTED' ? 'selected' : ''}>❌ Failed Verification</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-[11px] font-bold uppercase text-stone-600 mb-1">Field Inspection Report & Observations</label>
                <textarea id="audit-notes" rows="2" class="w-full p-2.5 rounded-lg border border-stone-300 text-xs text-stone-800 focus:border-secondary outline-none" placeholder="e.g. Physical premises visited. Capacity confirmed 800 seats. Fire exits and 120kVA backup genset verified in working order.">${verification.notes || ''}</textarea>
              </div>
            </div>

            <!-- 3. AUDIT STEP 2: Official Website Audit (Only Required for Paid/Premium) -->
            <div class="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-stone-100">
                <span class="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                  Official Hall Website Audit (Required Only for Paid / Premium Showcase)
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hasVerifiedWebsite ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'}" id="audit-website-badge">
                  ${hasVerifiedWebsite ? '✅ Domain Verified' : 'Optional for Basic'}
                </span>
              </div>

              <p class="text-[11px] text-stone-500 leading-relaxed">
                * Platform Rule: Halls that do not pay the listing fee <strong>do not require a website</strong>. Any website entered for non-paying halls will be hidden on the customer site to prevent customers from bypassing our platform to book directly.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-[11px] font-bold uppercase text-stone-600 mb-1">Registered Hall Website URL (Required if Fee Paid)</label>
                  <div class="flex items-center gap-1.5">
                    <input type="url" id="audit-website" value="${hall.website || ''}" class="w-full p-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 font-semibold focus:border-secondary outline-none" placeholder="https://yourhallname.com">
                    ${hall.website ? `
                      <a href="${hall.website}" target="_blank" class="p-2.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs shrink-0 flex items-center gap-1" title="Test Website">
                        <span class="material-symbols-outlined text-[16px]">open_in_new</span>
                      </a>
                    ` : ''}
                  </div>
                </div>

                <div class="flex flex-col justify-end">
                  <label class="p-2.5 rounded-lg border border-stone-300 bg-stone-50 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="audit-website-verified" class="rounded text-secondary focus:ring-secondary" ${hall.website_verified ? 'checked' : ''}>
                    <span class="font-bold text-[11px] text-stone-900">Domain Verified Under Owner Name</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 4. AUDIT STEP 3: Annual Listing Fee Status (Offline Collection) -->
            <div class="p-4 rounded-xl border border-stone-200 bg-white space-y-3">
              <div class="flex items-center justify-between pb-2 border-b border-stone-100">
                <span class="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span class="w-5 h-5 rounded-full bg-stone-900 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                  Annual Listing Activation Fee (Field Collection)
                </span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hasPaidFee ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'}">
                  ${hasPaidFee ? '🌟 Paid (Premium Showcase)' : '📄 Unpaid (Basic Directory)'}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="p-2.5 rounded-lg border border-stone-300 bg-stone-50 flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="audit-fee-paid" class="rounded text-secondary focus:ring-secondary" ${hall.listing_fee_paid ? 'checked' : ''} onchange="AdminDashboardView.toggleFeePreview(this.checked)">
                    <span class="font-bold text-xs text-stone-900">Listing Fee Received (Offline Cheque / UPI / Cash)</span>
                  </label>
                </div>

                <div>
                  <input type="text" id="audit-fee-receipt" value="${hall.listing_fee_receipt || 'OFFLINE-REC-' + hall.id.slice(-5)}" class="w-full p-2.5 rounded-lg border border-stone-300 text-xs text-stone-900 font-semibold focus:border-secondary outline-none" placeholder="Receipt / Instrument Reference No.">
                </div>
              </div>

              <!-- Customer Presentation Live Preview Box -->
              <div id="fee-preview-box" class="p-3 rounded-xl border text-xs leading-relaxed ${hall.listing_fee_paid ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-stone-100 border-stone-200 text-stone-700'}">
                ${hall.listing_fee_paid ? `
                  <strong>🌟 Premium Showcase Active:</strong> Hall appears first in priority search sorted by rating, displays full photography gallery, interactive availability calendar, and verified official website.
                ` : `
                  <strong>📄 Basic Directory Mode (Non-Paying):</strong> Website is not required and will not be displayed (preventing direct booking bypass). Hall card displays the VenueLuxe company logo instead of hall images, is excluded from Homepage Featured, and appears last in search priority.
                `}
              </div>
            </div>

          </div>

          <!-- Footer Actions -->
          <div class="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button 
              class="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold text-xs transition-colors"
              onclick="AdminDashboardView.rejectListing('${hall.id}'); AdminDashboardView.closeModal();">
              Reject Submission
            </button>

            <div class="flex items-center gap-2 self-end sm:self-auto">
              <button 
                class="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 rounded-xl font-bold text-xs transition-colors"
                onclick="AdminDashboardView.saveAudit('${hall.id}', false)">
                Save Audit Notes
              </button>

              <button 
                class="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors"
                onclick="AdminDashboardView.saveAudit('${hall.id}', true)">
                <span class="material-symbols-outlined text-[16px]">publish</span>
                <span>Publish to Customer Site</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  toggleFeePreview(isChecked) {
    const box = document.getElementById('fee-preview-box');
    if (!box) return;
    if (isChecked) {
      box.className = 'p-3 rounded-xl border text-xs leading-relaxed bg-emerald-50 border-emerald-200 text-emerald-900';
      box.innerHTML = '<strong>🌟 Premium Showcase Active:</strong> Hall appears first in priority search sorted by rating, displays full photography gallery, interactive availability calendar, and verified official website.';
    } else {
      box.className = 'p-3 rounded-xl border text-xs leading-relaxed bg-stone-100 border-stone-200 text-stone-700';
      box.innerHTML = '<strong>📄 Basic Directory Mode (Non-Paying):</strong> Website is not required and will not be displayed (preventing direct booking bypass). Hall card displays the VenueLuxe company logo instead of hall images, is excluded from Homepage Featured, and appears last in search priority.';
    }
  },

  saveAudit(hallId, publishLive = false) {
    const agent = document.getElementById('audit-agent')?.value?.trim();
    const physicalStatus = document.getElementById('audit-physical-status')?.value;
    const notes = document.getElementById('audit-notes')?.value?.trim();
    const website = document.getElementById('audit-website')?.value?.trim();
    const websiteVerified = document.getElementById('audit-website-verified')?.checked;
    const feePaid = document.getElementById('audit-fee-paid')?.checked;
    const feeReceipt = document.getElementById('audit-fee-receipt')?.value?.trim();

    if (publishLive) {
      if (physicalStatus !== 'VERIFIED') {
        Toast.error('Physical Inspection Required', 'A field personnel must complete the in-person inspection and mark it "Physically Verified" before publishing.');
        return;
      }
      // Website is only required if hall is paying the fee (Premium tier)
      if (feePaid && (!website || !websiteVerified)) {
        Toast.error('Official Website Required for Premium', 'To activate a Paid Premium showcase, the official website must be registered and domain verified under the owner.');
        return;
      }
    }

    try {
      window.appStore.auditHallVerification(hallId, {
        physicalStatus,
        inspectedBy: agent,
        notes,
        website,
        websiteVerified,
        feePaid,
        feeReceipt,
        publishLive
      });

      this.closeModal();
      if (publishLive) {
        Toast.success('Venue Published Live!', `Hall is now live as a ${feePaid ? 'Full Premium Showcase' : 'Basic Directory Listing'}.`);
      } else {
        Toast.info('Audit Saved', 'Inspection notes and website records updated.');
      }
      this.setTab(this.currentTab);
    } catch (err) {
      Toast.error('Verification Error', err.message);
    }
  },

  getCustomerHallUrl(hallId) {
    if (window.location.pathname.startsWith('/admin')) {
      return `../customer/#/hall/${hallId}`;
    }
    return `/customer/#/hall/${hallId}`;
  },

  openVenueInspectionModal(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) {
      if (window.Toast) Toast.error('Venue Not Found', 'Could not locate venue records.');
      return;
    }

    let modalContainer = document.getElementById('modal-container');
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = 'modal-container';
      document.body.appendChild(modalContainer);
    }

    const isPaid = (hall.listing_fee_paid === true || hall.listing_tier === 'PREMIUM');
    const customerUrl = this.getCustomerHallUrl(hall.id);
    const images = Array.isArray(hall.images) ? hall.images : (hall.cover_image ? [hall.cover_image] : []);

    modalContainer.innerHTML = `
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm modal-backdrop" onclick="if(event.target === this) AdminDashboardView.closeModal()">
        <div class="bg-white max-w-3xl w-full rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col text-left">
          
          <!-- Modal Header -->
          <div class="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
            <div class="flex items-center gap-3">
              <img src="${hall.cover_image || window.appStore.getPlaceholderImage('Venue')}" class="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-sm shrink-0" onerror="this.src=window.appStore.getPlaceholderImage('Venue')">
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-display text-lg font-bold text-stone-900">${hall.name}</h3>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${hall.status === 'LIVE' ? 'bg-emerald-100 text-emerald-800' : (hall.status === 'SUSPENDED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800')}">
                    ${hall.status}
                  </span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isPaid ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-200 text-stone-700'}">
                    ${isPaid ? '★ PREMIUM SHOWCASE' : 'DIRECTORY TIER (UNPAID)'}
                  </span>
                </div>
                <p class="text-xs text-stone-500 mt-0.5">${hall.city}, ${hall.area || ''} • ID: <span class="font-mono">${hall.id}</span></p>
              </div>
            </div>
            <button onclick="AdminDashboardView.closeModal()" class="p-1.5 rounded-full text-stone-500 hover:bg-stone-200 transition-colors">
              <span class="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <!-- Modal Scrollable Body -->
          <div class="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 flex-1">
            
            <!-- Quick Actions Toolbar -->
            <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <div class="flex items-center gap-2 flex-wrap">
                <a href="${customerUrl}" target="_blank" class="px-3.5 py-2 bg-primary hover:bg-stone-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm">
                  <span>Open Live Customer Listing</span>
                  <span class="material-symbols-outlined text-[15px]">open_in_new</span>
                </a>
                <button onclick="AdminDashboardView.closeModal(); AdminDashboardView.openReviewModal('${hall.id}')" class="px-3.5 py-2 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors">
                  <span class="material-symbols-outlined text-[15px]">fact_check</span>
                  <span>Full Audit & Inspection</span>
                </button>
              </div>

              <!-- Tier Action Button -->
              <div>
                ${!isPaid ? `
                  <button onclick="AdminDashboardView.promptUpgradeToPremium('${hall.id}')" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors">
                    <span class="material-symbols-outlined text-[16px]">star</span>
                    <span>Upgrade to Premium Showcase</span>
                  </button>
                ` : `
                  <button onclick="AdminDashboardView.promptDowngradeToBasic('${hall.id}')" class="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-lg font-semibold text-xs transition-colors">
                    Revert to Basic Directory
                  </button>
                `}
              </div>
            </div>

            <!-- Venue Specifications & Capacity -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span class="text-[10px] uppercase font-bold text-stone-400 block">Seating</span>
                <span class="font-bold text-base text-stone-900">${hall.seating_capacity || 0}</span>
                <span class="text-[10px] text-stone-500 block">Seats</span>
              </div>
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span class="text-[10px] uppercase font-bold text-stone-400 block">Floating Max</span>
                <span class="font-bold text-base text-stone-900">${hall.maximum_capacity || 0}</span>
                <span class="text-[10px] text-stone-500 block">Guests</span>
              </div>
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span class="text-[10px] uppercase font-bold text-stone-400 block">Floor Area</span>
                <span class="font-bold text-base text-stone-900">${(hall.size_sqft || 0).toLocaleString()}</span>
                <span class="text-[10px] text-stone-500 block">sq ft</span>
              </div>
              <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                <span class="text-[10px] uppercase font-bold text-stone-400 block">Pricing Starts</span>
                <span class="font-bold text-base text-stone-900">₹${(hall.pricing?.morning || 60000).toLocaleString()}</span>
                <span class="text-[10px] text-stone-500 block">per shift</span>
              </div>
            </div>

            <!-- Location & Contact -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-stone-900 text-xs flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px] text-secondary">location_on</span> Venue Address
                  </span>
                  <a href="https://maps.google.com/?q=${hall.latitude || 13.2172},${hall.longitude || 74.9966}" target="_blank" class="text-secondary font-bold text-[11px] hover:underline flex items-center gap-0.5">
                    <span>Google Maps</span>
                    <span class="material-symbols-outlined text-[13px]">open_in_new</span>
                  </a>
                </div>
                <div class="text-stone-800">${hall.address || `${hall.area || ''}, ${hall.city}, Karnataka`}</div>
                <div class="text-[11px] text-stone-500">Coordinates: ${hall.latitude || 13.2172}° N, ${hall.longitude || 74.9966}° E</div>
              </div>

              <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                <span class="font-bold text-stone-900 text-xs flex items-center gap-1">
                  <span class="material-symbols-outlined text-[16px] text-secondary">contact_phone</span> Venue Host / Proprietor
                </span>
                <div class="font-semibold text-stone-900">${hall.contact?.owner_name || 'Registered Host'}</div>
                <div class="flex items-center justify-between pt-1">
                  <span class="font-mono text-xs text-stone-800 font-bold">${hall.contact?.phone || 'N/A'}</span>
                  <div class="flex items-center gap-1.5">
                    ${hall.contact?.phone ? `
                      <a href="tel:${hall.contact.phone}" class="p-1.5 rounded-md bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 transition-colors" title="Call Host">
                        <span class="material-symbols-outlined text-[15px]">call</span>
                      </a>
                      <a href="https://wa.me/${hall.contact.phone.replace(/[^0-9]/g, '')}" target="_blank" class="p-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white transition-colors" title="WhatsApp Host">
                        <span class="material-symbols-outlined text-[15px]">chat</span>
                      </a>
                    ` : ''}
                  </div>
                </div>
              </div>
            </div>

            <!-- Description -->
            ${hall.description ? `
              <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1.5">
                <span class="font-bold text-stone-900 text-xs">Venue Description</span>
                <p class="text-stone-600 leading-relaxed whitespace-pre-line">${hall.description}</p>
              </div>
            ` : ''}

            <!-- Facilities & Registered Amenities -->
            <div class="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
              <span class="font-bold text-stone-900 text-xs">Registered Amenities & Facilities</span>
              <div class="flex flex-wrap gap-1.5 pt-1">
                ${Array.isArray(hall.facilities) && hall.facilities.length > 0 
                  ? hall.facilities.map(f => `<span class="px-2.5 py-1 rounded-md bg-white border border-stone-200 text-stone-800 text-[11px] font-medium">${f}</span>`).join('') 
                  : '<span class="text-stone-400 italic">No specific facilities registered.</span>'}
              </div>
            </div>

            <!-- Photos Preview -->
            ${images.length > 0 ? `
              <div class="space-y-2">
                <span class="font-bold text-stone-900 text-xs">Uploaded Photos (${images.length})</span>
                <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  ${images.map(img => {
                    const src = typeof img === 'object' ? img.url : img;
                    return `
                      <div class="aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                        <img src="${src}" class="w-full h-full object-cover" onerror="this.src=window.appStore.getPlaceholderImage('Venue')">
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}

          </div>

          <!-- Modal Footer -->
          <div class="p-4 px-6 bg-stone-50 border-t border-stone-200 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2">
              ${hall.status === 'LIVE' ? `
                <button onclick="AdminDashboardView.suspendListing('${hall.id}'); AdminDashboardView.closeModal();" class="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg transition-colors">
                  Suspend Venue
                </button>
              ` : `
                <button onclick="AdminDashboardView.restoreListing('${hall.id}'); AdminDashboardView.closeModal();" class="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors">
                  Restore to LIVE
                </button>
              `}
              <button onclick="AdminDashboardView.deleteListing('${hall.id}'); AdminDashboardView.closeModal();" class="px-3 py-1.5 text-rose-700 hover:bg-rose-50 text-xs font-bold rounded-lg transition-colors">
                Delete Listing
              </button>
            </div>
            <button onclick="AdminDashboardView.closeModal()" class="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-lg transition-colors">
              Close
            </button>
          </div>

        </div>
      </div>
    `;
  },

  promptUpgradeToPremium(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    const receipt = prompt(`Upgrade "${hall.name}" to Premium Showcase?\n\nEnter Payment / Transaction Receipt Reference (e.g. UPI Ref, Cheque, or Cash Receipt):`, `REC-${Date.now().toString().slice(-6)}`);
    if (receipt === null) return;

    const notes = prompt('Enter any administrative notes (optional):', 'Listing fee paid offline / field verification');
    
    window.appStore.upgradeHallToPremium(hallId, receipt, notes || '');
    if (window.Toast) {
      Toast.success('Upgraded to Premium Showcase! 🌟', `"${hall.name}" has been upgraded to Premium Showcase. All features restored.`);
    }
    
    this.setTab(this.currentTab);
    const modal = document.getElementById('modal-container');
    if (modal && modal.innerHTML.trim() !== '') {
      this.openVenueInspectionModal(hallId);
    }
  },

  promptDowngradeToBasic(hallId) {
    const hall = window.appStore.getHallById(hallId);
    if (!hall) return;

    if (!confirm(`Revert "${hall.name}" to Directory Tier (Basic / Unpaid)?\n\nThis will restrict photos to basic directory mode.`)) return;

    window.appStore.downgradeHallToBasic(hallId);
    if (window.Toast) {
      Toast.info('Tier Updated', `"${hall.name}" has been moved to Directory Tier.`);
    }
    this.setTab(this.currentTab);
    const modal = document.getElementById('modal-container');
    if (modal && modal.innerHTML.trim() !== '') {
      this.openVenueInspectionModal(hallId);
    }
  },

  suspendFromReport(reportId, hallId) {
    if (!confirm('Are you sure you want to suspend this venue listing and resolve the safety complaint?')) return;
    
    const success = window.appStore.suspendHall(hallId, 'Suspended by Super Admin due to customer safety complaint.');
    window.appStore.resolveReport(reportId, 'Venue suspended by Super Admin due to customer safety complaint.');
    
    if (success) {
      if (window.Toast) Toast.success('Venue Suspended', 'Venue listing has been suspended from customer search and complaint resolved.');
    } else {
      if (window.Toast) Toast.info('Complaint Resolved', 'Safety ticket marked as resolved.');
    }
    
    this.setTab('reports');
  },

  closeModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) modalContainer.innerHTML = '';
  },

  approveListing(id) {
    this.openReviewModal(id);
  },

  rejectListing(id) {
    window.appStore.rejectHall(id, 'Incomplete documentation or verification criteria unmet.');
    Toast.error('Submission Rejected', 'Venue status updated to REJECTED.');
    this.setTab('queue');
  },

  suspendListing(id) {
    window.appStore.suspendHall(id, 'Admin discretion or compliance review.');
    Toast.info('Listing Suspended', 'Venue removed from public customer search.');
    this.setTab('all_halls');
  },

  restoreListing(id) {
    window.appStore.restoreHall(id);
    Toast.success('Listing Restored', 'Venue is now LIVE in the directory.');
    this.setTab('all_halls');
  },

  deleteListing(id) {
    if (confirm('Permanently delete this venue listing?')) {
      window.appStore.deleteHall(id);
      Toast.info('Venue Deleted', 'Listing permanently purged from platform.');
      this.setTab('all_halls');
    }
  },

  dismissReport(id) {
    window.appStore.resolveReport(id, 'Audited and dismissed by administrator.');
    Toast.success('Report Resolved', 'Safety ticket marked as resolved.');
    this.setTab('reports');
  }
};

window.AdminDashboardView = AdminDashboardView;
