/**
 * HOME 2.0 - HARDWARE & APP CONFIGURATION / STATE STORE
 * Manages the global reactive state for relays, physical switches, timers, and locks.
 */

const state = {
  masterLockArmed: true, // TRUE = Controls unlocked & operational; FALSE = Controls locked out
  theme: 'dark',
  devices: [
    {
      id: 0,
      pin: 'D21',
      wallPin: 'D12',
      name: 'Bedroom Tube Light',
      subtext: 'Primary Ceiling Luminaire',
      type: 'light',
      powerWatts: 36,
      isOn: true,
      wallState: 1,
      schedule: { action: 'Turn ON', cadence: 'Every day', time: '07:30 PM', active: true },
      timerSeconds: null,
      timerInterval: null
    },
    {
      id: 1,
      pin: 'D19',
      wallPin: 'D14',
      name: 'Bedroom Small Light',
      subtext: 'Bedside Ambient Sconce',
      type: 'light',
      powerWatts: 18,
      isOn: false,
      wallState: 0,
      schedule: null,
      timerSeconds: null,
      timerInterval: null
    },
    {
      id: 2,
      pin: 'D18',
      wallPin: 'D27',
      name: 'Bedroom Fan',
      subtext: 'Ceiling Inverter Motor • Speed 3',
      type: 'fan',
      powerWatts: 52,
      isOn: true,
      wallState: 1,
      schedule: null,
      timerSeconds: 512, // 8m 32s initial countdown
      timerInterval: null
    }
  ]
};

// Expose state globally for browser interop
window.state = state;
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
/**
 * HOME 2.0 - REAL-TIME CLOCK & DYNAMIC GREETING
 * Calculates local diurnal phases and renders real-time status beacon.
 */

function updateRealtimeGreeting() {
  const now = new Date();
  const hours = now.getHours();
  const greetingEl = document.getElementById('dynamic-greeting-text');
  const greetingIcon = document.getElementById('greeting-icon');
  const clockEl = document.getElementById('live-clock-text');

  let greeting = 'Good evening';
  let icon = 'nights_stay';

  if (hours >= 5 && hours < 12) {
    greeting = 'Good morning';
    icon = 'wb_sunny';
  } else if (hours >= 12 && hours < 17) {
    greeting = 'Good afternoon';
    icon = 'light_mode';
  } else if (hours >= 17 && hours < 22) {
    greeting = 'Good evening';
    icon = 'wb_twilight';
  } else {
    greeting = 'Good night';
    icon = 'bedtime';
  }

  if (greetingEl) greetingEl.textContent = greeting;
  if (greetingIcon) greetingIcon.textContent = icon;

  if (clockEl) {
    let hh = hours % 12 || 12;
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    clockEl.textContent = `${hh}:${mm} ${ampm}`;
  }
}

// Expose globally
window.updateRealtimeGreeting = updateRealtimeGreeting;
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
/**
 * HOME 2.0 - TIMERS & SCHEDULING SYSTEM
 * Manages in-card countdown micro-timers, recurring schedules, and automation callbacks.
 */

// Tab switcher between Quick Timer and Schedule inside each card
function switchCardTab(devIndex, targetTab) {
  const cardNum = devIndex + 1;
  const timerBtn = document.getElementById(`tab-timer-btn-${cardNum}`);
  const schedBtn = document.getElementById(`tab-sched-btn-${cardNum}`);
  const timerView = document.getElementById(`card-timer-view-${cardNum}`);
  const schedView = document.getElementById(`card-sched-view-${cardNum}`);

  if (!timerBtn || !schedBtn || !timerView || !schedView) return;

  if (targetTab === 'timer') {
    timerBtn.className = 'py-1.5 rounded-lg theme-tab-active font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer';
    schedBtn.className = 'py-1.5 rounded-lg theme-text-muted hover:theme-text-strong flex items-center justify-center gap-1.5 transition-all cursor-pointer';
    timerView.classList.remove('hidden');
    schedView.classList.add('hidden');
  } else {
    schedBtn.className = 'py-1.5 rounded-lg theme-tab-active font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer';
    timerBtn.className = 'py-1.5 rounded-lg theme-text-muted hover:theme-text-strong flex items-center justify-center gap-1.5 transition-all cursor-pointer';
    schedView.classList.remove('hidden');
    timerView.classList.add('hidden');
  }
}

