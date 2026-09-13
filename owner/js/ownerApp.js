// Hall Owner Portal Bootstrap — VenueLuxe
// Enforces strict portal segregation: Super Admin accounts cannot access Hall Owner Workspace.

window.loginOwnerUser = async function() {
  const email = document.getElementById('owner-gate-email')?.value?.trim();
  const password = document.getElementById('owner-gate-pwd')?.value?.trim();
  const btn = document.getElementById('btn-owner-submit');
  const errEl = document.getElementById('owner-gate-error');

  if (!email || !password) return;

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[16px]">progress_activity</span> Signing In...';
  }
  if (errEl) errEl.classList.add('hidden');

  try {
    const res = await window.Auth.login({ email, password });
    if (res.success) {
      if (res.user && (res.user.role === 'admin' || window.Auth.isAdminUser(res.user))) {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">login</span><span>Sign In to Host Workspace</span>';
        }
        if (errEl) {
          errEl.textContent = 'Super Admin accounts cannot access the Owner Workspace. Please use the Admin Portal.';
          errEl.classList.remove('hidden');
        } else if (typeof Toast !== 'undefined') {
          Toast.error('Access Denied', 'Super Admin accounts cannot access the Owner Workspace. Please use the Admin Portal.');
        }
        return;
      }

      // Upgrade customer account to owner role so they can host and manage halls
      if (res.user.role !== 'owner') {
        window.Auth.upgradeToOwner(res.user.id);
      }

      if (typeof Toast !== 'undefined') Toast.success('Access Granted', `Welcome to your Host Workspace, ${res.user.name}.`);
      window.__appBooted = false;
      bootOwnerApp();
      return;
    }

    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">login</span><span>Sign In to Host Workspace</span>';
    }
    if (errEl) {
      errEl.textContent = res.error || 'Invalid credentials. Please check your email and password.';
      errEl.classList.remove('hidden');
    } else if (typeof Toast !== 'undefined') {
      Toast.error('Sign In Failed', res.error || 'Invalid credentials.');
    } else {
      alert('Sign In Failed: ' + (res.error || 'Invalid credentials.'));
    }
  } catch (err) {
    console.error('Owner login error:', err);
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[16px]">login</span><span>Sign In to Host Workspace</span>';
    }
    if (errEl) {
      errEl.textContent = err.message || 'An error occurred during sign in.';
      errEl.classList.remove('hidden');
    }
  }
};

function bootOwnerApp() {
  if (window.__appBooted) return;

  try {
    // 1. Strict Security Guard Check
    if (window.Auth) {
      const guard = window.Auth.guardOwnerPortal();
      if (!guard.allowed) {
        const appContent = document.getElementById('app-content') || document.body;

        if (guard.reason === 'ADMIN_BLOCKED') {
          appContent.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-surface p-6 text-center">
              <div class="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl border border-outline shadow-xl space-y-5 text-left">
                <div class="text-center space-y-2">
                  <div class="w-16 h-16 rounded-full bg-secondary/15 text-secondary flex items-center justify-center mx-auto">
                    <span class="material-symbols-outlined text-[36px]">block</span>
                  </div>
                  <h2 class="text-xl font-bold text-on-surface font-serif">Access Not Permitted</h2>
                  <p class="text-xs text-on-surface-variant">
                    Super Admin accounts (<span class="text-secondary font-mono">${guard.user?.email || 'admin account'}</span>) cannot access the Hall Owner Workspace.
                  </p>
                </div>

                <div class="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-900 leading-relaxed">
                  🔒 Platform portals are strictly segregated. Admin accounts must use the Admin Portal exclusively.
                </div>

                <div class="pt-2 flex flex-col gap-2">
                  <button onclick="window.Auth.logout(); location.reload();" class="w-full py-3 bg-secondary text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm">
                    Sign Out & Switch to Host Account
                  </button>
                  <a href="/customer/" class="w-full py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl text-xs font-semibold uppercase tracking-wider transition-all inline-block text-center border border-outline">
                    Back to Storefront
                  </a>
                </div>
              </div>
            </div>
          `;
          return;
        }

        // AUTH_REQUIRED: Prompt Host Sign In Challenge
        appContent.innerHTML = `
          <div class="min-h-screen flex items-center justify-center bg-surface p-6">
            <div class="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl border border-outline shadow-xl space-y-5 text-left">
              <div class="text-center space-y-2">
                <div class="w-14 h-14 rounded-2xl bg-secondary text-white flex items-center justify-center mx-auto shadow-md">
                  <span class="material-symbols-outlined text-[32px]">apartment</span>
                </div>
                <h2 class="text-xl font-bold text-on-surface font-serif">Hall Owner Workspace</h2>
                <p class="text-xs text-on-surface-variant">Sign in with your VenueLuxe account to manage your venues, calendar, and bookings</p>
              </div>

              <form onsubmit="event.preventDefault(); window.loginOwnerUser();" class="space-y-3.5">
                <div>
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Email Address</label>
                  <input type="email" id="owner-gate-email" placeholder="your@email.com" required class="w-full px-3.5 py-2.5 text-xs rounded-lg border border-outline bg-surface-container focus:bg-white focus:ring-1 focus:ring-secondary outline-none font-semibold text-on-surface">
                </div>
                <div>
                  <label class="block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">Password</label>
                  <input type="password" id="owner-gate-pwd" placeholder="••••••••" required class="w-full px-3.5 py-2.5 text-xs rounded-lg border border-outline bg-surface-container focus:bg-white focus:ring-1 focus:ring-secondary outline-none font-semibold text-on-surface">
                </div>
                <div id="owner-gate-error" class="hidden text-xs text-error font-semibold p-2 bg-error-container rounded-lg"></div>
                <button type="submit" id="btn-owner-submit" class="w-full py-3 bg-secondary text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-secondary-container transition-all shadow-sm flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-[16px]">login</span>
                  <span>Sign In to Host Workspace</span>
                </button>
              </form>

              <div class="pt-3 border-t border-outline text-center">
                <a href="/customer/" class="text-on-surface-variant hover:text-primary text-xs font-medium">← Return to Customer Marketplace</a>
              </div>
            </div>
          </div>
        `;
        return;
      }
    }

    window.__appBooted = true;

    // Ensure store is seeded in owner role
    if (window.appStore) {
      window.appStore.setCurrentRole('owner');
    }

    // Render persistent layout
    const headerRoot = document.getElementById('header-root');
    if (headerRoot && window.OwnerHeaderComponent) {
      headerRoot.innerHTML = window.OwnerHeaderComponent.render();
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

    // Initialize Owner Router
    if (window.OwnerRouter) {
      window.OwnerRouter.init();
    }

    console.log('VenueLuxe Owner Portal initialized.');
  } catch (err) {
    console.error('Error bootstrapping Owner Portal:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootOwnerApp);
} else {
  bootOwnerApp();
}
