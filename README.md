# Home 2.0 - Precision ESP32 IoT Home Automation Controller

A modern, responsive, precision IoT Home Automation control system designed for the **ESP32-WROOM-32** microcontroller. Features multi-channel relay switching, physical dual-switch wall interlocks with hardware synchronization, Master Safety Lockout authority, micro-controller timers, recurring cron schedules, EEPROM/NVRAM persistence, and dual-mode theme engine (Precision Dark & Warm Sand Light).

---

## 📁 Project Architecture & Folder Organization

The codebase is organized into modular directories separating markup, styles, application logic, embedded firmware, and documentation:

```text
home-automation-/
│
├── index.html                      # Main dashboard layout & user interface
├── README.md                       # Project documentation & setup instructions
├── .gitignore                      # Git ignore file for local artifacts
│
├── assets/                         # Static front-end assets
│   ├── css/                        # Modular stylesheet architecture
│   │   ├── style.css               # Master stylesheet combining all CSS modules
│   │   ├── theme.css               # Precision Dark & Warm Sand Light themes
│   │   └── animations.css          # Keyframes (fan rotation, pulsing indicator glow)
│   │
│   └── js/                         # Modular JavaScript application code
│       ├── config.js               # Reactive state store & initial device registry
│       ├── notifications.js        # Floating toast notification engine
│       ├── greeting.js             # Real-time clock & diurnal phase greeting system
│       ├── lock.js                 # Master Lock safety authority & interlock guard
│       ├── devices.js              # Channel switching, wall toggles & load telemetry
│       ├── timers.js               # Countdown micro-timers & scheduled automation
│       ├── settings.js             # Appliance customisation & NVRAM EEPROM settings modal
│       ├── theme.js                # High-contrast theme toggle controller
│       ├── main.js                 # Event listener bindings & bootstrap orchestrator
│       └── app.bundle.js           # Consolidated standalone bundle (optional single-file)
│
├── firmware/                       # Embedded hardware source code
│   └── esp32_home_controller.ino   # Production-ready Arduino C++ sketch for ESP32
│
└── docs/                           # Hardware specifications & architecture guides
    ├── PINOUT.md                   # Comprehensive GPIO pinout & relay schematic
    └── ARCHITECTURE.md             # Data flow, state management & design principles
```

---

## ⚡ Quick Start

### 1. Launch the Web Dashboard
No complex build steps or dependencies required! You can open the dashboard in several ways:
- **Direct in browser:** Double-click `index.html` (fully compatible with `file://` protocol).
- **With a local server (e.g., Python / Node / VS Code Live Server):**
  ```bash
  # Python 3
  python -m http.server 8080
  
  # Or with npx serve
  npx serve .
  ```
  Then navigate to `http://localhost:8080`.

### 2. Flashing the ESP32 Firmware
1. Open [`firmware/esp32_home_controller.ino`](file:///C:/Users/priya/Desktop/home/home-automation-/firmware/esp32_home_controller.ino) in the **Arduino IDE**.
2. Select your board: **Tools > Board > ESP32 Dev Module**.
3. Connect your ESP32 via USB and select the corresponding COM port (**Tools > Port**).
4. Click **Upload**.
5. Open Serial Monitor at **115200 Baud** to verify boot diagnostics and Wi-Fi IP address.

---

## 🔌 Hardware Specifications & Pinouts

| Channel | Appliance Target | Relay Pin | Wall Switch Pin | Rating | Mode |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Channel 01** | Bedroom Tube Light | `GPIO 21` (D21) | `GPIO 12` (D12) | 36W | Active LOW Relay, Pullup Input |
| **Channel 02** | Bedroom Small Light | `GPIO 19` (D19) | `GPIO 14` (D14) | 18W | Active LOW Relay, Pullup Input |
| **Channel 03** | Bedroom Fan | `GPIO 18` (D18) | `GPIO 27` (D27) | 52W | Active LOW Relay, Pullup Input |

For detailed wiring diagrams and electrical isolation instructions, see [`docs/PINOUT.md`](file:///C:/Users/priya/Desktop/home/home-automation-/docs/PINOUT.md).

---

## 🛡️ Key Features

- **Master Lock Authority:** One-click lockout mechanism that guards all individual toggles, bulk power switches, and automation triggers against accidental clicks.
- **Physical 2-Way Wall Switch Interlock:** Synchronizes mechanical toggle switches on the wall with the digital dashboard using edge-triggered debouncing.
- **Micro-Controller Timers & Schedules:** Configure countdown auto-off timers (5m to 60m) or time-of-day recurring automations per channel.
- **Real-Time Diurnal Greeting & Live Clock:** Automatically adapts greeting (Morning, Afternoon, Evening, Night) based on local time.
- **Dual Aesthetic Theme Engine:** High-contrast OLED dark mode with glowing accents or warm sand/cream daytime mode.
- **NVRAM / EEPROM Customization:** Rename appliance channels and subtexts with persistent memory simulation.

---

## 📖 Further Documentation

- [Hardware Pinout & Schematic Guide](file:///C:/Users/priya/Desktop/home/home-automation-/docs/PINOUT.md)
- [Software Architecture & Data Flow](file:///C:/Users/priya/Desktop/home/home-automation-/docs/ARCHITECTURE.md)