// Arm Device Timer
function armDeviceTimer(devIndex) {
  if (!checkMasterLock()) return;

  const cardNum = devIndex + 1;
  const durationEl = document.getElementById(`timer-duration-${cardNum}`);
  const actionEl = document.getElementById(`timer-action-${cardNum}`);
  if (!durationEl || !actionEl) return;

  const mins = parseInt(durationEl.value, 10) || 15;
  const action = actionEl.value;
  const dev = state.devices[devIndex];

  dev.timerSeconds = mins * 60;
  if (dev.timerInterval) clearInterval(dev.timerInterval);

  const statusPill = document.getElementById(`status-pill-${cardNum}`);
  const title = document.getElementById(`active-rule-title-${cardNum}`);
  const text = document.getElementById(`active-rule-text-${cardNum}`);

  if (statusPill && title && text) {
    statusPill.className = 'flex flex-col gap-1 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400';
    title.innerHTML = '<span class="material-symbols-outlined text-[16px] animate-pulse">hourglass_top</span> Micro-Timer Active';
    text.className = 'text-xs theme-text-strong font-mono font-bold';
    text.textContent = `${action} in ${String(mins).padStart(2, '0')}:00 min`;
  }

  dev.timerInterval = setInterval(() => {
    dev.timerSeconds--;
    if (dev.timerSeconds <= 0) {
      clearInterval(dev.timerInterval);
      dev.timerInterval = null;
      dev.timerSeconds = null;
      dev.isOn = (action === 'Turn ON');
      renderAllDevices();
      if (text) text.textContent = `Timer completed: ${action}`;
      showToast(`⏱ Timer Triggered: ${dev.name} ${action}.`);
      return;
    }
    const m = Math.floor(dev.timerSeconds / 60);
    const s = dev.timerSeconds % 60;
    if (text) text.textContent = `${action} in ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} min`;
  }, 1000);

  showToast(`Timer Armed: ${dev.name} will ${action} in ${mins} min.`);
}

// Cancel Device Timer
function cancelDeviceTimer(devIndex) {
  if (!checkMasterLock()) return;
  const dev = state.devices[devIndex];
  if (dev.timerInterval) {
    clearInterval(dev.timerInterval);
    dev.timerInterval = null;
  }
  dev.timerSeconds = null;

  const cardNum = devIndex + 1;
  const statusPill = document.getElementById(`status-pill-${cardNum}`);
  const title = document.getElementById(`active-rule-title-${cardNum}`);
  const text = document.getElementById(`active-rule-text-${cardNum}`);

  if (statusPill && title && text) {
    statusPill.className = 'flex flex-col gap-1 p-2.5 rounded-xl theme-subcard theme-text-muted border';
    title.textContent = 'Timer Canceled';
    text.textContent = 'Standby • Ready for timer or recurring cron';
  }
  showToast(`Timer canceled for ${dev.name}.`);
}

