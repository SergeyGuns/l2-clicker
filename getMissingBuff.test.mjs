import { findMissengBuff, buffs } from "./getMissingBuff.mjs";
import fs from "fs/promises";
// import screenshot from "screenshot-desktop";
const screenImage = "./screen-example/warc-halfbaff.jpg";
const getMissingBuff = async () =>
  fs
    .readFile(screenImage)
    .then((img) => {
      return findMissengBuff(img, buffs, {
        x: 195,
        y: 0,
        width: 454 - 195,
        height: 50,
      });
    })
    .catch((err) => {
      console.error(err);
    });

const runTest = async () => {
  try {
    const missingBuffs = await getMissingBuff();
    console.log(missingBuffs);
  } catch (e) {
    console.log(e);
  }
};

runTest();
