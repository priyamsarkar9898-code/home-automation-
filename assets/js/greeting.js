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
