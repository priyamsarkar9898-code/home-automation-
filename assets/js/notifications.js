/**
 * HOME 2.0 - TOAST NOTIFICATION SYSTEM
 * Handles transient floating alerts for hardware state changes, timer triggers, and safety warnings.
 */

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl theme-subcard border shadow-2xl theme-text-strong text-xs font-semibold transition-all duration-300 transform translate-y-3 opacity-0';
  
  let icon = 'check_circle';
  let iconColor = 'text-emerald-500 dark:text-emerald-400';
  if (type === 'warning' || type === 'lock') {
    icon = 'lock';
    iconColor = 'text-amber-500';
  } else if (type === 'info') {
    icon = 'info';
    iconColor = 'text-blue-500 dark:text-blue-400';
  }

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[19px]">${icon}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-3');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Expose globally
window.showToast = showToast;
