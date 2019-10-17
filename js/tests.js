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
const nodeLevenshtein = require('./node-levenshtein');

const words = ['nunc', 'leo', 'at', 'sed', 'magna', 'arcu', 'lectus', 'Nulla', 'dictumst', 'purus', 'augue', 'odio', 'Sed', 'laoreet', 'condimentum', 'eleifend', 'mattis', 'ullamcorper', 'massa', 'ultrices', 'urna', 'Proin', 'sodales', 'leo', 'massa', 'interdum', 'pulvinar', 'volutpat', 'ut', 'nulla', 'In', 'Quisque', 'accumsan', 'adipiscing', 'feugiat', 'at', 'lorem', 'eget', 'congue', 'et', 'dolor', 'amet', 'ornare', 'ullamcorper', 'ullamcorper', 'varius', 'sapien', 'Donec', 'dapibus', 'amet', 'ac', 'interdum', 'vitae', 'ullamcorper', 'sed', 'justo', 'Vestibulum', 'Mauris', 'faucibus', 'Donec', 'quis', 'eget', 'in', 'ultrices', 'Integer', 'mattis', 'quis', 'Lorem', 'tincidunt', 'lobortis', 'porta', 'Maecenas', 'sodales', 'ante', 'Aenean', 'gravida', 'tristique', 'Vivamus', 'lacus', 'Praesent', 'in', 'in', 'dignissim', 'commodo', 'ac', 'facilisis', 'eleifend', 'tortor', 'elementum', 'suscipit', 'ornare', 'placerat', 'turpis', 'nibh', 'viverra', 'ullamcorper', 'nunc', 'mollis', 'Suspendisse', 'volutpat', 'condimentum', 'scelerisque', 'ipsum', 'amet', 'hendrerit', 'posuere', 'vitae', 'dapibus', 'vestibulum', 'efficitur', 'Etiam', 'mi', 'tellus', 'nisi', 'ex', 'Maecenas', 'ultricies', 'lacus', 'Proin', 'nascetur', 'Vestibulum', 'sapien', 'magna', 'vel', 'vestibulum', 'erat', 'dolor', 'fermentum', 'leo', 'nunc', 'urna', 'nunc', 'arcu', 'id', 'massa', 'imperdiet', 'vitae', 'facilisis', 'orci', 'ut', 'massa', 'eget', 'quis', 'tincidunt', 'tortor', 'Suspendisse', 'quis', 'porta', 'Nulla', 'sit', 'interdum', 'pharetra', 'viverra', 'pretium', 'ligula', 'turpis', 'semper', 'blandit', 'nisi', 'penatibus', 'rutrum', 'lobortis', 'at', 'faucibus', 'porta', 'scelerisque', 'scelerisque', 'libero', 'turpis', 'quis', 'amet', 'mi', 'ultrices', 'vitae', 'Nam', 'egestas', 'nec', 'lacus', 'maximus', 'amet', 'at', 'diam', 'amet', 'sed', 'blandit', 'pretium', 'congue', 'Vestibulum', 'posuere', 'blandit', 'risus', 'porta', 'Morbi', 'libero', 'lectus', 'aliquam', 'ultrices', 'potenti', 'aliquet', 'nunc', 'neque', 'tincidunt', 'Integer', 'et', 'leo', 'ultrices', 'ligula', 'velit', 'efficitur', 'tristique', 'urna', 'nisi', 'metus', 'ornare', 'Fusce', 'a', 'sem', 'elit', 'sem', 'est', 'nisl', 'molestie', 'posuere', 'laoreet', 'nec', 'lacinia', 'lacus', 'sagittis', 'odio', 'Nam', 'tincidunt', 'arcu', 'ultrices', 'laoreet', 'augue', 'Maecenas', 'non', 'libero', 'Nulla', 'nisl', 'quam', 'in', 'malesuada', 'ligula', 'quam', 'aliquam', 'Praesent', 'non', 'vel', 'posuere', 'posuere', 'ridiculus', 'ante', 'Vestibulum', 'dis', 'nisl', 'feugiat', 'Vivamus', 'elementum', 'ornare', 'sagittis', 'posuere', 'porttitor', 'auctor', 'venenatis', 'mauris', 'ipsum', 'eget', 'eget', 'primis', 'sed', 'ullamcorper', 'pretium', 'cursus', 'vitae', 'non', 'lobortis', 'ipsum', 'nisi', 'malesuada', 'ut', 'urna', 'Nulla', 'Suspendisse', 'accumsan', 'est', 'velit', 'porttitor', 'quis', 'dolor', 'suscipit', 'nibh', 'vitae', 'mattis', 'magna', 'luctus', 'accumsan', 'faucibus', 'Nulla', 'Suspendisse', 'vel', 'ac', 'porta', 'non', 'dignissim', 'laoreet', 'mattis', 'placerat', 'placerat', 'Nunc', 'tincidunt', 'ultricies', 'Nam', 'et', 'Aliquam', 'gravida', 'congue', 'dui', 'semper', 'sit', 'lectus', 'ac', 'ante', 'rhoncus', 'vel', 'lobortis', 'est', 'Praesent', 'amet', 'sem', 'feugiat', 'diam', 'elementum', 'laoreet', 'sit', 'augue', 'rutrum', 'non', 'magna', 'accumsan', 'dolor', 'ligula', 'laoreet', 'lorem', 'condimentum', 'felis', 'Praesent', 'lacus', 'nisi', 'lacus', 'eu', 'eget', 'amet', 'vitae', 'vitae', 'turpis', 'varius', 'aliquam', 'amet', 'ut', 'at', 'magna', 'risus', 'ut', 'eu', 'ultricies', 'Morbi', 'amet', 'faucibus', 'mauris', 'ultricies', 'lacus', 'tincidunt', 'diam', 'ac', 'Duis', 'tempor', 'dui', 'ut', 'Maecenas', 'mi', 'nec', 'Orci', 'magnis', 'feugiat', 'auctor', 'risus', 'vitae', 'mi', 'urna', 'nunc', 'In', 'auctor', 'sodales', 'et', 'Aenean', 'vel', 'elit', 'Nam', 'vel', 'eu', 'et', 'vitae', 'euismod', 'lacus', 'Fusce', 'mattis', 'Curabitur', 'tempus', 'suscipit', 'odio', 'rutrum', 'ac', 'vitae', 'nec', 'malesuada', 'vel', 'blandit', 'ante', 'Donec', 'dapibus', 'elit', 'Morbi', 'aliquam', 'magna', 'facilisis', 'diam', 'orci', 'erat', 'tortor', 'nulla', 'tempus', 'et', 'at', 'mattis', 'sit', 'nec', 'purus', 'aliquet', 'dapibus', 'laoreet', 'Sed', 'justo', 'semper', 'ac', 'eu', 'ut', 'leo', 'et', 'sem', 'tincidunt', 'egestas', 'Nulla', 'eget', 'consectetur', 'consectetur', 'consectetur', 'massa', 'quam', 'dapibus', 'tempus', 'In', 'aliquam', 'ac', 'ac', 'aliquet', 'nec', 'gravida', 'quis', 'rutrum', 'erat', 'efficitur', 'feugiat', 'Aliquam', 'porta', 'mattis', 'odio', 'erat', 'vel', 'ut', 'In', 'Vestibulum', 'nunc', 'odio', 'sodales', 'a', 'metus', 'amet', 'at', 'tristique', 'eget', 'nec', 'convallis', 'quis', 'lacus', 'suscipit', 'velit', 'nisi', 'odio', 'odio', 'urna', 'nisl', 'eget', 'nec', 'vestibulum', 'hendrerit', 'nibh', 'erat', 'mus', 'felis', 'eu', 'fringilla', 'molestie', 'a', 'sed', 'amet', 'felis', 'amet', 'mauris', 'sit', 'justo', 'nulla', 'lorem', 'In', 'elit', 'vel', 'velit', 'diam', 'eu', 'lacinia', 'Nulla', 'in', 'massa', 'ex', 'quam', 'varius', 'et', 'adipiscing', 'Aliquam', 'non', 'rhoncus', 'porta', 'eget', 'Suspendisse', 'hendrerit', 'venenatis', 'nulla', 'cursus', 'fames', 'lorem', 'ornare', 'nulla', 'nunc', 'cursus', 'interdum', 'lacus', 'pulvinar', 'eu', 'malesuada', 'elementum', 'porttitor', 'condimentum', 'aliquet', 'Fusce', 'pulvinar', 'Sed', 'quam', 'ut', 'ornare', 'sem', 'sodales', 'tempor', 'vulputate', 'montes', 'non', 'pulvinar', 'fermentum', 'orci', 'quis', 'eget', 'at', 'enim', 'purus', 'justo', 'lorem', 'et', 'urna', 'ut', 'et', 'sit', 'vel', 'nec', 'porta', 'eu', 'ut', 'Phasellus', 'ullamcorper', 'ut', 'ut', 'auctor', 'arcu', 'Lorem', 'id', 'tempor', 'enim', 'luctus', 'Aliquam', 'volutpat', 'Donec', 'ultrices', 'sodales', 'sit', 'eget', 'Vestibulum', 'Integer', 'luctus', 'sem', 'interdum', 'quis', 'Aenean', 'turpis', 'In', 'nisl', 'lectus', 'quam', 'lobortis', 'Integer', 'massa', 'lobortis', 'tortor', 'Quisque', 'mollis', 'fringilla', 'sit', 'natoque', 'volutpat', 'eu', 'congue', 'velit', 'consectetur', 'aliquet', 'sit', 'pulvinar', 'Sed', 'ultrices', 'vulputate', 'ut', 'ornare', 'Quisque', 'Duis', 'eu', 'Nulla', 'tempus', 'elementum', 'ullamcorper', 'ultricies', 'auctor', 'cursus', 'nec', 'iaculis', 'ipsum', 'magna', 'lobortis', 'nec', 'pulvinar', 'Integer', 'volutpat', 'dictum', 'luctus', 'malesuada', 'metus', 'Duis', 'justo', 'nibh', 'metus', 'quis', 'viverra', 'Etiam', 'faucibus', 'velit', 'eu', 'augue', 'semper', 'sapien', 'ut', 'eu', 'eu', 'Nam', 'justo', 'sapien', 'Ut', 'at', 'tempus', 'mi', 'tempus', 'leo', 'Ut', 'arcu', 'a', 'consequat', 'lorem', 'mauris', 'eros', 'ligula', 'non', 'mi', 'ligula', 'odio', 'vel', 'suscipit', 'augue', 'mi', 'viverra', 'Sed', 'vitae', 'mollis', 'lacinia', 'Cras', 'consequat', 'eu', 'urna', 'nunc', 'metus', 'in', 'elit', 'ut', 'blandit', 'aliquet', 'justo', 'Donec', 'a', 'ligula', 'lorem', 'non', 'faucibus', 'finibus', 'erat', 'volutpat', 'ligula', 'leo', 'sit', 'fermentum', 'laoreet', 'in', 'faucibus', 'ante', 'luctus', 'libero', 'Mauris', 'est', 'arcu', 'maximus', 'nec', 'tincidunt', 'Donec', 'purus', 'sed', 'Etiam', 'lacinia', 'tristique', 'malesuada', 'dolor', 'hac', 'nec', 'interdum', 'nec', 'iaculis', 'pharetra', 'Vivamus', 'vel', 'id', 'vitae', 'lectus', 'viverra', 'Nam', 'mauris', 'aliquet', 'hendrerit', 'lorem', 'iaculis', 'Etiam', 'Mauris', 'est', 'Aliquam', 'Sed', 'egestas', 'metus', 'sodales', 'nisl', 'Cras', 'purus', 'nulla', 'pharetra', 'a', 'auctor', 'Etiam', 'Aenean', 'urna', 'id', 'In', 'porttitor', 'vel', 'leo', 'Nullam', 'posuere', 'in', 'sapien', 'a', 'a', 'purus', 'nulla', 'dui', 'feugiat', 'velit', 'dapibus', 'sem', 'justo', 'Fusce', 'hendrerit', 'lacus', 'non', 'eu', 'elit', 'lectus', 'commodo', 'nec', 'Mauris', 'vehicula', 'augue', 'cursus', 'ultrices', 'auctor', 'consectetur', 'eu', 'potenti', 'dictum', 'non', 'nulla', 'Vivamus', 'vulputate', 'viverra', 'malesuada', 'venenatis', 'metus', 'pharetra', 'varius', 'accumsan', 'nunc', 'posuere', 'suscipit', 'lacus', 'Nunc', 'nisi', 'feugiat', 'volutpat', 'tempor', 'metus', 'massa', 'nulla', 'elit', 'lorem', 'euismod', 'platea', 'nunc', 'pharetra', 'mauris', 'Sed', 'facilisis', 'In', 'ornare', 'iaculis', 'Suspendisse', 'et', 'est', 'maximus', 'eu', 'sed', 'Suspendisse', 'fermentum', 'id', 'pretium', 'lectus', 'et', 'nulla', 'sem', 'malesuada', 'ornare', 'habitasse', 'Duis', 'felis', 'leo', 'massa', 'eget', 'ligula', 'orci', 'Nunc', 'viverra', 'vitae', 'Donec', 'leo', 'pharetra', 'sodales', 'eu', 'dictum', 'ex', 'non', 'Sed', 'elit', 'fringilla', 'scelerisque', 'feugiat', 'semper', 'efficitur', 'vehicula', 'felis', 'tempor', 'leo', 'dui', 'rutrum', 'nisl', 'tortor', 'mollis', 'pretium', 'ante', 'consectetur', 'parturient', 'Aenean', 'fringilla', 'consequat', 'eu', 'condimentum', 'Aenean', 'malesuada', 'dui', 'orci', 'id', 'ut', 'mattis', 'leo', 'Praesent', 'tortor', 'feugiat', 'placerat', 'Vestibulum', 'pulvinar', 'eu', 'pharetra', 'a', 'felis', 'sit', 'faucibus', 'gravida', 'id', 'scelerisque', 'bibendum', 'leo', 'sed', 'pulvinar', 'convallis', 'elit', 'augue', 'justo', 'ornare', 'Donec', 'scelerisque', 'sed', 'Maecenas', 'ultrices', 'hendrerit', 'ut', 'nec', 'porttitor', 'sit', 'Morbi', 'tempus', 'sit', 'vel', 'mollis', 'enim', 'ut', 'dignissim', 'elementum', 'tempor', 'eleifend', 'et', 'Interdum', 'eu', 'Vivamus', 'ex', 'fermentum', 'massa', 'erat', 'Praesent', 'elementum', 'molestie', 'feugiat', 'quis', 'mauris', 'turpis', 'lorem'];

