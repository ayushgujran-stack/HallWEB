// Customer Portal Bootstrap — Halls Now

function bootCustomerApp() {
  if (window.__appBooted) return;
  window.__appBooted = true;

  try {
    // Seed the store role — but do NOT overwrite an existing owner/admin session.
    // If we unconditionally set 'customer', the header will lose the "Owner Workspace" link
    // for users who came from the owner portal or just listed a hall.
    if (window.appStore) {
      const currentUser = window.Auth && window.Auth.getCurrentUser();
      const existingRole = window.appStore.getCurrentRole();
      if (!currentUser || (currentUser.role !== 'owner' && currentUser.role !== 'admin' && existingRole !== 'owner' && existingRole !== 'admin')) {
        window.appStore.setCurrentRole('customer');
      }
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

    // Reactive update on hallsUpdated
    window.addEventListener('hallsUpdated', () => {
      const hash = window.location.hash || '#/';
      if (hash === '#/' || hash.startsWith('#/search')) {
        if (window.CustomerRouter && typeof window.CustomerRouter.handleRoute === 'function') {
          window.CustomerRouter.handleRoute();
        }
      }
    });

    console.log('Halls Now Customer Portal initialized.');
  } catch (err) {
    console.error('Error bootstrapping Customer Portal:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootCustomerApp);
} else {
  bootCustomerApp();
}