// In-Card Commit Schedule
function commitInCardSchedule(devIndex) {
  if (!checkMasterLock()) return;
  const cardNum = devIndex + 1;
  const actionEl = document.getElementById(`csched-action-${cardNum}`);
  const timeEl = document.getElementById(`csched-time-${cardNum}`);
  const cadenceEl = document.getElementById(`csched-cadence-${cardNum}`);
  if (!actionEl || !timeEl || !cadenceEl) return;

  const action = actionEl.value;
  const time = timeEl.value;
  const cadence = cadenceEl.value;
  const dev = state.devices[devIndex];

  dev.schedule = { action, time, cadence, active: true };

  const statusPill = document.getElementById(`status-pill-${cardNum}`);

  if (statusPill) {
    statusPill.className = 'flex flex-col gap-1 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400';
    statusPill.innerHTML = `
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5 font-bold">
          <span class="material-symbols-outlined text-[16px]">schedule</span>
          <span>Active Schedule</span>
        </div>
        <div class="flex items-center gap-2 text-[11px]">
          <button class="hover:underline font-semibold cursor-pointer" onclick="editScheduleDirect(${devIndex})" type="button">Edit</button>
          <span>•</span>
          <button class="text-red-500 dark:text-red-400 hover:underline font-semibold cursor-pointer" onclick="clearScheduleDirect(${devIndex})" type="button">Delete</button>
        </div>
      </div>
      <span class="text-xs theme-text-strong font-medium">${action} • ${cadence} • ${time}</span>
    `;
  }
  showToast(`✓ Schedule Saved: ${dev.name} will ${action} at ${time} (${cadence})!`);
}

function clearScheduleDirect(devIndex) {
  if (!checkMasterLock()) return;
  const dev = state.devices[devIndex];
  dev.schedule = null;
  const cardNum = devIndex + 1;
  const statusPill = document.getElementById(`status-pill-${cardNum}`);
  if (statusPill) {
    statusPill.className = 'flex flex-col gap-1 p-2.5 rounded-xl theme-subcard theme-text-muted border';
    statusPill.innerHTML = `
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-[16px]">info</span>
          <span>No active schedule</span>
        </div>
      </div>
      <span class="text-xs theme-text-muted">Standby • Ready for timer or recurring cron</span>
    `;
  }
  showToast(`Schedule cleared for ${dev.name}.`);
}

function editScheduleDirect(devIndex) {
  switchCardTab(devIndex, 'schedule');
  showToast(`Editing schedule for ${state.devices[devIndex].name}.`, 'info');
}

// Fan initial countdown timer
function initFanInitialTimer() {
  const dev = state.devices[2];
  const text = document.getElementById('active-rule-text-3');

  dev.timerInterval = setInterval(() => {
    if (dev.timerSeconds <= 0) {
      clearInterval(dev.timerInterval);
      dev.timerInterval = null;
      dev.isOn = false;
      renderAllDevices();
      if (text) text.textContent = 'Timer Expired: Turned OFF';
      showToast('Bedroom Fan timer expired: Switched OFF.');
      return;
    }
    dev.timerSeconds--;
    const m = Math.floor(dev.timerSeconds / 60);
    const s = dev.timerSeconds % 60;
    if (text) text.textContent = `Turning OFF in ${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} min`;
  }, 1000);
}

// Expose globally for inline onclick handlers and orchestrators
window.switchCardTab = switchCardTab;
window.armDeviceTimer = armDeviceTimer;
window.cancelDeviceTimer = cancelDeviceTimer;
window.commitInCardSchedule = commitInCardSchedule;
window.clearScheduleDirect = clearScheduleDirect;
window.editScheduleDirect = editScheduleDirect;
window.initFanInitialTimer = initFanInitialTimer;
/**
 * HOME 2.0 - HARDWARE & EEPROM / NVRAM SETTINGS CONTROLLER
 * Manages modal interactions for renaming channels and customizing subtext designations.
 */

// Open Settings Modal
function openSettingsModal() {
  if (!checkMasterLock()) return;
  const modal = document.getElementById('settings-modal');
  const panel = document.getElementById('settings-modal-panel');
  if (!modal || !panel) return;

  state.devices.forEach((d, i) => {
    const n = document.getElementById(`input-name-${i}`);
    const s = document.getElementById(`input-sub-${i}`);
    if (n) n.value = d.name;
    if (s) s.value = d.subtext;
  });

  modal.classList.remove('opacity-0', 'pointer-events-none');
  panel.classList.remove('scale-95');
  panel.classList.add('scale-100');
}

// Close Settings Modal
function closeSettingsModal() {
  const modal = document.getElementById('settings-modal');
  const panel = document.getElementById('settings-modal-panel');
  if (!modal || !panel) return;

  panel.classList.remove('scale-100');
  panel.classList.add('scale-95');
  modal.classList.add('opacity-0', 'pointer-events-none');
}

