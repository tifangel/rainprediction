#include "DHT.h"
#include "Adafruit_BMP085.h"
#include <WiFi.h>
#include <PubSubClient.h>

#define DHT11PIN 25
#define rainAnalog 34
#define rainDigital 35

DHT dht(DHT11PIN, DHT11);
Adafruit_BMP085 bmp;

WiFiClient espClient;
PubSubClient client(espClient);

// 1. WIFI CONFIG
const char* SSID = "";
const char* SSID_PASSWORD = ""; 

// 2. MQTT BROKER CONFIG
const char* BROKER_SERVER = "";
const int BROKER_PORT = 1883;

// 3. TOPIC
const char* topic = "rain";
//const char* TOPIC_SWITCH = "";


// MISC
long lastMsg = 0;

// PAYLOAD 
char payload[512];

void setup() {
  Serial.begin(115200);

  setupWifi();
  client.setServer(BROKER_SERVER, BROKER_PORT);
  client.setCallback(mqttCallback);
  
  dht.begin();
  bmp.begin();
  if (!bmp.begin()) { 
    Serial.println("Could not find a valid BMP180 sensor, check wiring!"); 
    //while (1) {} 
  }
  pinMode(rainDigital,INPUT);
  pinMode(rainAnalog, INPUT);
}

void setupWifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println("Hello");

  WiFi.begin(SSID, SSID_PASSWORD);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void mqttCallback(char* topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageTemp;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageTemp += (char)message[i];
  }
  Serial.println(messageTemp);
  /*
  if (String(topic) == TOPIC_SWITCH) {
    Serial.print("Changing output to ");
    if(messageTemp == "{\"payload\":{\"message\":\"on\"}}"){
      Serial.println("on");
      ledState = HIGH;
    }
    else if(messageTemp == "{\"payload\":{\"message\":\"off\"}}"){
      Serial.println("off");
      ledState = LOW;
    }
  }*/
}

void reconnect() {
  while (!client.connected()) {
    if (client.connect("esp32client")) {
      Serial.println("connected");
      // Subscribe
//      client.subscribe(TOPIC_SWITCH);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  long now = millis();
  if (now - lastMsg > 5000) {
    lastMsg = now;

    int rainAnalogVal = analogRead(rainAnalog);
    int rainDigitalVal = digitalRead(rainDigital);
    float humi = dht.readHumidity();
    float temp = dht.readTemperature();
    float pres = bmp.readPressure();
    //float pres = 22;
    
    Serial.print("Temperature: ");
    Serial.print(temp);
    Serial.print("ºC ");
    Serial.print("Humidity: ");
    Serial.println(humi);
  
    Serial.print(" Analog: ");
    Serial.print(rainAnalogVal);
    Serial.print(" Digital: ");
    Serial.println(rainDigitalVal);
  
    Serial.print("Pressure = ");
    Serial.print(pres);
    Serial.println(" Pa");

    sprintf(payload,"{\"humidity\":%f, \"temperature\":%f, \"pressure\":%f, \"rainAnalog\":%d, \"rainDigital\":%d}", humi, temp, pres, rainAnalogVal, rainDigitalVal);

    Serial.println(payload);
    client.publish(topic, payload);
  }
}
