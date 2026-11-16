/**
 * HOME 2.0 - MASTER LOCK SAFETY CONTROLLER
 * Provides single-point safety lockouts to prevent inadvertent switching of IoT relays.
 */

// Master Lock Safety Verification Guard
function checkMasterLock() {
  if (!state.masterLockArmed) {
    showToast('⚠️ Master Lock is ENGAGED! Unlock controls via the Master Lock switch.', 'warning');
    const banner = document.getElementById('master-lockout-banner');
    if (banner) {
      banner.classList.add('scale-[1.02]');
      setTimeout(() => banner.classList.remove('scale-[1.02]'), 200);
    }
    return false;
  }
  return true;
}

// Update Master Lock UI Appearance
function renderMasterLockState() {
  const isArmed = state.masterLockArmed;
  const ring = document.getElementById('master-lock-ring');
  const icon = document.getElementById('master-lock-icon');
  const tinyLabel = document.getElementById('master-lock-tiny-label');
  const statusText = document.getElementById('master-system-status');
  const statusSubtext = document.getElementById('master-system-subtext');
  const toggleBtnText = document.getElementById('btn-toggle-lock-text');
  const headerBadge = document.getElementById('header-lock-badge');
  const headerIcon = document.getElementById('header-lock-icon');
  const headerText = document.getElementById('header-lock-text');
  const lockoutBanner = document.getElementById('master-lockout-banner');

  if (isArmed) {
    // SYSTEM OPERATIONAL / CONTROLS UNLOCKED
    if (ring) {
      ring.className = 'absolute inset-0 rounded-full border-4 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.55)] animate-ring-pulse transition-all';
    }
    if (icon) {
      icon.textContent = 'lock_open';
      icon.className = 'material-symbols-outlined text-emerald-500 dark:text-emerald-400 text-[40px] group-hover:scale-110 transition-transform';
    }
    if (tinyLabel) {
      tinyLabel.textContent = 'UNLOCKED';
      tinyLabel.className = 'text-[9px] font-extrabold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 mt-0.5';
    }
    if (statusText) {
      statusText.textContent = 'MASTER LOCK ENGAGED (OPERATIONAL)';
      statusText.className = 'text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 transition-colors';
    }
    if (statusSubtext) {
      statusSubtext.textContent = 'Dashboard & Switches Fully Unlocked';
    }
    if (toggleBtnText) toggleBtnText.textContent = 'Tap to Lock Panel';
    if (lockoutBanner) lockoutBanner.classList.add('hidden');

    if (headerBadge) {
      headerBadge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400 transition-all';
    }
    if (headerIcon) headerIcon.textContent = 'lock_open';
    if (headerText) headerText.textContent = 'SYSTEM UNLOCKED';
  } else {
    // LOCKED OUT / SAFETY GUARD ACTIVE
    if (ring) {
      ring.className = 'absolute inset-0 rounded-full border-4 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.6)] animate-ring-pulse transition-all';
    }
    if (icon) {
      icon.textContent = 'lock';
      icon.className = 'material-symbols-outlined text-amber-500 text-[40px] group-hover:scale-110 transition-transform';
    }
    if (tinyLabel) {
      tinyLabel.textContent = 'LOCKED';
      tinyLabel.className = 'text-[9px] font-extrabold uppercase tracking-widest text-amber-500 mt-0.5';
    }
    if (statusText) {
      statusText.textContent = 'MASTER LOCK DISARMED (SAFE LOCKOUT)';
      statusText.className = 'text-xs font-bold uppercase tracking-wider text-amber-500 transition-colors';
    }
    if (statusSubtext) {
      statusSubtext.textContent = 'All controls protected against changes';
    }
    if (toggleBtnText) toggleBtnText.textContent = 'Tap to Unlock Panel';
    if (lockoutBanner) lockoutBanner.classList.remove('hidden');

    if (headerBadge) {
      headerBadge.className = 'flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-amber-500/10 border-amber-500/30 text-amber-500 transition-all';
    }
    if (headerIcon) headerIcon.textContent = 'lock';
    if (headerText) headerText.textContent = 'PANEL LOCKED';
  }
}

// Toggle Master Lock
function toggleMasterLock() {
  state.masterLockArmed = !state.masterLockArmed;
  renderMasterLockState();
  if (state.masterLockArmed) {
    showToast('✓ Master Lock Disengaged: Controller authority & switches UNLOCKED.');
  } else {
    showToast('🔒 Master Lock Engaged: All appliance switches and automations LOCKED.', 'warning');
  }
}

// Expose globally
window.checkMasterLock = checkMasterLock;
window.renderMasterLockState = renderMasterLockState;
window.toggleMasterLock = toggleMasterLock;
