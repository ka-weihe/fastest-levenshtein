# node-levenshtein :rocket: 
Fastest JavaScript implementation of the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) algorithm - (up to 10x+ faster than closest competitor). This algorithm can be used to measure the similarity of two strings. The performance has been achieved by using Myers' bit-parallel algorithm. This package is 849 bytes of pure JavaScript and no dependencies.

Note: if you need to take the edit distance of one string against many strings (maybe billions), I have created a GPU-implementation that will be atleast 1000x faster than this. Contact me, if you're interested.

[![Build Status](https://travis-ci.org/ka-weihe/node-levenshtein.svg?branch=master)](https://travis-ci.org/ka-weihe/node-levenshtein)
## Installation
```
$ npm install node-levenshtein --save
```

## Usage

```javascript
const levenshtein = require('node-levenshtein')

console.log(levenshtein('lorem', 'ipsum'))
//=> 4

```

## Benchmark
I generated 500 pairs of strings with length N. I measured the ops/sec each library achieves to process all the given pairs. Higher is better. node-levenshtein is a lot faster in all cases. 

| Test Target               | N=4   | N=8   | N=16 | N=32 | N=64 | N=128 | N=256 | N=512 | N=1024 |
|---------------------------|-------|-------|------|------|------|-------|-------|-------|--------|
| node-levenshtein          | 42423 | 17237 | 5577 | 3428 | 2013 | 596.1 | 182.6 | 49.88 | 12.99  |
| js-levenshtein            | 24012 | 12684 | 4100 | 1311 | 371  | 97.25 | 25.40 | 6.404 | 1.632  |
| leven                     | 30291 | 11002 | 3378 | 907  | 227  | 59.94 | 15.59 | 3.958 | 0.998  |
| talisman                  | 29859 | 9782  | 3319 | 926  | 234  | 63.76 | 16.12 | 3.989 | 0.986  |
| fast-levenshtein          | 23517 | 7686  | 2291 | 576  | 154  | 40.13 | 10.16 | 2.558 | 0.643  |
| levenshtein-edit-distance | 31423 | 10783 | 3209 | 851  | 214  | 56.13 | 14.24 | 3.694 | 0.931  |

### Relative Performance
This image shows the relative performance between node-levenshtein and js-levenshtein (the 2nd fastest). As you can see, node-levenshtein is a lot faster for small strings, but especially for long strings (8x faster when N = 1024).

![Benchmark](/images/relaperf.png)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
