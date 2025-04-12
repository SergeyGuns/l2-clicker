#include "Keyboard.h"
const unsigned long releaseTimeout = 5000; // 5 секунд
unsigned long lastPressTime = 0;
bool keysPressed[256] = {false}; // Массив для отслеживания нажатых клавиш

void setup() {
  Serial.begin(9600); // Открываем порт для связи. Проверьте настройки для вашего Arduino
  Keyboard.begin();
}

void loop() {
  String command; // переменная для хранения команды

  if (Serial.available()) { // Проверяем, доступны ли данные на серийном порте
    command = Serial.readStringUntil('\n'); // Читаем команду до символа новой строки

    if (command.startsWith("P_")) { // Если команда начинается с "P_"
      char key = command.charAt(2); // Извлекаем символ кнопки
      Keyboard.press(key); // Нажимаем кнопку
      keysPressed[key] = true; // Отмечаем клавишу как нажатую
      lastPressTime = millis(); // Обновляем время последнего нажатия
    } else if (command.startsWith("R_")) { // Если команда начинается с "R_"
      char key = command.charAt(2); // Извлекаем символ кнопки
      Keyboard.release(key); // Отпускаем кнопку
      keysPressed[key] = false; // Отмечаем клавишу как отпущенную
      
    } else {
      char key = command.charAt(0);
      Keyboard.press(key);
      delay(100);
      Keyboard.release(key);
    }
  }

  // Проверяем, истекло ли время ожидания
  if (millis() - lastPressTime > releaseTimeout) {
    for (int i = 0; i < 256; i++) {
      if (keysPressed[i]) {
        Keyboard.release(i); // Отпускаем все нажатые клавиши
        keysPressed[i] = false; // Отмечаем клавиши как отпущенные
      }
    }
  }
}