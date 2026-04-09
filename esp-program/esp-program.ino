#include <WiFi.h>
#include <SocketIOclient.h>
#include <ArduinoJson.h>

// 🔐 WIFI
const char* ssid = "Aristod Hotspot";
const char* password = "123456789";

// 🌐 SERVEUR
const char* host = "192.168.1.100"; // ⚠️ IP PC
const uint16_t port = 3000;

// 🆔 IDENTIFIANT UNIQUE
String deviceId = "ESP32_001";

// 🔌 SOCKET
SocketIOclient socketIO;

// ⏱️ Timer simulation scan
unsigned long scanStart = 0;
bool scanning = false;

void setup() {
  Serial.begin(115200);

  // 📡 Connexion WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connexion WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nConnecté !");
  Serial.println(WiFi.localIP());

  // 🔌 Connexion Socket.IO
  socketIO.begin(host, port, "/socket.io/?EIO=4");

  socketIO.onEvent(socketIOEvent);

  // 🔁 Reconnexion auto
  socketIO.setReconnectInterval(5000);
}

void loop() {
  socketIO.loop();

  // 🔄 Simulation scan fingerprint
  if (scanning && millis() - scanStart > 3000) {
    scanning = false;

    Serial.println("Empreinte OK ✅");

    sendFingerprintResult("OK");
  }
}

// 📡 Gestion événements Socket.IO
void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {

  switch(type) {

    case sIOtype_CONNECT:
      Serial.println("Connecté au serveur Socket.IO");

      // 🔥 Envoi deviceId + type
      sendAuth();
      break;

    case sIOtype_EVENT: {
      Serial.printf("Event reçu: %s\n", payload);

      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);

      String eventName = doc[0];

      if (eventName == "scan-fingerprint") {
        Serial.println("Scan demandé 👆");

        startScan();
      }
      break;
    }

    case sIOtype_DISCONNECT:
      Serial.println("Déconnecté");
      break;

    default:
      break;
  }
}

// 🔐 Envoyer identification (IMPORTANT)
void sendAuth() {
  DynamicJsonDocument doc(256);

  JsonArray data = doc.to<JsonArray>();
  data.add("auth");

  JsonObject obj = data.createNestedObject();
  obj["deviceId"] = deviceId;
  obj["type"] = "esp32";

  String output;
  serializeJson(doc, output);

  socketIO.sendEVENT(output);
}

// 👆 Lancer scan
void startScan() {
  scanning = true;
  scanStart = millis();

  Serial.println("Scan en cours...");
}

// 📤 Envoyer résultat
void sendFingerprintResult(String status) {
  DynamicJsonDocument doc(256);

  JsonArray data = doc.to<JsonArray>();
  data.add("fingerprint-result");

  JsonObject obj = data.createNestedObject();
  obj["deviceId"] = deviceId;
  obj["status"] = status;

  String output;
  serializeJson(doc, output);

  socketIO.sendEVENT(output);
}
