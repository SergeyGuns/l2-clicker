import { SerialPort } from "serialport";

const port = new SerialPort({ path: "COM21", baudRate: 9600 });

const LEFT_CLICK = "0::0";

const sendKey = (COMMAND_PREFIX = "") =>
  function (key, delay = 0) {
    return new Promise((resolve) => {
      port.write(COMMAND_PREFIX + key + "\n", function (err) {
        if (err) {
          return console.log("Ошибка отправки данных: ", err.message);
        }
        setTimeout(() => resolve(), delay);
        console.log("Данные успешно отправлены: " + key);
      });
    });
  };

const clickLeft = sendKey("C_");
async function processArray() {
  await clickLeft(LEFT_CLICK, 3000);
  await processArray(array);
}

processArray();
