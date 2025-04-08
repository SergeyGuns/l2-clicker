import { SerialPort } from "serialport";
import getTargetHeals from "./getTargetHeals.mjs";
import getSelfHeals from "./getSelfHeals.mjs";
import { hasStack } from "./hasStack.mjs";
// SerialPort.list().then((r) => console.log(r));
import screenshot from "screenshot-desktop";
import { castBuff } from "./castBuff.mjs";

const heal = () =>
  screenshot({x: 0, y: 0, width: 800, height: 600})
    .then((imgBuffer) => {
      return Promise.all([getTargetHeals(imgBuffer), getSelfHeals(imgBuffer)]);
    })
    .catch((err) => {
      console.error(err);
    });

const port = new SerialPort({ path: "COM4", baudRate: 9600 });

const FLAGS = {
  DELAY: "DELAY",
  PAUSE: "PAUSE",
};

const macros = [
  "1",
];

function delay(timeLong = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeLong);
  });
}

function sendCommand(command, delay = 0) {
  return new Promise((resolve) => {
    port.write(command, function (err) {
      if (err) {
        return console.log("Ошибка отправки данных: ", err.message);
      }
      setTimeout(() => resolve(), delay);
      console.log("Данные успешно отправлены: " + command);
    });
  });
}

async function processArray(array) {
  for (const item of array) {
    const [targetHeals, selfHeals] = await heal();
    console.log({ targetHeals, selfHeals });
    console.log(targetHeals, typeof targetHeals);
    hasStack(targetHeals, () => sendCommand("4"))
    if (targetHeals < 0.3) {
      await sendCommand("4", 0);
2      // await delay(Math.random() * 100 + 300);42
      await castBuff(sendCommand);
    }
    if (selfHeals < 25) {
      await sendCommand("2", Math.random() * 100 + 200);
    }
    if (item === FLAGS.DELAY) {
      await delay(Math.random() * 100 + 300)
    } else {
      // await sendCommand("0", 0);
      await sendCommand(item, Math.random() * 100 + 200);
      
    }
  }
  console.log("All items have been processed");
  await processArray(array);
}

processArray(macros);
