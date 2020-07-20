const nodeLevenshtein = require('./index.js');
const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  if (a.length > b.length) {
    const tmp = a;
    a = b;
    b = tmp;
  }

  const row = [];
  for (let i = 0; i <= a.length; i++) {
    row[i] = i;
  }

  for (let i = 1; i <= b.length; i++) {
    let prev = i;
    for (let j = 1; j <= a.length; j++) {
      let val;
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        val = row[j - 1];
      } else {
        val = Math.min(row[j - 1] + 1,
          prev + 1,
          row[j] + 1);
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }

  return row[a.length];
};

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

test('test compare', () => {
  let errors = 0
  for (var i = 0; i < 1000; i++) {
    const rnd_num1 = Math.random() * 1000 | 0
    const rnd_num2 = Math.random() * 1000 | 0
    const rnd_string1 = makeid(rnd_num1);
    const rnd_string2 = makeid(rnd_num2);
    const actual = nodeLevenshtein.compare(rnd_string1, rnd_string2)
    const expected = levenshtein(rnd_string1, rnd_string2)
    expect(actual).toBe(expected);
  }
});

test('test find', () => {
  const actual = nodeLevenshtein.find('fast', ['slow', 'faster', 'fastest'])
  const expected = 'faster'
  expect(actual).toBe(expected);
});
