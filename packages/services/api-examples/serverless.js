/* eslint-disable no-template-curly-in-string */

const { provider: { aws }, plugins: { allPlugins, pluginsCustoms } } = require('@sls/definitions');

const serviceName = __dirname.split('/').slice(-1)[0]; // Using project folder name as service name
// TODO: lint-stage & husky config after lerna!!!

// TODO: typescript examples
// TODO: step functions example?
// TODO: few CW alerts(in free tier range)
module.exports = {
  service: serviceName,

  frameworkVersion: '^2',
  useDotenv: true,
  variablesResolutionMode: 20210219, // DEPRECATION_RESOLUTION - new variables resolutions upcoming in v3
  configValidationMode: 'warn',

  // Default configurations can be customized and overrided
  provider: { ...aws },
  package: { individually: true },
  plugins: [...allPlugins],
  custom: { ...pluginsCustoms(allPlugins) },
  resources: { /* Resources: {} */ },

  functions: '${file(serverless.functions.js)}',
};
