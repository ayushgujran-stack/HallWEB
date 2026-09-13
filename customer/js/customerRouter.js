// Customer Portal Router
// Routes: #/ (landing), #/search, #/hall/:id, #/customer (customer dashboard)

const CustomerRouter = {
  routes: {
    '/': () => LandingView,
    '/search': () => SearchView,
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

    // Hall Details dynamic route: /hall/:id
    if (path.startsWith('/hall/')) {
      const hallId = path.split('/hall/')[1];
      container.innerHTML = DetailsView.render(hallId);
      if (DetailsView.postRender) DetailsView.postRender();
      CustomerHeaderComponent.update();
      return;
    }

    // Exact match static routes
    const viewGetter = this.routes[path] || this.routes['/'];
    const view = viewGetter();

    container.innerHTML = view.render();
    if (view.postRender) view.postRender();

    CustomerHeaderComponent.update();
  }
};

window.CustomerRouter = CustomerRouter;
window.Router = CustomerRouter; // compatibility alias
