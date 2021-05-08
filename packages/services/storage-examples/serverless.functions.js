/* eslint-disable no-template-curly-in-string */
// Functions configuration resolved as .js variable with extra custom logic

const { utils: { functions } } = require('@sls/definitions');

module.exports = async ({ options, resolveConfigurationProperty }) => {
  const stage = await resolveConfigurationProperty(['provider', 'stage']);

  return functions({
    insertDataDynamoDB: {
      handler: './src/controllers/insertDataDynamoDB/handler.default',
      timeout: 30,
      events: [
        {
          http: {
            method: 'POST',
            path: '/insertDataDynamoDB',
            // request: {
            //   schemas: { // TODO: set schema path automatically(maybe only base path)
            //     'application/json': '${file(./controllers/insertDataDynamoDB/assets/schema.json)}',
            //   },
            // },
          },
        },
      ],
      // extra permissions for function
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:*'], // It's not recommended to use '*' for permissions(should be listed one by one in real projects) //TODO: list every dynamodb permissions used
          Resource: '${env:DDB_ARN_EXAMPLE}',
        },
      ],
    },
    // TODO: stream example
  });
};
