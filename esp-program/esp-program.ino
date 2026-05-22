#include <WiFi.h>
#include <WebSocketsClient.h>
#include <Adafruit_Fingerprint.h>
#include <ArduinoJson.h>

// --- Config WiFi ---
const char* SSID     = "Aristod Hotspot";
const char* PASSWORD = "1234";

// --- Config WebSocket (ton serveur NestJS) ---
const char* WS_HOST = "192.168.137.1"; // IP de ton serveur
const int   WS_PORT = 3000;
const char* WS_PATH = "/";             // ou "/socket.io/..." si tu utilises Socket.IO

// --- AS608 sur Serial2 ---
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger(&mySerial);

WebSocketsClient webSocket;
bool wsConnected = false;

// -------------------------------------------------------
// CALLBACKS WEBSOCKET
// -------------------------------------------------------
void onWebSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_CONNECTED:
      wsConnected = true;
      Serial.println("[WS] Connecté au serveur");
      webSocket.sendTXT("{\"event\":\"hello\",\"data\":\"ESP32 connecté\"}");
      break;

    case WStype_DISCONNECTED:
      wsConnected = false;
      Serial.println("[WS] Déconnecté");
      break;

    case WStype_TEXT:
      Serial.printf("[WS] Message reçu: %s\n", payload);
      // Traite ici les commandes envoyées par le serveur
      break;

    case WStype_ERROR:
      Serial.println("[WS] Erreur WebSocket");
      break;
  }
}

// -------------------------------------------------------
// CONNEXION WIFI
// -------------------------------------------------------
void connectWiFi() {
  Serial.printf("Connexion à %s", SSID);
  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.printf("\n[WiFi] Connecté! IP: %s\n", WiFi.localIP().toString().c_str());
}

// -------------------------------------------------------
// ENVOI D'UN EVENT AU SERVEUR
// -------------------------------------------------------
void sendFingerprintEvent(const char* event, int fingerId, int confidence) {
  StaticJsonDocument<128> doc;
  doc["event"]      = event;
  doc["fingerId"]   = fingerId;
  doc["confidence"] = confidence;

  char buffer[128];
  serializeJson(doc, buffer);
  webSocket.sendTXT(buffer);
  Serial.printf("[WS] Envoyé: %s\n", buffer);
}

// -------------------------------------------------------
// LECTURE EMPREINTE AS608
// -------------------------------------------------------
int readFingerprint() {
  int p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;           // Pas de doigt

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;           // Image invalide

  p = finger.fingerSearch();
  if (p == FINGERPRINT_OK) {
    Serial.printf("[FP] Match! ID: %d, Score: %d\n",
                  finger.fingerID, finger.confidence);
    return finger.fingerID;
  }

  Serial.println("[FP] Pas de correspondance");
  return 0;  // 0 = inconnu
}

// -------------------------------------------------------
// SETUP
// -------------------------------------------------------
void setup() {
  Serial.begin(115200);

  // Init AS608
  mySerial.begin(57600, SERIAL_8N1, 16, 17); // RX=16, TX=17
  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println("[FP] Capteur AS608 détecté");
  } else {
    Serial.println("[FP] ERREUR: Capteur AS608 non trouvé!");
    while (1) delay(1000);
  }

  // Connexion WiFi
  connectWiFi();

  // Init WebSocket
  webSocket.begin(WS_HOST, WS_PORT, WS_PATH);
  webSocket.onEvent(onWebSocketEvent);
  webSocket.setReconnectInterval(5000); // Reconnexion auto toutes les 5s
}

// -------------------------------------------------------
// LOOP
// -------------------------------------------------------
void loop() {
  webSocket.loop(); // Maintient la connexion WS

  // Vérifie le WiFi
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[WiFi] Reconnexion...");
    connectWiFi();
  }

  // Lecture empreinte
  int fingerId = readFingerprint();

  if (fingerId > 0 && wsConnected) {
    // Empreinte reconnue
    sendFingerprintEvent("fingerprint_match", fingerId, finger.confidence);

  } else if (fingerId == 0 && wsConnected) {
    // Doigt posé mais non reconnu
    sendFingerprintEvent("fingerprint_unknown", 0, 0);
  }

  delay(100);
}
