const levenshtein = require('js-levenshtein');
let peq = new Uint32Array(2 ** 16);
let myers;
module.exports = myers = (a, b) => {
  const n = a.length;
  const m = b.length;
  let mv = 0;
  let pv = 2 ** 32 - 1;
  let sc = n;
  const lst = 1 << (n - 1);

  let i = m;
  while (i--) peq[b.charCodeAt(i)] = 0;
  i = n;
  while (i--) peq[a.charCodeAt(i)] |= (1 << i);

  for (i = 0; i < m; i++) {
    const eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;
    const xh = (eq & pv) + pv ^ pv | eq;
    let ph = mv | ~(xh | pv);
    const mh = pv & xh;
    if (ph & lst) sc += 1;
    else if (mh & lst) sc -= 1;
    ph = (ph << 1) | 1;
    pv = (mh << 1) | ~(xv | ph);
    mv = ph & xv;
  }
  return sc;
};

function randomstring(n) {
  let i = 0;
  const arr = [];
  for (i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 65536));
  }
  return String.fromCharCode(...arr);
}

let i = 0;
const arr = [];
while (i < 1000000) {
  arr.push(randomstring(32));
  i++;
}

i = 0;
while (i < 1000000 - 1) {
  if (myers(arr[i], arr[i + 1]) !== levenshtein(arr[i], arr[i + 1])) {
    console.log(arr[i] + ' ' + arr[i + 1]);  }
  i += 2;
}
// console.log(arr);
