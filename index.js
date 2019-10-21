const addon = require('node-gyp-build')(__dirname);
const NAPI_MINIMUM_SIZE = 34;
const row = new Uint8Array(NAPI_MINIMUM_SIZE);
const cache = new Uint16Array(NAPI_MINIMUM_SIZE);

module.exports = (a, b) => {
  if (a.length + b.length < NAPI_MINIMUM_SIZE) {
    if (a === b) return 0;

    if (a.length > b.length) {
      const tmp = b;
      b = a;
      a = tmp;
    }

    const al = a.length;
    if (!al) return b.length;

    let j = al;
    while (j--) {
      row[j] = j + 1;
      cache[j] = a.charCodeAt(j);
    }

    let d;
    let i = 0;
    const bl = b.length;
    while (i < bl - 3) {
      let d0; let d1; let d2; let d3;
      const b0 = b.charCodeAt(d0 = i);
      const b1 = b.charCodeAt(d1 = i + 1);
      const b2 = b.charCodeAt(d2 = i + 2);
      const b3 = b.charCodeAt(d3 = i + 3);
      d = (i += 4);
      for (j = 0; j < al; j++) {
        const ac = cache[j];
        row[j] = d = Math.min(d3 - (ac === b3), d,
          d3 = Math.min(d2 - (ac === b2), d3,
            d2 = Math.min(d1 - (ac === b1), d2,
              d1 = Math.min(d0 - (ac === b0), d1,
                d0 = row[j]) + 1) + 1) + 1) + 1;
      }
    }
    while (i < bl) {
      let d0;
      const b0 = b.charCodeAt(d0 = i++);
      d = i;
      for (j = 0; j < al; j++) {
        row[j] = d = Math.min(d0 - (cache[j] === b0), (d0 = row[j]), d) + 1;
      }
    }
    return d;
  }
  return addon.levenshtein(a, b);
};
