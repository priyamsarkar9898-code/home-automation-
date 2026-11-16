/**
 * HOME 2.0 - DEVICE CONTROLLERS & RENDERING ENGINE
 * Manages load telemetry, relay switching, physical dual-switch wall interlocks, and visual statuses.
 */

// Counters & Watts calculation
function updateCounters() {
  const activeCount = state.devices.filter(d => d.isOn).length;
  const totalWatts = state.devices.reduce((acc, d) => acc + (d.isOn ? d.powerWatts : 0), 0);

  const headerCount = document.getElementById('header-active-count');
  if (headerCount) headerCount.textContent = `${activeCount} / 3 Active`;

  const masterLoadText = document.getElementById('master-load-text');
  if (masterLoadText) masterLoadText.textContent = `${activeCount} / 3 LOAD ACTIVE (${totalWatts}W)`;

  const masterDot = document.getElementById('master-load-indicator-dot');
  if (masterDot) {
    if (activeCount > 0) {
      masterDot.className = 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
    } else {
      masterDot.className = 'w-2 h-2 rounded-full bg-slate-400 dark:bg-slate-500';
    }
  }
}

// Render Device 1: Bedroom Tube Light (Warm Amber/Gold Accent)
function renderDevice1() {
  const d = state.devices[0];
  const btn = document.getElementById('btn-toggle-1');
  if (!btn) return;

  const icon = document.getElementById('icon-dev-1');
  const ring = document.getElementById('ring-dev-1');
  const glow = document.getElementById('glow-dev-1');
  const dot = document.getElementById('dot-dev-1');
  const text = document.getElementById('state-text-dev-1');
  const wallText = document.getElementById('wall-text-dev-1');
  const isDark = document.documentElement.classList.contains('dark');

  if (d.isOn) {
    btn.style.backgroundColor = isDark ? '#2a1a05' : '#fef3c7';
    btn.style.borderColor = '#f59e0b';
    btn.style.borderWidth = '2px';
    btn.style.boxShadow = isDark ? '0 0 32px rgba(245, 158, 11, 0.55)' : '0 8px 24px rgba(245, 158, 11, 0.35)';
    if (ring) ring.classList.remove('hidden');
    if (icon) {
      icon.className = 'material-symbols-outlined text-amber-500 text-[36px] transition-transform duration-200';
      icon.style.fontVariationSettings = "'FILL' 1";
    }
    if (glow) glow.classList.remove('opacity-0');
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse';
    if (text) {
      text.className = 'text-xs font-bold text-emerald-500 dark:text-emerald-400';
      text.textContent = `ON (${d.powerWatts}W)`;
    }
  } else {
    btn.style.backgroundColor = '';
    btn.style.borderColor = '';
    btn.style.borderWidth = '';
    btn.style.boxShadow = 'none';
    if (ring) ring.classList.add('hidden');
    if (icon) {
      icon.className = 'material-symbols-outlined theme-text-muted text-[36px] transition-transform duration-200';
      icon.style.fontVariationSettings = "'FILL' 0";
    }
    if (glow) glow.classList.add('opacity-0');
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500';
    if (text) {
      text.className = 'text-xs font-bold theme-text-muted';
      text.textContent = 'OFF (0W)';
    }
  }

  if (wallText) {
    if (d.wallState === 1) {
      wallText.className = 'text-xs font-semibold theme-text-strong mt-0.5';
      wallText.textContent = 'STATE 1 (Synced)';
    } else {
      wallText.className = 'text-xs font-semibold theme-text-muted mt-0.5';
      wallText.textContent = 'STATE 0 (Normal)';
    }
  }
}

// Render Device 2: Bedroom Small Light (Ambient Blue Accent)
function renderDevice2() {
  const d = state.devices[1];
  const btn = document.getElementById('btn-toggle-2');
  if (!btn) return;

  const icon = document.getElementById('icon-dev-2');
  const ring = document.getElementById('ring-dev-2');
  const glow = document.getElementById('glow-dev-2');
  const dot = document.getElementById('dot-dev-2');
  const text = document.getElementById('state-text-dev-2');
  const wallText = document.getElementById('wall-text-dev-2');
  const badgeCh = document.getElementById('badge-ch-2');
  const isDark = document.documentElement.classList.contains('dark');

  if (d.isOn) {
    btn.style.backgroundColor = isDark ? '#112240' : '#e0edff';
    btn.style.borderColor = '#3b82f6';
    btn.style.borderWidth = '2px';
    btn.style.boxShadow = isDark ? '0 0 32px rgba(59, 130, 246, 0.55)' : '0 8px 24px rgba(59, 130, 246, 0.35)';
    if (ring) ring.classList.remove('hidden');
    if (icon) {
      icon.className = 'material-symbols-outlined text-blue-500 text-[36px] transition-transform duration-200';
      icon.style.fontVariationSettings = "'FILL' 1";
      icon.textContent = 'lightbulb';
    }
    if (glow) glow.classList.remove('opacity-0');
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse';
    if (text) {
      text.className = 'text-xs font-bold text-emerald-500 dark:text-emerald-400';
      text.textContent = `ON (${d.powerWatts}W)`;
    }
    if (badgeCh) badgeCh.className = 'px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/40 text-blue-500 dark:text-blue-400 font-bold text-[10px] tracking-wider uppercase';
  } else {
    btn.style.backgroundColor = '';
    btn.style.borderColor = '';
    btn.style.borderWidth = '';
    btn.style.boxShadow = 'none';
    if (ring) ring.classList.add('hidden');
    if (icon) {
      icon.className = 'material-symbols-outlined theme-text-muted text-[36px] transition-transform duration-200';
      icon.style.fontVariationSettings = "'FILL' 0";
      icon.textContent = 'bedtime';
    }
    if (glow) glow.classList.add('opacity-0');
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500';
    if (text) {
      text.className = 'text-xs font-bold theme-text-muted';
      text.textContent = 'OFF (0W)';
    }
    if (badgeCh) badgeCh.className = 'px-2.5 py-0.5 rounded-full theme-subcard border theme-text-muted font-bold text-[10px] tracking-wider uppercase';
  }

  if (wallText) {
    if (d.wallState === 1) {
      wallText.className = 'text-xs font-semibold theme-text-strong mt-0.5';
      wallText.textContent = 'STATE 1 (Synced)';
    } else {
      wallText.className = 'text-xs font-semibold theme-text-muted mt-0.5';
      wallText.textContent = 'STATE 0 (Normal)';
    }
  }
}

