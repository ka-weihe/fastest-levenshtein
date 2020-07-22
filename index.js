const peq = new Uint32Array(0x10000);
const myers_32 = (a, b) => {
  const n = a.length;
  const m = b.length;
  const lst = 1 << (n - 1);
  let pv = -1;
  let mv = 0;
  let sc = n;
  let i = m;
  while (i--) peq[b.charCodeAt(i)] = 0;
  i = n;
  while (i--) peq[a.charCodeAt(i)] |= 1 << i;
  for (i = 0; i < m; i++) {
    let eq = peq[b.charCodeAt(i)];
    const xv = eq | mv;
    eq |= ((eq & pv) + pv) ^ pv;
    mv |= ~(eq | pv);
    pv &= eq;
    if (mv & lst) sc++;
    if (pv & lst) sc--;
    mv = (mv << 1) | 1;
    pv = (pv << 1) | ~(xv | mv);
    mv &= xv;
  }
  return sc;
};

const myers_x = (b, a) => {
  const n = a.length;
  const m = b.length;
  const mhc = [];
  const phc = [];
  const hsize = Math.ceil(n / 32);
  const vsize = Math.ceil(m / 32);
  let score = m;
  for (let i = 0; i < hsize; i++) {
    phc[i] = -1;
    mhc[i] = 0;
  }
  let j = 0;
  for (; j < vsize - 1; j++) {
    let mv = 0;
    let pv = -1;
    const start = j * 32;
    const vlen = Math.min(32, m - start);
    let k = n;
    while (k--) peq[a.charCodeAt(k)] = 0;
    for (k = start; k < start + vlen; k++) {
      peq[b.charCodeAt(k)] |= 1 << k;
    }
    score = m;
    for (let i = 0; i < n; i++) {
      const eq = peq[a.charCodeAt(i)];
      const pb = (phc[(i / 32) | 0] >>> i % 32) & 1;
      const mb = (mhc[(i / 32) | 0] >>> i % 32) & 1;
      const xv = eq | mv;
      const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
      let ph = mv | ~(xh | pv);
      let mh = pv & xh;
      if ((ph >>> 31) ^ pb) phc[(i / 32) | 0] ^= 1 << i % 32;
      if ((mh >>> 31) ^ mb) mhc[(i / 32) | 0] ^= 1 << i % 32;
      ph = (ph << 1) | pb;
      mh = (mh << 1) | mb;
      pv = mh | ~(xv | ph);
      mv = ph & xv;
    }
  }
  let mv = 0;
  let pv = -1;
  const start = j * 32;
  const vlen = Math.min(32, m - start);
  let k = n;
  while (k--) peq[a.charCodeAt(k)] = 0;
  for (k = start; k < start + vlen; k++) {
    peq[b.charCodeAt(k)] |= 1 << k;
  }
  score = m;
  for (let i = 0; i < n; i++) {
    const eq = peq[a.charCodeAt(i)];
    const pb = (phc[(i / 32) | 0] >>> i % 32) & 1;
    const mb = (mhc[(i / 32) | 0] >>> i % 32) & 1;
    const xv = eq | mv;
    const xh = ((((eq | mb) & pv) + pv) ^ pv) | eq | mb;
    let ph = mv | ~(xh | pv);
    let mh = pv & xh;
    score += (ph >>> ((m % 32) - 1)) & 1;
    score -= (mh >>> ((m % 32) - 1)) & 1;
    if ((ph >>> 31) ^ pb) phc[(i / 32) | 0] ^= 1 << i % 32;
    if ((mh >>> 31) ^ mb) mhc[(i / 32) | 0] ^= 1 << i % 32;
    ph = (ph << 1) | pb;
    mh = (mh << 1) | mb;
    pv = mh | ~(xv | ph);
    mv = ph & xv;
  }
  return score;
};

exports.distance = (a, b) => {
  if (a.length < b.length) {
    const tmp = b;
    b = a;
    a = tmp;
  }
  if (b.length === 0) return a.length;
  if (a.length <= 32) {
    return myers_32(a, b);
  }
  return myers_x(a, b);
};

exports.closest = (str, arr) => {
  let min_distance = Infinity;
  let min_index = 0;
  for (let i = 0; i < arr.length; i++) {
    const distance = this.distance(str, arr[i]);
    if (distance < min_distance) {
      min_distance = distance;
      min_index = i;
    }
  }
  return arr[min_index];
};
