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
