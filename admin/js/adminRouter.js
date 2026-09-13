// Admin Panel Router
// Single view: AdminDashboardView

const AdminRouter = {
  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    this.handleRoute();
  },

  handleRoute() {
    const container = document.getElementById('app-content');
    if (!container) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Always render the admin dashboard
    container.innerHTML = AdminDashboardView.render();
    if (AdminDashboardView.postRender) AdminDashboardView.postRender();

    AdminHeaderComponent.update();
  }
};

window.AdminRouter = AdminRouter;
window.Router = AdminRouter; // compatibility alias
