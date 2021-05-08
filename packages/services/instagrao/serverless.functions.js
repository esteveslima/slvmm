/* eslint-disable no-template-curly-in-string */
// Functions configuration resolved as .js variable with extra custom logic

const { utils: { functions } } = require('@sls/definitions');

module.exports = async ({ options, resolveConfigurationProperty }) => {
  const stage = await resolveConfigurationProperty(['provider', 'stage']);

  return functions({
    extractMetadata: {
      handler: './src/controllers/extractMetadata/handler.default',
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
    },
    getImage: {
      handler: './src/controllers/getImage/handler.default',
      events: [
        {
          http: {
            method: 'GET',
            path: '/getImage/{s3objectkey}',
            request: { // TEST
              parameters: {
                paths: {
                  s3objectkey: true,
                },
              },
            },
          },
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
            request: { // TEST
              parameters: {
                paths: {
                  s3objectkey: true,
                },
              },
            },
          },
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
    },
    // Function to upload images for testing purposes
    uploadImage: {
      handler: './src/controllers/uploadImage/handler.default',
      events: [
        {
          http: {
            method: 'POST',
            path: '/infoImages/{s3objectkey}',
          },
        },
      ],
    },
  });
};
