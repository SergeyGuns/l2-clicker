#include "Keyboard.h"

void setup() {
  Serial.begin(9600); // Открываем порт для связи. Проверьте настройки для вашего Arduino
  Keyboard.begin();
}

void loop() {
  char command; // переменная для хранения команды

  if (Serial.available()) { // Проверяем, доступны ли данные на серийном порте
    command = Serial.read(); // Читаем команду

    Keyboard.press(command);
    delay(100);
    Keyboard.release(command);
  }
}

