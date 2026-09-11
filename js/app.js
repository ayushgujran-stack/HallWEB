// Application Bootstrap & Initialization

function bootVenueLuxeApp() {
  if (window.__appBooted) return;
  window.__appBooted = true;

  try {
    // Render persistent layout frames
    const headerRoot = document.getElementById('header-root');
    if (headerRoot && window.HeaderComponent) {
      headerRoot.innerHTML = window.HeaderComponent.render();
    }

    const footerRoot = document.getElementById('footer-root');
    if (footerRoot && window.FooterComponent) {
      footerRoot.innerHTML = window.FooterComponent.render();
    }

    // Initialize Router
    if (window.Router) {
      window.Router.init();
    }

    // Initialize Global AI Concierge Floating Widget
    if (window.AIChatWidget) {
      window.AIChatWidget.init();
    }

    console.log('VenueLuxe Marketplace Platform initialized successfully.');
  } catch (err) {
    console.error('Error bootstrapping VenueLuxe app:', err);
  }
}

// Support both early execution and DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootVenueLuxeApp);
} else {
  bootVenueLuxeApp();
}
