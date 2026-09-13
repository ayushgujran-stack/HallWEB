// Admin Panel Bootstrap — VenueLuxe

function bootAdminApp() {
  if (window.__appBooted) return;
  window.__appBooted = true;

  try {
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

    // Initialize Admin Router
    if (window.AdminRouter) {
      window.AdminRouter.init();
    }

    console.log('VenueLuxe Admin Panel initialized.');
  } catch (err) {
    console.error('Error bootstrapping Admin Panel:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootAdminApp);
} else {
  bootAdminApp();
}