// Render Device 3: Bedroom Fan (Vivid Emerald Spin)
function renderDevice3() {
  const d = state.devices[2];
  const btn = document.getElementById('fan-toggle-btn');
  if (!btn) return;

  const icon = document.getElementById('fan-icon');
  const ring = document.getElementById('fan-pulse-ring');
  const glow = document.getElementById('glow-dev-3');
  const dot = document.getElementById('dot-dev-3');
  const text = document.getElementById('state-text-dev-3');
  const wallText = document.getElementById('wall-text-dev-3');
  const isDark = document.documentElement.classList.contains('dark');

  if (d.isOn) {
    btn.style.backgroundColor = isDark ? '#064e3b' : '#dcfce7';
    btn.style.borderColor = '#10b981';
    btn.style.borderWidth = '2px';
    btn.style.boxShadow = isDark ? '0 0 32px rgba(16, 185, 129, 0.55)' : '0 8px 24px rgba(16, 185, 129, 0.35)';
    if (ring) ring.classList.remove('hidden');
    if (icon) {
      icon.className = 'material-symbols-outlined text-emerald-500 dark:text-emerald-400 text-[38px] fan-spin';
      icon.classList.remove('fan-stopped');
    }
    if (glow) glow.classList.remove('opacity-0');
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse';
    if (text) {
      text.className = 'text-xs font-bold text-emerald-500 dark:text-emerald-400';
      text.textContent = `ON (${d.powerWatts}W)`;
    }
  } else {
    btn.style.backgroundColor = '';
    btn.style.borderColor = '';
    btn.style.borderWidth = '';
    btn.style.boxShadow = 'none';
    if (ring) ring.classList.remove('hidden');
    if (icon) {
      icon.className = 'material-symbols-outlined theme-text-muted text-[38px] fan-stopped';
    }
    if (glow) glow.classList.add('opacity-0');
    if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500';
    if (text) {
      text.className = 'text-xs font-bold theme-text-muted';
      text.textContent = 'OFF (0W)';
    }
  }

  if (wallText) {
    if (d.wallState === 1) {
      wallText.className = 'text-xs font-semibold text-emerald-500 dark:text-emerald-400 mt-0.5';
      wallText.textContent = 'STATE 1 (Synced)';
    } else {
      wallText.className = 'text-xs font-semibold theme-text-muted mt-0.5';
      wallText.textContent = 'STATE 0 (Normal)';
    }
  }
}

// Master device rendering
function renderAllDevices() {
  renderDevice1();
  renderDevice2();
  renderDevice3();
  updateCounters();
}

// Individual Device Toggle (With Master Lock Guard)
function toggleDevice(index) {
  if (!checkMasterLock()) return;
  const d = state.devices[index];
  d.isOn = !d.isOn;
  renderAllDevices();
  showToast(`ESP32: Relay ${d.pin} (${d.name}) switched ${d.isOn ? 'ON' : 'OFF'}.`);
}

// Wall Interlock toggle
function toggleWallState(index) {
  if (!checkMasterLock()) return;
  const d = state.devices[index];
  d.wallState = d.wallState === 1 ? 0 : 1;
  renderAllDevices();
  showToast(`Physical wall switch (Pin ${d.wallPin}) flipped for ${d.name}.`);
}

// Bulk Channels On / Off (With Master Lock Guard)
function setAllChannels(targetState) {
  if (!checkMasterLock()) return;
  state.devices.forEach(d => {
    d.isOn = targetState;
  });
  renderAllDevices();
  showToast(targetState ? 'All Channels switched ON.' : 'All Channels switched OFF.');
}

// Expose globally
window.updateCounters = updateCounters;
window.renderDevice1 = renderDevice1;
window.renderDevice2 = renderDevice2;
window.renderDevice3 = renderDevice3;
window.renderAllDevices = renderAllDevices;
window.toggleDevice = toggleDevice;
window.toggleWallState = toggleWallState;
window.setAllChannels = setAllChannels;
