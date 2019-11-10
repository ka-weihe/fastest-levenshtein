const levenshtein = require('js-levenshtein');

const peq = new Uint32Array(16 * 256);
const Phc = new Uint32Array(16);
const Mhc = new Uint32Array(16);
const myers1999 = (p1, p2) => {
  const len1 = p1.length;
  const len2 = p2.length;
  let Eq; let Xv; let Xh; let Ph; let Mh; let Pv;
  let Mv; let i; let b;
  let Score = len2;
  let Pb; let Mb;

  const hsize = Math.ceil(len1 / 32);
  const vsize = Math.ceil(len2 / 32);

  for (i = 0; i < hsize; i++) {
    Phc[i] = -1;
    Mhc[i] = 0;
  }

  let k;
  for (b = 0; b < vsize; b++) {
    k = len1;
    while (k--) peq[b * 256 + p1.charCodeAt(k)] = 0;
  }

  k = len2;
  while (k--) peq[Math.floor((k / 32)) * 256 + p2.charCodeAt(k)] |= (1 << k);

  for (b = 0; b < vsize; b++) {
    Mv = 0;
    Pv = -1;
    Score = len2;

    for (i = 0; i < len1; i++) {
      Eq = peq[b * 256 + p1.charCodeAt(i)];

      Pb = (((Phc[Math.floor(i / 32)]) >>> (i % 32)) & 1);
      Mb = (((Mhc[Math.floor(i / 32)]) >>> (i % 32)) & 1);

      Xv = Eq | Mv;
      Xh = ((((Eq | Mb) & Pv) + Pv) ^ Pv) | Eq | Mb;

      Ph = Mv | ~(Xh | Pv);
      Mh = Pv & Xh;

      if (b === (vsize - 1)) {
        Score += (((Ph) >>> ((len2 % 32) - 1)) & 1);
        Score -= (((Mh) >>> ((len2 % 32) - 1)) & 1);
      }

      if ((Ph >>> 31) ^ Pb) {Phc[Math.floor(i / 32)] = ((Phc[Math.floor(i / 32)]) ^ (1 << (i % 32)));}

      if ((Mh >>> 31) ^ Mb) {Mhc[Math.floor(i / 32)] = ((Mhc[Math.floor(i / 32)]) ^ (1 << (i % 32)));}

      Ph = (Ph << 1) | Pb;
      Mh = (Mh << 1) | Mb;

      Pv = Mh | ~(Xv | Ph);
      Mv = Ph & Xv;
    }
  }
  return Score;
};


// const p = 'znM2D006cZViZuQUr0HNLQLqo7hbpkIMp';
// const q = 'WqTnFOSanG52EvgRl2KM6ZZXU5nexknbK';

// console.log(myers1999(q, p));

function randomstring(n) {
  let i = 0;
  const arr = [];
  for (i = 0; i < n; i++) {
    arr.push(Math.floor(Math.random() * 255));
  }
  return String.fromCharCode(...arr);
}

// function randomstring(length) {
//   let text = '';
//   const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   for (let i = 0; i < length; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }

//   return text;
// }

let i = 0;
const arr = [];
while (i < 10000) {
  arr.push(randomstring(100));
  i++;
}

i = 0;
while (i < 10000 - 1) {
  if (myers1999(arr[i], arr[i + 1]) !== levenshtein(arr[i], arr[i + 1])) {
    console.log(`${arr[i]} ${arr[i + 1]}`);
  }
  i += 2;
}
// console.log(arr);
