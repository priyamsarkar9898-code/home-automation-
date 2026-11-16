/*
 * ======================================================================================
 * Home 2.0 - Precision ESP32 IoT Controller Firmware
 * ======================================================================================
 * Target Board: ESP32 Dev Module / ESP32-WROOM-32
 * Features:
 *   - 3x Channel Relay Outputs (Active LOW / HIGH selectable)
 *   - 3x Physical Wall Switch Inputs with Dual-Way Interlock & Software Debounce
 *   - Master Lock Safety Override
 *   - Non-Volatile Memory (Preferences / EEPROM) State & Label Persistence
 *   - High-Speed UART Telemetry (115200 Baud)
 *   - Built-in WiFi Web Server & REST API for Frontend Dashboard Synchronization
 * ======================================================================================
 */

#include <WiFi.h>
#include <WebServer.h>
#include <Preferences.h>

// --------------------------------------------------------------------------------------
// PIN CONFIGURATION (Matches Home 2.0 Dashboard Pinouts)
// --------------------------------------------------------------------------------------
// Relays
#define PIN_RELAY_1       21    // Channel 01: Bedroom Tube Light
#define PIN_RELAY_2       19    // Channel 02: Bedroom Small Light
#define PIN_RELAY_3       18    // Channel 03: Bedroom Fan

// Physical 2-Way Wall Switches
#define PIN_WALL_1        12    // Wall Switch 1 Input (Pullup)
#define PIN_WALL_2        14    // Wall Switch 2 Input (Pullup)
#define PIN_WALL_3        27    // Wall Switch 3 Input (Pullup)

// Relay Logic (Most relay boards are Active LOW; set to LOW for ON, HIGH for OFF)
#define RELAY_ACTIVE_LEVEL LOW
#define RELAY_IDLE_LEVEL   HIGH

// --------------------------------------------------------------------------------------
// DATA STRUCTURES & GLOBALS
// --------------------------------------------------------------------------------------
struct Channel {
  uint8_t relayPin;
  uint8_t wallPin;
  bool state;             // true = ON, false = OFF
  int lastWallRead;       // for debouncing physical switch
  unsigned long lastDebounce;
  String name;
  String subtext;
  uint16_t watts;
};

Channel channels[3] = {
  { PIN_RELAY_1, PIN_WALL_1, true,  HIGH, 0, "Bedroom Tube Light", "Primary Ceiling Luminaire", 36 },
  { PIN_RELAY_2, PIN_WALL_2, false, HIGH, 0, "Bedroom Small Light", "Bedside Ambient Sconce", 18 },
  { PIN_RELAY_3, PIN_WALL_3, true,  HIGH, 0, "Bedroom Fan", "Ceiling Inverter Motor • Speed 3", 52 }
};

bool masterLockArmed = true; // true = unlocked & functional, false = locked out
WebServer server(80);
Preferences prefs;

const unsigned long DEBOUNCE_DELAY_MS = 50;

// --------------------------------------------------------------------------------------
// HARDWARE RELAY CONTROL
// --------------------------------------------------------------------------------------
void writeRelay(int index, bool on) {
  channels[index].state = on;
  digitalWrite(channels[index].relayPin, on ? RELAY_ACTIVE_LEVEL : RELAY_IDLE_LEVEL);
  prefs.putBool(("ch_state_" + String(index)).c_str(), on);
}

void toggleRelay(int index) {
  if (!masterLockArmed) {
    Serial.println(F("[SECURITY] Master Lock is armed! Switching prohibited."));
    return;
  }
  writeRelay(index, !channels[index].state);
  Serial.printf("[RELAY] Channel %d toggled to: %s\n", index + 1, channels[index].state ? "ON" : "OFF");
}

