const path = require('path');

module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  coverageDirectory: '.coverage',
  // collectCoverageFrom: ['!**/__mocks__/**'],
  // coveragePathIgnorePatterns: ['/__mocks__/', '/mock/'],
  // testPathIgnorePatterns: ['/__mocks__/', '/mock/'],
  modulePathIgnorePatterns: ['.mock'],
  transform: {
    '\\.[jt]sx?$': ['babel-jest', { configFile: path.resolve(__dirname, 'babel.config.js') }],
  },
};
