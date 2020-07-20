module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'airbnb',
    'plugin:node/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    'no-plusplus': 'off',
    'no-bitwise': 'off',
    'camelcase': 'off',
    'no-param-reassign': 'off'
  },
};