function powerset(str) {
  const ps = [
    [],
  ];
  for (let i = 0; i < str.length; i++) {
    for (let j = 0, len = ps.length; j < len; j++) {
      ps.push(ps[j].concat(str[i]));
    }
  }
  return ps;
}

function randomstring(n) {
  let i = 0;
  const arr = [];
  while (i < n) {
    arr.push(Math.floor(Math.random() * 65536));
    i++;
  }
  return String.fromCharCode(...arr);
}


const test = (tests, maxLength) => {
  let i = 0;
  let errors = 0;

  while (i < words.length - 1) {
    if (nodeLevenshtein(words[i], words[i + 1]) !== levenshtein(words[i], words[i + 1])) {
      errors++;
    }
    i += 2;
  }

  console.log('Non-randomized test:');
  console.log(`Errors: ${errors}\n`);

  i = 0;
  errors = 0;

  while (i < tests) {
    const lstr1 = Math.floor(Math.random() * maxLength) + 1;
    const lstr2 = Math.floor(Math.random() * maxLength) + 1;

    const str1 = randomstring(lstr1);
    const str2 = randomstring(lstr2);

    if (nodeLevenshtein(str1, str2) !== levenshtein(str1, str2)) {
      errors++;
      console.log('Randomized test:');
      console.log(`Error: ${str1} ${str2}`);

      const ps1 = powerset(str1).sort((a, b) => a.length - b.length);

      const ps2 = powerset(str2).sort((a, b) => a.length - b.length);

      let j = 0;
      let shrinked = `${str1} ${str2}`;

      while (j < ps1.length) {
        let k = 0;
        while (k < ps2.length) {
          if (nodeLevenshtein(ps1[j].join(''), ps2[k].join('')) !== levenshtein(ps1[j].join(''), ps2[k].join(''))) {
            const shrink = `${ps1[j].join('')} ${ps2[k].join('')}`;
            if (shrink.length < shrinked.length) {
              shrinked = shrink;
            }
            break;
          }
          k++;
        }
        j++;
      }
      console.log(`Shrinked: ${shrinked}`);
      break;
    }
    i++;
  }
};

test(100000, 100);
