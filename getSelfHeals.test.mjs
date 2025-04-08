import fs from "fs/promises";
import getSelfHeals from "./getSelfHeals.mjs";

const cases = [
  ["./screen-example/self 0.png", 0],
  ["./screen-example/self 15.png", 15],
  ["./screen-example/self 55 target 0.png", 55],
  ["./screen-example/self 100 target 100.png", 100],
];

// Promise-based code

// fs.readdir("./screen-example").then((v) => console.log(v));

Promise.all(
  cases.map(([path, heals]) => {
    return fs.readFile(path).then(async (fileBuffer) => {
      const result = await getSelfHeals(fileBuffer);
      console.log('target', heals, path, result);
    });
  })
).then();
