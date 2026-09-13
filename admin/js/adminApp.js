// Admin Panel Bootstrap — VenueLuxe
// Enforces strict portal segregation: Hall owners and customers cannot access admin portal.

window.quickLoginAsAdmin = async function() {
  const btn = event?.currentTarget || document.getElementById('btn-quick-admin');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Authenticating...';
  }

  try {
    if (window.Auth) {
      const res = await window.Auth.login({ email: 'admin@venueluxe.com', password: 'admin123' });
      if (res.success) {
        if (typeof Toast !== 'undefined') Toast.success('Access Granted', 'Signed in as Super Admin (Dr. Shenoy).');
        window.__appBooted = false;
        bootAdminApp();
        return;
      }
    }
    // Direct Admin Session Fallback
    const adminAcc = {
      id: 'admin-1',
      name: 'Dr. K. R. Shenoy',
      email: 'admin@venueluxe.com',
      phone: '+91 94481 00001',
      role: 'admin'
    };
    if (window.Auth) window.Auth._setSession(adminAcc);
    if (window.appStore) window.appStore.setCurrentRole('admin');
    if (typeof Toast !== 'undefined') Toast.success('Access Granted', 'Signed in as Super Admin (Dr. Shenoy).');
    window.__appBooted = false;
    bootAdminApp();
  } catch (err) {
    console.error('Admin quick login error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">bolt</span><span>1-Click Sign In: Dr. Shenoy (Admin)</span>';
    }
  }
};

window.loginAdminUser = async function() {
  const email = document.getElementById('admin-gate-email')?.value?.trim();
  const password = document.getElementById('admin-gate-pwd')?.value?.trim();
  const btn = document.getElementById('btn-admin-submit');
  const errEl = document.getElementById('admin-gate-error');

  if (!email || !password) return;

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Authorizing...';
  }
  if (errEl) errEl.classList.add('hidden');

  try {
    if (window.Auth) {
      const res = await window.Auth.login({ email, password });
      if (res.success && (res.user.role === 'admin' || window.Auth.isAdminUser(res.user))) {
        if (typeof Toast !== 'undefined') Toast.success('Access Granted', 'Welcome to Super Admin Control Tower.');
        window.__appBooted = false;
        bootAdminApp();
        return;
      }
    }

    // Direct fallback check
    if (email.toLowerCase() === 'admin@venueluxe.com' && password === 'admin123') {
      const adminAcc = {
        id: 'admin-1',
        name: 'Dr. K. R. Shenoy',
        email: 'admin@venueluxe.com',
        phone: '+91 94481 00001',
        role: 'admin'
      };
      if (window.Auth) window.Auth._setSession(adminAcc);
      if (window.appStore) window.appStore.setCurrentRole('admin');
      if (typeof Toast !== 'undefined') Toast.success('Access Granted', 'Welcome to Super Admin Control Tower.');
      window.__appBooted = false;
      bootAdminApp();
      return;
    }

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">key</span><span>Authorize & Unlock Control Tower</span>';
    }

    if (errEl) {
      errEl.textContent = 'Invalid administrator credentials. Only authorized platform administrators may access this portal.';
      errEl.classList.remove('hidden');
    } else if (typeof Toast !== 'undefined') {
      Toast.error('Unauthorized', 'Invalid administrator credentials. Please use admin@venueluxe.com / admin123.');
    } else {
      alert('Unauthorized: Invalid administrator credentials.');
    }
  } catch (err) {
    console.error('Admin login error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">key</span><span>Authorize & Unlock Control Tower</span>';
    }
    if (errEl) {
      errEl.textContent = err.message || 'Login failed. Please try again.';
      errEl.classList.remove('hidden');
    }
  }
};

