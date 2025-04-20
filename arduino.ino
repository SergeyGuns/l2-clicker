#include "Keyboard.h"
#include "Mouse.h"

const unsigned long releaseTimeout = 5000; // 5 seconds
unsigned long lastPressTime = 0;
bool keysPressed[256] = {false}; // Array to track pressed keys

void setup() {
  Serial.begin(9600); // Open the serial port for communication. Check settings for your Arduino
  Keyboard.begin();
  Mouse.begin();
}

void loop() {
  String command; // Variable to store the command

  if (Serial.available()) { // Check if data is available on the serial port
    command = Serial.readStringUntil('\n'); // Read the command until the newline character

    if (command.startsWith("P_")) { // If the command starts with "P_"
      char key = command.charAt(2); // Extract the key character
      Keyboard.press(key); // Press the key
      keysPressed[key] = true; // Mark the key as pressed
      lastPressTime = millis(); // Update the last press time
    } else if (command.startsWith("R_")) { // If the command starts with "R_"
      char key = command.charAt(2); // Extract the key character
      Keyboard.release(key); // Release the key
      keysPressed[key] = false; // Mark the key as released
    } else if (command.startsWith("C_")) { // If the command starts with "C_"
      int separatorIndex = command.indexOf("::");
      if (separatorIndex != -1) {
        String xStr = command.substring(2, separatorIndex);
        String yStr = command.substring(separatorIndex + 2);
        int x = xStr.toInt();
        int y = yStr.toInt();
        Mouse.setCursor(x, y); // Move the mouse to (x, y)
        Mouse.click(MOUSE_LEFT); // Perform a left click
      }
    } else {
      char key = command.charAt(0);
      Keyboard.press(key);
      delay(100);
      Keyboard.release(key);
    }
  }

  // Check if the timeout has expired
  if (millis() - lastPressTime > releaseTimeout) {
    for (int i = 0; i < 256; i++) {
      if (keysPressed[i]) {
        Keyboard.release(i); // Release all pressed keys
        keysPressed[i] = false; // Mark the keys as released
      }
    }
  }
}
