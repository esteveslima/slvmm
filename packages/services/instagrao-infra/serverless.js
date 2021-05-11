/* eslint-disable no-template-curly-in-string */

const { provider: { aws }, plugins: { allPlugins, pluginsCustoms } } = require('@sls/definitions');

const serviceName = __dirname.split('/').slice(-1)[0]; // Using project folder name as service name

module.exports = {
  service: serviceName,

  frameworkVersion: '^2',
  useDotenv: true,
  variablesResolutionMode: 20210219,
  configValidationMode: 'warn',

  // Default configurations can be customized and overrided
  provider: { ...aws },
  resources: {
    Resources: {
      // s3 bucket
      imagesS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'instagrao-bucket',
        },
      },
      // dynamodb table
      imagesDDBTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'Images',
          AttributeDefinitions: [
            {
              AttributeName: 'type_key',
              AttributeType: 'S',
            },
            {
              AttributeName: 'sk',
              AttributeType: 'S',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'type_key',
              KeyType: 'HASH',
            },
            {
              AttributeName: 'sk',
              KeyType: 'RANGE',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },

};