// --------------------------------------------------------------------------------------
// PHYSICAL DUAL-SWITCH WALL INTERLOCK
// --------------------------------------------------------------------------------------
void checkWallSwitches() {
  for (int i = 0; i < 3; i++) {
    int currentRead = digitalRead(channels[i].wallPin);
    if (currentRead != channels[i].lastWallRead) {
      if ((millis() - channels[i].lastDebounce) > DEBOUNCE_DELAY_MS) {
        channels[i].lastWallRead = currentRead;
        channels[i].lastDebounce = millis();
        // Toggle the relay state when wall switch position changes (Dual-way interlock)
        if (masterLockArmed) {
          toggleRelay(i);
          Serial.printf("[WALL] Physical switch %d flipped on Pin %d\n", i + 1, channels[i].wallPin);
        }
      }
    }
  }
}

// --------------------------------------------------------------------------------------
// REST API & WEB ENDPOINTS
// --------------------------------------------------------------------------------------
void sendCORSHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleGetStatus() {
  sendCORSHeaders();
  String json = "{";
  json += "\"masterLockArmed\":" + String(masterLockArmed ? "true" : "false") + ",";
  json += "\"devices\":[";
  for (int i = 0; i < 3; i++) {
    json += "{";
    json += "\"id\":" + String(i) + ",";
    json += "\"name\":\"" + channels[i].name + "\",";
    json += "\"subtext\":\"" + channels[i].subtext + "\",";
    json += "\"relayPin\":\"D" + String(channels[i].relayPin) + "\",";
    json += "\"wallPin\":\"D" + String(channels[i].wallPin) + "\",";
    json += "\"isOn\":" + String(channels[i].state ? "true" : "false") + ",";
    json += "\"wallState\":" + String(channels[i].lastWallRead == LOW ? 1 : 0) + ",";
    json += "\"powerWatts\":" + String(channels[i].watts);
    json += "}";
    if (i < 2) json += ",";
  }
  json += "]}";
  server.send(200, "application/json", json);
}

void handleToggle() {
  sendCORSHeaders();
  if (server.hasArg("channel")) {
    int ch = server.arg("channel").toInt();
    if (ch >= 0 && ch < 3) {
      toggleRelay(ch);
      handleGetStatus();
      return;
    }
  }
  server.send(400, "application/json", "{\"error\":\"Invalid channel\"}");
}

// --------------------------------------------------------------------------------------
// SETUP & LOOP
// --------------------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(500);
  Serial.println(F("\n=============================================="));
  Serial.println(F(" HOME 2.0 - PRECISION ESP32 CONTROLLER BOOTING"));
  Serial.println(F("=============================================="));

  prefs.begin("home_nvram", false);

  // Initialize GPIO Pins
  for (int i = 0; i < 3; i++) {
    pinMode(channels[i].relayPin, OUTPUT);
    pinMode(channels[i].wallPin, INPUT_PULLUP);
    channels[i].lastWallRead = digitalRead(channels[i].wallPin);

    // Read stored state from NVRAM
    bool savedState = prefs.getBool(("ch_state_" + String(i)).c_str(), channels[i].state);
    writeRelay(i, savedState);
  }

  // Setup WiFi Access Point or Station
  WiFi.mode(WIFI_AP);
  WiFi.softAP("Home2.0-Controller", "esp32secure");
  Serial.print(F("[WIFI] Access Point Created. Gateway IP: "));
  Serial.println(WiFi.softAPIP());

  // Setup REST Endpoints
  server.on("/api/status", HTTP_GET, handleGetStatus);
  server.on("/api/toggle", HTTP_POST, handleToggle);
  server.begin();
  Serial.println(F("[HTTP] Embedded Dashboard Server Listening on Port 80."));
}

void loop() {
  server.handleClient();
  checkWallSwitches();

  // Serial UART Command Processor
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    if (cmd == "STATUS") {
      handleGetStatus();
    } else if (cmd.startsWith("TOGGLE:")) {
      int ch = cmd.substring(7).toInt();
      if (ch >= 0 && ch < 3) toggleRelay(ch);
    }
  }
}
