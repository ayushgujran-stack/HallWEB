// Customer Portal Bootstrap — VenueLuxe

function bootCustomerApp() {
  if (window.__appBooted) return;
  window.__appBooted = true;

  try {
    // Ensure store is seeded in customer role
    if (window.appStore) {
      window.appStore.setCurrentRole('customer');
    }

    // Render persistent layout
    const headerRoot = document.getElementById('header-root');
    if (headerRoot && window.CustomerHeaderComponent) {
      headerRoot.innerHTML = window.CustomerHeaderComponent.render();
    }

    const footerRoot = document.getElementById('footer-root');
    if (footerRoot && window.FooterComponent) {
      footerRoot.innerHTML = window.FooterComponent.render();
    }

    // Initialize Customer Router
    if (window.CustomerRouter) {
      window.CustomerRouter.init();
    }

    console.log('VenueLuxe Customer Portal initialized.');
  } catch (err) {
    console.error('Error bootstrapping Customer Portal:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCustomerApp);
} else {
  bootCustomerApp();
}
