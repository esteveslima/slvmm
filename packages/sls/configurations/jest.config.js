module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/services'],
  coverageDirectory: '.coverage',
  // collectCoverageFrom: ['!**/__mocks__/**'],
  // coveragePathIgnorePatterns: ['/__mocks__/', '/mock/'],
  // testPathIgnorePatterns: ['/__mocks__/', '/mock/'],
  modulePathIgnorePatterns: ['.mock'],
};
