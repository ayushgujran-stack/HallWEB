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
    try {
      if (window.AdminDashboardView && typeof AdminDashboardView.render === 'function') {
        container.innerHTML = AdminDashboardView.render();
        if (AdminDashboardView.postRender) AdminDashboardView.postRender();
      } else {
        container.innerHTML = '<div class="p-8 text-center text-sm text-stone-500">Loading Admin Dashboard...</div>';
      }
    } catch (err) {
      console.error('Error rendering AdminDashboardView:', err);
      container.innerHTML = `
        <div class="max-w-xl mx-auto my-12 p-6 bg-white rounded-xl border border-rose-200 text-center shadow-sm">
          <span class="material-symbols-outlined text-4xl text-rose-600 mb-2">error</span>
          <h2 class="text-lg font-bold text-stone-900 mb-1">Dashboard Loading Issue</h2>
          <p class="text-xs text-stone-600 mb-4">${err.message || 'An unexpected error occurred.'}</p>
          <button onclick="location.reload()" class="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-stone-800 transition-colors">
            Reload Page
          </button>
        </div>
      `;
    }

    if (window.AdminHeaderComponent && typeof AdminHeaderComponent.update === 'function') {
      AdminHeaderComponent.update();
    }
  }
};

window.AdminRouter = AdminRouter;
window.Router = AdminRouter; // compatibility alias
