import { K } from "./keys.mjs";
const buffPull = [
  ["Q", 0],
  ["W", 0],
  ["E", 0],
  ["r", 0],
  ["T", 0],
  ["7", 0],
  ["8", 0],
  ["4", 0],
];
const songPull = [
  ["6", 0],
  ["Y", 0],
  ["U", 0],
  ["I", 0],
  ["O", 0],
  ["P", 0],
  ["A", 0],
  ["S", 0],
];
const cow = [["5", 0]];

export const castBuff = (sendCommand) => {
  for (let index = 0; index < buffPull.length; index++) {
    const [keyBuff, lastCastTimestamp] = buffPull[index];
    const currTimestamp = Date.now();
    if (currTimestamp - lastCastTimestamp > 35 * 1000 * 60) {
      buffPull[index][1] = currTimestamp;
      console.log("castBuff:" + keyBuff);
      return sendCommand(keyBuff, 1000);
    }
  }
  for (let index = 0; index < songPull.length; index++) {
    const [keyBuff, lastCastTimestamp] = songPull[index];
    const currTimestamp = Date.now();
    if (currTimestamp - lastCastTimestamp > 4 * 1000 * 60) {
      songPull[index][1] = currTimestamp;
      console.log("castBuff:" + keyBuff);
      return sendCommand(keyBuff, 500);
    }
  }
  for (let index = 0; index < cow.length; index++) {
    const [keyBuff, lastCastTimestamp] = cow[index];
    const currTimestamp = Date.now();
    if (currTimestamp - lastCastTimestamp > 5.5 * 1000 * 60) {
      cow[index][1] = currTimestamp;
      console.log("castBuff:" + keyBuff);
      return sendCommand(keyBuff, 500);
    }
  }
  return Promise.resolve();
};
