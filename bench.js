/* eslint-disable no-console */
/* eslint-disable no-loop-func */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable node/no-unpublished-require */
const fs = require("fs");
const leven = require("leven");
const Benchmark = require("benchmark");
const fastLevenshtein = require("fast-levenshtein").get;
const jslevenshtein = require("js-levenshtein");
const levenshteinEditDistance = require("levenshtein-edit-distance");
const { distance } = require("./dist");

const suite = new Benchmark.Suite();

function randomstring(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function randomstringArr(stringSize, arraySize) {
  let i = 0;
  const arr = [];
  for (i = 0; i < arraySize; i++) {
    arr.push(randomstring(stringSize));
  }
  return arr;
}

const arrSize = 1000;
if (!fs.existsSync("data.json")) {
  const data = [
    randomstringArr(4, arrSize),
    randomstringArr(8, arrSize),
    randomstringArr(16, arrSize),
    randomstringArr(32, arrSize),
    randomstringArr(64, arrSize),
    randomstringArr(128, arrSize),
    randomstringArr(256, arrSize),
    randomstringArr(512, arrSize),
    randomstringArr(1024, arrSize),
  ];

  fs.writeFileSync("data.json", JSON.stringify(data));
}

const data = JSON.parse(fs.readFileSync("data.json"));

// BENCHMARKS
let b = 0;
for (let i = 0; i < 9; i++) {
  const datapick = data[i];

  if (process.argv[2] !== "no") {
    suite
      .add(`${i} - js-levenshtein`, () => {
        for (let j = 0; j < arrSize - 1; j += 2) {
          b += jslevenshtein(datapick[j], datapick[j + 1]);
        }
      })
      .add(`${i} - leven`, () => {
        for (let j = 0; j < arrSize - 1; j += 2) {
          b += leven(datapick[j], datapick[j + 1]);
        }
      })
      .add(`${i} - fast-levenshtein`, () => {
        for (let j = 0; j < arrSize - 1; j += 2) {
          b += fastLevenshtein(datapick[j], datapick[j + 1]);
        }
      })
      .add(`${i} - levenshtein-edit-distance`, () => {
        for (let j = 0; j < arrSize - 1; j += 2) {
          b += levenshteinEditDistance(datapick[j], datapick[j + 1]);
        }
      });
  }
  suite.add(`${i} - fastest-levenshtein`, () => {
    for (let j = 0; j < arrSize - 1; j += 2) {
      b += distance(datapick[j], datapick[j + 1]);
    }
  });
}

const results = new Map();
suite
  .on("cycle", (event) => {
    console.log(String(event.target));
    if (results.has(event.target.name[0])) {
      results.get(event.target.name[0]).push(event.target.hz);
    } else {
      results.set(event.target.name[0], [event.target.hz]);
    }
  })
  .on("complete", () => {
    console.log(results);
    console.log(b);
  })
  // run async
  .run({ async: true });
