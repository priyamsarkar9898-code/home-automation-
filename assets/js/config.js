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
