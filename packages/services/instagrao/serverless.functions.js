/* eslint-disable no-template-curly-in-string */
// Functions configuration resolved as .js variable with extra custom logic

const { utils: { functions } } = require('@sls/definitions');

module.exports = async ({ options, resolveConfigurationProperty }) => {
  const stage = await resolveConfigurationProperty(['provider', 'stage']);

  return functions({
    extractMetadata: {
      handler: './src/controllers/extractMetadata/handler.default',
      environment: {
        S3_BUCKET_INSTAGRAO: '${env:S3_BUCKET_INSTAGRAO}',
      },
      timeout: 60,
      events: [
        {
          s3: {
            bucket: '${env:S3_BUCKET_INSTAGRAO}',
            existing: true, // Prefer to create resources independently from this stack, preventing syncing and data loss problems
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploads/',
              },
            ],
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['s3:GetObject'],
          Resource: '${env:S3_ARN_INSTAGRAO}/*',
        },
        {
          Effect: 'Allow',
          Action: ['dynamodb:*'],
          Resource: '${env:DDB_ARN_INSTAGRAO}',
        },
      ],
    },
    getImage: {
      handler: './src/controllers/getImage/handler.default',
      environment: {
        S3_BUCKET_INSTAGRAO: '${env:S3_BUCKET_INSTAGRAO}',
      },
      events: [
        {
          http: {
            method: 'GET',
            path: '/getImage/{s3objectkey}',
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['s3:GetObject'],
          Resource: '${env:S3_ARN_INSTAGRAO}/*',
        },
      ],
    },
    getMetadata: {
      handler: './src/controllers/getMetadata/handler.default',
      events: [
        {
          http: {
            method: 'GET',
            path: '/getMetadata/{s3objectkey}',
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:*'],
          Resource: '${env:DDB_ARN_INSTAGRAO}',
        },
      ],
    },
    infoImages: {
      handler: './src/controllers/infoImages/handler.default',
      events: [
        {
          http: {
            method: 'GET',
            path: '/infoImages',
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:*'],
          Resource: '${env:DDB_ARN_INSTAGRAO}',
        },
      ],
    },
    // Function to upload images for testing purposes
    uploadImage: {
      handler: './src/controllers/uploadImage/handler.default',
      environment: {
        S3_BUCKET_INSTAGRAO: '${env:S3_BUCKET_INSTAGRAO}',
      },
      events: [
        {
          http: {
            method: 'POST',
            path: '/uploadImage/{s3objectkey}',
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['s3:PutObject'],
          Resource: '${env:S3_ARN_INSTAGRAO}/*',
        },
      ],
    },
  });
};
