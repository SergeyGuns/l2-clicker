import { SerialPort } from "serialport";
import getTargetHeals from "./getTargetHeals.mjs";
import getSelfHeals from "./getSelfHeals.mjs";
// SerialPort.list().then((r) => console.log(r));
import screenshot from "screenshot-desktop";
import { castBuff } from "./castBuff.mjs";

const heal = () =>
  screenshot()
    .then((imgBuffer) => {
      return Promise.all([getTargetHeals(imgBuffer), getSelfHeals(imgBuffer)]);
    })
    .catch((err) => {
      console.error(err);
    });

const port = new SerialPort({ path: "COM7", baudRate: 9600 });

const FLAGS = {
  DELAY: "DELAY",
  PAUSE: "PAUSE",
};

const macros = [
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "1",
  "2",
  "3",
  "0",
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
    if (targetHeals < 1) {
      await sendCommand("0");
      await sendCommand("9");
      await delay(Math.random() * 100 + 500);
      await castBuff(sendCommand);
    }
    if (selfHeals < 10) {
      await sendCommand("F");
    }
    if (item === FLAGS.DELAY) {
      await delay();
    } else {
      await sendCommand(item);
    }
  }
  console.log("All items have been processed");
  await processArray(array);
}

processArray(macros);
