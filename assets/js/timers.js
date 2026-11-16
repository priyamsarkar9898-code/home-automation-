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
