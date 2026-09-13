// Hall Owner Portal Bootstrap — VenueLuxe

function bootOwnerApp() {
  if (window.__appBooted) return;
  window.__appBooted = true;

  try {
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
