// Toast notification alert system matching VenueLuxe luxury aesthetics

const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none';
      document.body.appendChild(this.container);
    }
  },

  show(title, message, type = 'success') {
    this.init();

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto transform transition-all duration-300 translate-y-2 opacity-0 flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md';

    let icon = 'check_circle';
    let bgClasses = 'bg-surface-container-lowest/95 text-on-surface border-surface-container-high';
    let iconColor = 'text-on-tertiary-container';

    if (type === 'error') {
      icon = 'error';
      iconColor = 'text-error';
      bgClasses = 'bg-surface-container-lowest/95 text-on-surface border-error/20';
    } else if (type === 'info') {
      icon = 'info';
      iconColor = 'text-secondary';
    } else if (type === 'luxury') {
      icon = 'verified';
      iconColor = 'text-secondary';
      bgClasses = 'bg-primary-container text-on-primary border-secondary/30';
    }

    toast.classList.add(...bgClasses.split(' '));

    toast.innerHTML = `
      <span class="material-symbols-outlined ${iconColor} text-[22px] shrink-0 mt-0.5">${icon}</span>
      <div class="flex-1">
        <h4 class="font-title-md text-sm font-bold leading-tight">${title}</h4>
        <p class="font-body-sm text-xs opacity-80 mt-0.5 leading-relaxed">${message}</p>
      </div>
      <button class="opacity-60 hover:opacity-100 transition-opacity p-0.5" onclick="this.parentElement.remove()">
        <span class="material-symbols-outlined text-[16px]">close</span>
      </button>
    `;

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.add('translate-y-2', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  },

  success(title, message) {
    this.show(title, message, 'success');
  },

  error(title, message) {
    this.show(title, message, 'error');
  },

  info(title, message) {
    this.show(title, message, 'info');
  },

  luxury(title, message) {
    this.show(title, message, 'luxury');
  }
};

window.Toast = Toast;