// Save Device Settings to NVRAM simulation
function saveDeviceSettings() {
  state.devices.forEach((d, i) => {
    const n = document.getElementById(`input-name-${i}`);
    const s = document.getElementById(`input-sub-${i}`);
    if (n && n.value.trim()) d.name = n.value.trim();
    if (s && s.value.trim()) d.subtext = s.value.trim();

    const titleEl = document.getElementById(`title-dev-${i + 1}`);
    const subEl = document.getElementById(`sub-dev-${i + 1}`);
    if (titleEl) titleEl.textContent = d.name;
    if (subEl) subEl.textContent = d.subtext;
  });
  closeSettingsModal();
  showToast('✓ Hardware NVRAM updated with appliance names!');
}

// Expose globally
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.saveDeviceSettings = saveDeviceSettings;
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
/**
 * HOME 2.0 - MAIN APPLICATION ENTRY POINT & EVENT BINDINGS
 * Bootstraps the application, hooks event listeners to UI components, and triggers real-time updates.
 */

// Quick Hardware Sync telemetry probe
function quickSyncController() {
  const syncIcon = document.getElementById('sync-icon');
  if (syncIcon) {
    syncIcon.classList.add('rotate-[360deg]');
    setTimeout(() => syncIcon.classList.remove('rotate-[360deg]'), 500);
  }
  const jitter = Math.floor(13 + Math.random() * 6);
  const rttEl = document.getElementById('telemetry-rtt');
  const pingEl = document.getElementById('telemetry-ping');
  if (rttEl) rttEl.textContent = `${jitter}ms`;
  if (pingEl) pingEl.textContent = `${jitter}ms`;
  showToast(`Controller bus synchronized. Round trip latency: ${jitter}ms.`);
}

window.quickSyncController = quickSyncController;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Master Lock Buttons
  document.getElementById('master-lock-trigger')?.addEventListener('click', toggleMasterLock);
  document.getElementById('btn-toggle-lock-text')?.addEventListener('click', toggleMasterLock);
  document.getElementById('btn-banner-unlock')?.addEventListener('click', toggleMasterLock);

  // Bulk Power Matrix
  document.getElementById('btn-all-on')?.addEventListener('click', () => setAllChannels(true));
  document.getElementById('btn-all-off')?.addEventListener('click', () => setAllChannels(false));

  // Device Switches
  document.getElementById('btn-toggle-1')?.addEventListener('click', () => toggleDevice(0));
  document.getElementById('btn-toggle-2')?.addEventListener('click', () => toggleDevice(1));
  document.getElementById('fan-toggle-btn')?.addEventListener('click', () => toggleDevice(2));

  // Wall Switches
  document.getElementById('wall-toggle-1')?.addEventListener('click', () => toggleWallState(0));
  document.getElementById('wall-toggle-2')?.addEventListener('click', () => toggleWallState(1));
  document.getElementById('wall-toggle-3')?.addEventListener('click', () => toggleWallState(2));

  // Header & Modals
  document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleTheme);
  document.getElementById('btn-quick-sync')?.addEventListener('click', quickSyncController);
  document.getElementById('btn-open-settings')?.addEventListener('click', openSettingsModal);
  document.getElementById('btn-close-modal')?.addEventListener('click', closeSettingsModal);
  document.getElementById('btn-cancel-settings')?.addEventListener('click', closeSettingsModal);
  document.getElementById('btn-save-settings')?.addEventListener('click', saveDeviceSettings);

  // Close modal when clicking backdrop
  document.getElementById('settings-modal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('settings-modal')) closeSettingsModal();
  });

  // Dynamic Greeting init & continuous tick every 10 seconds
  updateRealtimeGreeting();
  setInterval(updateRealtimeGreeting, 10000);

  // Render initial states & initialize background timers
  renderMasterLockState();
  renderAllDevices();
  initFanInitialTimer();
});
