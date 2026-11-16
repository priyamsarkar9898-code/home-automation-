/**
 * HOME 2.0 - THEME SWITCHER
 * Seamless toggling between Precision Dark and Warm Sand Light interfaces.
 */

function toggleTheme() {
  const html = document.documentElement;
  const themeIcon = document.getElementById('theme-icon');
  
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    state.theme = 'light';
    if (themeIcon) {
      themeIcon.textContent = 'dark_mode';
      themeIcon.className = 'material-symbols-outlined text-[20px] text-amber-700';
    }
    showToast('Switched to Warm Sand Theme.', 'info');
  } else {
    html.classList.add('dark');
    state.theme = 'dark';
    if (themeIcon) {
      themeIcon.textContent = 'light_mode';
      themeIcon.className = 'material-symbols-outlined text-[20px] text-amber-400';
    }
    showToast('Switched to Precision Dark Interface.', 'info');
  }
  renderAllDevices();
}

// Expose globally
window.toggleTheme = toggleTheme;
