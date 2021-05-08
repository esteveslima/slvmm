/* eslint-disable no-template-curly-in-string */
// Functions configuration resolved as .js variable with extra custom logic

const { utils: { functions } } = require('@sls/definitions');
// TODO: create base variables for repetitive parameters like handler
module.exports = async ({ options, resolveConfigurationProperty }) => {
  const stage = await resolveConfigurationProperty(['provider', 'stage']);

  // TODO: option to get a mocked api version
  return functions({
    asyncExample: stage !== 'local' && {
      handler: './src/controllers/asyncExample/handler.default',
      timeout: 900,
      // destinations: { onSuccess: 'someOtherFunction', onFailure: 'arn:...'}, // TODO: destinations example for async invocations
      events: [
        {
          http: {
            method: 'POST',
            path: '/asyncExample/{parameter}',
            async: true,
          },
        },
      ],
    },
    getExample: { // TODO: test request parameters requirements for path/query/header
      handler: './src/controllers/getExample/handler.default',
      events: [
        {
          http: {
            method: 'GET',
            path: '/getExample/{someRequiredPathParameter}',
            request: { // TODO: not working
              parameters: {
                paths: {
                  someRequiredPathParameter: true,
                },
                querystrings: {
                  someRequiredQueryParameter: true,
                },
                headers: {
                  someRequiredHeaderParameter: true,
                },
              },
            },
          },
        },
      ],
    },
    httpApiExample: { // TODO: examples with authorizers for http and httapi and private for http events
      handler: './src/controllers/httpApiExample/handler.default',
      timeout: 28,
      events: [
        {
          httpApi: {
            method: 'GET',
            path: '/httpApiExample/{someParameter}',
          },
        },
      ],
    },
    postExample: {
      handler: './src/controllers/postExample/handler.default',
      events: [
        {
          http: {
            method: 'POST',
            path: '/postExample', // todo: use joi
            // request: { // TODO: find a way to convert npm package schema(as joi) to jsonschema, having both validations to http events https://www.npmjs.com/package/joi-to-json-schema/v/3.0.0
            //   schemas: { // TODO: set schema path automatically(maybe only base path)
            //     'application/json': '${file(./src/controllers/postExample/assets/schema.json)}',
            //   },
            // },
          },
        },
      ],
    },
    // TODO: websocket example
  });
};
