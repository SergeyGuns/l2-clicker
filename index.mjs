import { SerialPort } from "serialport";
import getTargetHeals from "./getTargetHeals.mjs";
import getSelfHeals from "./getSelfHeals.mjs";
import { hasStack } from "./hasStack.mjs";
// SerialPort.list().then((r) => console.log(r));
import screenshot from "screenshot-desktop";
import { castBuff } from "./castBuff.mjs";

const heal = () =>
  screenshot({ x: 0, y: 0, width: 800, height: 600 })
    .then((imgBuffer) => {
      return Promise.all([getTargetHeals(imgBuffer), getSelfHeals(imgBuffer)]);
    })
    .catch((err) => {
      console.error(err);
    });

const port = new SerialPort({ path: "COM4", baudRate: 9600 });

const ATTACK = "1";
const HEAL_ATTACK = "2";
const NEXT_TARGET = "4";
const FLAGS = {
  DELAY: "DELAY",
  PAUSE: "PAUSE",
};

const macros = ["1"];

function delay(timeLong = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeLong);
  });
}

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

let lastPressKey = null;
const pressKey = sendKey("P_");
const releaseKey = sendKey("R_");
const sendCommand = sendKey();
async function processArray(array) {
  for (const item of array) {
    const [targetHeals, selfHeals] = await heal();
    console.log({ targetHeals, selfHeals });
    if (lastPressKey) {
      await releaseKey(lastPressKey);
      lastPressKey = null;
    }

    await hasStack(targetHeals, () => sendCommand(NEXT_TARGET));
    await castBuff(sendCommand);

    // combat logic
    if (targetHeals < 0.3) {
      // send next target command
      await sendCommand(NEXT_TARGET, 0);
    }
    if (selfHeals < 35) {
      // heal attack command
      await pressKey(HEAL_ATTACK);
      lastPressKey = HEAL_ATTACK;
    } else {
      // typical attack command
      await pressKey(ATTACK);
      lastPressKey = ATTACK;
    }
  }
  await processArray(array);
}

processArray(macros);
