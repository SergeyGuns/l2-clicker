import getTargetHeals from "./getTargetHeals.mjs";
import fs from "fs/promises";

const cases = [
  ["./screen-example/target 0.png", 0],
  ["./screen-example/target 47.png", 0],
  ["./screen-example/target 100.png", 100],
];

// Promise-based code

// fs.readdir("./screen-example").then((v) => console.log(v));

Promise.all(
  cases.map(([path, heals]) => {
    return fs.readFile(path).then(async (fileBuffer) => {
      const result = await getTargetHeals(fileBuffer);
      console.log('target', heals, path, result);
    });
  })
).then();
