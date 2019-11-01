const levenshtein = require('js-levenshtein');

const peq = new Uint32Array(2 ** 16);
const myers = module.exports = (a, b) => {
  const n = a.length;
  const m = b.length;
  const lst = 1 << (n - 1);

  let pv = -1;
  let mv = 0;
  let sc = 0;

  let i = m;
  while (i--) peq[b.charCodeAt(i)] = 0;
  i = n;
  while (i--) peq[a.charCodeAt(i)] |= (1 << i);

  for (i = 0; i < m; i++) {
    let eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;
    eq |= (eq & pv) + pv ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;
    if (mv & lst) sc++;
    else if (pv & lst) sc--;
    mv = (mv << 1) | 1;
    pv = (pv << 1) | ~(xv | mv);
    mv &= xv;
  }
  return sc + n;
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
    console.log(`${arr[i]} ${arr[i + 1]}`);
  }
  i += 2;
}
// console.log(arr);
