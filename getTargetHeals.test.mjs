import getTargetHeals from "./getTargetHeals.mjs";
import fs from "fs/promises";

const cases = [
  ["./screen-example/100.jpg", 100],
  ["./screen-example/0.jpg", 0],
];

// Promise-based code

// fs.readdir("./screen-example").then((v) => console.log(v));

Promise.all(
  cases.map(([path, heals]) => {
    return fs.readFile(path).then((fileBuffer) => {
      getTargetHeals(fileBuffer);
      console.log(heals);
    });
  })
).then();
