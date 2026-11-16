# ESP32 Hardware Pinout & Wiring Specifications

This document outlines the hardware connection diagram, GPIO mappings, and electrical considerations for the **Home 2.0 Precision ESP32 IoT Controller**.

---

## 1. Pin Assignment Summary

| Channel | Appliance / Load | ESP32 Relay Pin | Relay Output | ESP32 Wall Switch Pin | Wall Switch Mode |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CH 01** | Bedroom Tube Light (36W) | `GPIO 21` (D21) | Active LOW | `GPIO 12` (D12) | Internal Pull-Up |
| **CH 02** | Bedroom Small Light (18W)| `GPIO 19` (D19) | Active LOW | `GPIO 14` (D14) | Internal Pull-Up |
| **CH 03** | Bedroom Fan (52W) | `GPIO 18` (D18) | Active LOW | `GPIO 27` (D27) | Internal Pull-Up |

---

## 2. Relay Module Interface

- **Relay Driving Signal:** Standard 3-channel 5V or 3.3V optocoupled relay board.
- **Relay VCC:** Connect to 5V (VIN / external regulated 5V power supply).
- **Relay GND:** Common Ground with ESP32.
- **Relay Inputs (IN1, IN2, IN3):**
  - `IN1` -> `GPIO 21`
  - `IN2` -> `GPIO 19`
  - `IN3` -> `GPIO 18`
- **Output Contacts:**
  - Common (`COM`): Connected to AC Live Mains (through a 5A–10A fuse / circuit breaker).
  - Normally Open (`NO`): Connected to appliance phase input.

> [!CAUTION]
> **Mains Voltage Safety:** AC mains voltage (110V/230V) is lethal! Always disconnect main breakers prior to handling wiring, and ensure high-voltage traces maintain adequate creepage clearance.

---

## 3. Physical Wall Switch Interlock (Dual-Way Logic)

The controller supports hybrid physical wall switch control and software control simultaneously:
- The wall switches connect between the assigned GPIO and Ground (`GND`).
- ESP32 internal pullup resistors are enabled on `GPIO 12`, `GPIO 14`, and `GPIO 27`.
- When an occupant toggles the mechanical wall switch on the wall:
  1. The firmware detects the state change through software debouncing (50ms window).
  2. The relay state is immediately inverted, preserving seamless synchronicity between web UI and physical switches.

---

## 4. Telemetry & Communications

- **UART Serial Interface:**
  - TX0 / RX0 on `115200 Baud`
- **Wi-Fi Connectivity:**
  - 802.11 b/g/n (2.4 GHz)
  - HTTP REST endpoints on Port 80 (`/api/status`, `/api/toggle`)
