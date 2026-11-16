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
