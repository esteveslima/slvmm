/* eslint-disable prefer-rest-params */

// Default setup that runs before every test

// mock lib package
jest.mock('@sls/lib', () => {
  // const mockedModule = Object.keys(jest.requireActual('@sls/lib')).reduce((acc, curr) => {
  //   acc[curr] = jest.fn();
  //   return acc;
  // }, {});
  const originalModule = jest.requireActual('@sls/lib');
  return {
    __esModule: true,
    ...originalModule,
    middleware: jest.fn().mockReturnValue(), // mock middleware
    lambda: jest.fn().mockImplementation((func) => async function mockWrapper() { return func.apply(this, arguments); }), // mock "lambda" wrapper, removing it's implementation and levaing the original function
  };
});