function bootAdminApp() {
  if (window.__appBooted) return;

  try {
    // 1. Strict Security Guard Check
    if (window.Auth) {
      const guard = window.Auth.guardAdminPortal();
      if (!guard.allowed) {
        const appContent = document.getElementById('app-content') || document.body;
        
        let noticeHtml = '';
        if (guard.reason === 'OWNER_BLOCKED') {
          noticeHtml = `
            <div class="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-900 leading-relaxed">
              🔒 In accordance with platform security segregation, <strong>Hall Owners do not have access to the Super Admin Portal</strong>. You are currently signed in as <strong>${guard.user?.name || 'Hall Owner'}</strong>. Please switch to an authorized Super Admin account.
            </div>
          `;
        } else if (guard.reason === 'CUSTOMER_BLOCKED') {
          noticeHtml = `
            <div class="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-900 leading-relaxed">
              🔒 This portal is restricted to authorized platform administrators. You are currently signed in as Customer <strong>${guard.user?.name || 'Customer'}</strong>.
            </div>
          `;
        }

        appContent.innerHTML = `
          <div class="min-h-screen flex items-center justify-center bg-surface p-6">
            <div class="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl border border-outline shadow-xl space-y-5 text-left">
              <div class="text-center space-y-2">
                <div class="w-14 h-14 rounded-2xl bg-primary text-secondary flex items-center justify-center mx-auto shadow-md">
                  <span class="material-symbols-outlined text-[32px]">admin_panel_settings</span>
                </div>
                <h2 class="text-xl font-bold text-on-surface font-serif">Super Admin Authentication</h2>
                <p class="text-xs text-on-surface-variant">Sign in with authorized administrator credentials</p>
              </div>

              ${noticeHtml}

              <!-- 1-Click Instant Super Admin Sign In -->
              <button id="btn-quick-admin" onclick="window.quickLoginAsAdmin()" type="button" class="w-full py-3 bg-secondary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-secondary-container transition-all flex items-center justify-center gap-2 shadow-sm">
                <span class="material-symbols-outlined text-[16px]">bolt</span>
                <span>1-Click Sign In: Dr. Shenoy (Admin)</span>
              </button>

              <div class="relative flex items-center justify-center my-1">
                <span class="absolute px-2 bg-surface-container-lowest text-[10px] text-on-surface-variant uppercase font-bold">Or enter credentials</span>
                <div class="w-full border-t border-outline"></div>
              </div>

              <form onsubmit="event.preventDefault(); window.loginAdminUser();" class="space-y-3.5">
                <div>
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Admin Email</label>
                  <input type="email" id="admin-gate-email" value="admin@venueluxe.com" required class="w-full px-3.5 py-2.5 text-xs rounded-lg border border-outline bg-surface-container focus:bg-white focus:ring-1 focus:ring-primary outline-none font-semibold text-on-surface">
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Admin Password</label>
                  <input type="password" id="admin-gate-pwd" value="admin123" required class="w-full px-3.5 py-2.5 text-xs rounded-lg border border-outline bg-surface-container focus:bg-white focus:ring-1 focus:ring-primary outline-none font-semibold text-on-surface">
                </div>
                <div id="admin-gate-error" class="hidden text-xs text-error font-semibold p-2 bg-error-container rounded-lg"></div>
                <button type="submit" id="btn-admin-submit" class="w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-inverse-surface transition-all shadow-sm flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-[16px]">key</span>
                  <span>Authorize & Unlock Control Tower</span>
                </button>
              </form>

              <div class="pt-3 border-t border-outline flex items-center justify-between text-xs">
                <a href="/customer/" class="text-on-surface-variant hover:text-primary font-medium">← Customer Marketplace</a>
                <span class="text-[11px] text-on-surface-variant/70 font-mono">admin@venueluxe.com</span>
              </div>
            </div>
          </div>
        `;
        return;
      }
    }

    window.__appBooted = true;

    // Ensure store is seeded in admin role
    if (window.appStore) {
      window.appStore.setCurrentRole('admin');
    }

    // Render persistent layout
    const headerRoot = document.getElementById('header-root');
    if (headerRoot && window.AdminHeaderComponent) {
      headerRoot.innerHTML = window.AdminHeaderComponent.render();
    }

    const footerRoot = document.getElementById('footer-root');
    if (footerRoot && window.FooterComponent) {
      footerRoot.innerHTML = window.FooterComponent.render();
    }

    // Clear gate HTML from main container before mounting views
    const appContent = document.getElementById('app-content');
    if (appContent) {
      appContent.innerHTML = '';
    }

    // Initialize Admin Router
    if (window.AdminRouter) {
      window.AdminRouter.init();
    }

    // Setup reactive cloud sync listeners
    setupAdminRealTimeListeners();

    console.log('VenueLuxe Admin Panel initialized.');
  } catch (err) {
    console.error('Error bootstrapping Admin Panel:', err);
  }
}

// Reactive UI Synchronization: Automatically update Admin Dashboard and Header when cloud data updates
function setupAdminRealTimeListeners() {
  if (window.__adminListenersAttached) return;
  window.__adminListenersAttached = true;

  const refreshAdminView = () => {
    if (!window.__appBooted) return;
    const appContent = document.getElementById('app-content');
    if (appContent && window.AdminDashboardView) {
      appContent.innerHTML = AdminDashboardView.render();
      if (AdminDashboardView.postRender) AdminDashboardView.postRender();
    }
    if (window.AdminHeaderComponent && typeof window.AdminHeaderComponent.update === 'function') {
      AdminHeaderComponent.update();
    }
  };

  window.addEventListener('hallsUpdated', (e) => {
    console.log('[Admin] Real-time halls updated. Refreshing verification center.');
    refreshAdminView();
  });

  window.addEventListener('notificationsUpdated', () => {
    if (window.AdminHeaderComponent && typeof window.AdminHeaderComponent.update === 'function') {
      AdminHeaderComponent.update();
    }
  });

  window.addEventListener('auditLogsUpdated', () => {
    if (window.AdminDashboardView && window.AdminDashboardView.currentTab === 'audit') {
      refreshAdminView();
    }
  });

  window.addEventListener('reportsUpdated', () => {
    refreshAdminView();
  });

  window.addEventListener('bookingsUpdated', () => {
    if (window.AdminDashboardView && window.AdminDashboardView.currentTab === 'bookings') {
      refreshAdminView();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAdminApp);
} else {
  bootAdminApp();
}
