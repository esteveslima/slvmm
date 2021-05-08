const path = require('path');

module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      configFile: path.resolve(__dirname, 'babel.config.js'),
    },
  },
  rules: {
    'max-len': 'off',
    'no-unused-vars': 'off',

    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
