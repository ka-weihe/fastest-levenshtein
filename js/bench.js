const fs = require('fs');
const leven = require('leven');
const Benchmark = require('benchmark');
const fastLevenshtein = require('fast-levenshtein').get;
const jslevenshtein = require('js-levenshtein');
const talisman = require('talisman/metrics/distance/levenshtein');
const levenshteinEditDistance = require('levenshtein-edit-distance');
const nodeLevenshtein = require('./node-levenshtein');

const suite = new Benchmark.Suite();

function randomstring(n) {
  let i = 0;
  const arr = [];
  for (i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 65536));
  }
  return String.fromCharCode(...arr);
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
if (!fs.existsSync('data.json')) {
  const data = [
    randomstringArr(4, arrSize),
    randomstringArr(8, arrSize),
    randomstringArr(16, arrSize),
    randomstringArr(32, arrSize),
    randomstringArr(64, arrSize),
    randomstringArr(128, arrSize),
    randomstringArr(256, arrSize),
    randomstringArr(512, arrSize),
    randomstringArr(1024, arrSize)];

    fs.writeFileSync('data.json', JSON.stringify(data));
}

const data = JSON.parse(fs.readFileSync('data.json'));

// BENCHMARKS
for (let i = 0; i < 9; i++) {
  const datapick = data[i];

  if (process.argv[2] != 'no') {
    suite.add(`${i} - js-levenshtein`, () => {
      let j = 0;
      while (j < arrSize) {
        jslevenshtein(datapick[j], datapick[j + 1]);
        j += 2;
      }
    })
    .add(`${i} - leven`, () => {
      let j = 0;
      while (j < arrSize) {
        leven(datapick[j], datapick[j + 1]);
        j += 2;
      }
    })
    .add(`${i} - fast-levenshtein`, () => {
      let j = 0;
      while (j < arrSize) {
        fastLevenshtein(datapick[j], datapick[j + 1]);
        j += 2;
      }
    })
    .add(`${i} - talisman`, () => {
      let j = 0;
      while (j < arrSize) {
        talisman(datapick[j], datapick[j + 1]);
        j += 2;
      }
    })
    .add(`${i} - levenshteinEditDistance`, () => {
      let j = 0;
      while (j < arrSize) {
        levenshteinEditDistance(datapick[j], datapick[j + 1]);
        j += 2;
      }
    })
  }
  suite.add(`${i} - node-levenshtein`, () => {
    let j = 0;
    while (j < arrSize) {
      nodeLevenshtein(datapick[j], datapick[j + 1]);
      j += 2;
    }
  });  
}

const results = new Map();
suite.on('cycle', (event) => {
  console.log(String(event.target));
  if (results.has(event.target.name[0])) {
    results.get(event.target.name[0]).push(event.target.hz);
  } else {
    results.set(event.target.name[0], [event.target.hz]);
  }
})
  .on('complete', () => {
    console.log(results);
  })
// run async
  .run({ async: true });
