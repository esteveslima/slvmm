// Filter the functions resolved as falsy when it doesn't match the stablished condition on serverless.functions.js

module.exports = (functions) => {
  const permittedFunctions = Object.keys(functions).filter((funcName) => functions[funcName]);
  const functionsObject = permittedFunctions.reduce((acc, curr) => {
    acc[curr] = functions[curr];
    return acc;
  }, {});

  return functionsObject;
};
