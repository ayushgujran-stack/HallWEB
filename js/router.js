// Client-Side Hash Router for VenueLuxe SPA
// Handles: #/, #/search, #/hall/:id, #/owner, #/admin, #/customer

const Router = {
  routes: {
    '/': () => LandingView,
    '/search': () => SearchView,
    '/owner': () => OwnerDashboardView,
    '/admin': () => AdminDashboardView,
    '/customer': () => CustomerDashboardView
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    let hash = window.location.hash || '#/';
    if (!hash.startsWith('#/')) hash = '#/';

    const path = hash.slice(1); // remove '#'
    const container = document.getElementById('app-content');
    if (!container) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 1. Check Hall Details dynamic route: /hall/:id
    if (path.startsWith('/hall/')) {
      const hallId = path.split('/hall/')[1];
      container.innerHTML = DetailsView.render(hallId);
      if (DetailsView.postRender) DetailsView.postRender();
      HeaderComponent.update();
      return;
    }

    // 2. Exact match static routes
    const viewGetter = this.routes[path] || this.routes['/'];
    const view = viewGetter();

    container.innerHTML = view.render();
    if (view.postRender) {
      view.postRender();
    }

    HeaderComponent.update();
  }
};

window.Router = Router;
