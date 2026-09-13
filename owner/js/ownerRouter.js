// Hall Owner Portal Router
// Coordinates tabs: overview, halls, bookings, calendar, earnings

const OwnerRouter = {
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const container = document.getElementById('app-content');
    if (!container) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    const hash = window.location.hash || '#/';
    let tab = 'overview';
    if (hash.startsWith('#/halls')) tab = 'halls';
    else if (hash.startsWith('#/bookings')) tab = 'bookings';
    else if (hash.startsWith('#/calendar')) tab = 'calendar';
    else if (hash.startsWith('#/earnings') || hash.startsWith('#/analytics')) tab = 'earnings';
    else tab = 'overview';

    if (window.OwnerDashboardView) {
      OwnerDashboardView.currentTab = tab;
      container.innerHTML = OwnerDashboardView.render();
      if (OwnerDashboardView.postRender) OwnerDashboardView.postRender();
    }

    if (window.OwnerHeaderComponent) {
      OwnerHeaderComponent.update();
    }
  }
};

window.OwnerRouter = OwnerRouter;
window.Router = OwnerRouter; // compatibility alias

