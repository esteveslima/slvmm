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
    requireConfigFile: false, // fix @babel/eslint-parser error with eslint-plugin-import
    babelOptions: {
      configFile: path.resolve(__dirname, 'babel.config.js'), // Using configurations' package babel config file
    },
  },
  // ESLINT PLUGINS NOT WORKING IN MONOREPO?
  // plugins: [
  //   '@babel/plugin-proposal-class-properties', ---> using directly from babel.config.js file
  // ],
  // root: true,
  rules: {
    'max-len': 'off',
    'no-unused-vars': 'off',

    'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // should prevent dependency versions incompatibility by prohibiting to use external dependencies(from another packages hoisted to root node_modules)
  },
  settings: {
    // // This setting should be avoided for the best use of the monorepo structure, requiring to add local packages as dependencies...
    // // ...So that changes on common packages could be propagated and recognized on leaf packages...
    // // ...This way, using tools like "lerna ls --since" would return all packages that should be updated for the CI and would be deployed
    // 'import/internal-regex': '^@sls/', // DISABLED: Ignore pattern from no-extraneous-dependencies for the monorepo packages
  },
};
