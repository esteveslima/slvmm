/* eslint-disable no-template-curly-in-string */
// Functions configuration resolved as .js variable with extra custom logic

const { utils: { functions } } = require('@sls/definitions');

module.exports = async ({ options, resolveConfigurationProperty }) => {
  const stage = await resolveConfigurationProperty(['provider', 'stage']);

  return functions({ // TODO: documentation per function definition(native or by plugin)
    // offline-scheduler plugin may conflict with vscode debugger
    cronExample: stage !== 'local' && {
      handler: './src/controllers/cronExample/handler.default',
      timeout: 60,
      events: [
        {
          schedule: {
            enabled: true,
            rate: stage === 'local' ? 'rate(1 minute)' : 'cron(0 0 * * ? *)',
            // input: {}  // may be useful to differ between multiple crons
          },
        },
      ],
    },
    s3Example: {
      handler: './src/controllers/s3Example/handler.default',
      timeout: 60,
      events: [
        {
          s3: {
            bucket: '${env:S3_BUCKET_EXAMPLE}',
            existing: true, // Prefer to create resources independently from this stack, preventing syncing and data loss problems
            event: 's3:ObjectCreated:*', // event do not trigger if the object is updated(not created)
            rules: [
              {
                prefix: 'uploads/',
              },
              {
                suffix: '.txt',
              },
            ],
          },
        },
      ],
    },
    snsExample: {
      handler: './src/controllers/snsExample/handler.default',
      timeout: 60,
      events: [
        {
          sns: {
            arn: '${env:SNS_ARN_EXAMPLE}', // Prefer to create resources independently from this stack, preventing syncing and data loss problems
            filterPolicy: {
              example: [
                'test',
              ],
            },
          },
        },
      ],
    },
    sqsExample: stage !== 'local' && {
      handler: './src/controllers/sqsExample/handler.default',
      timeout: 30, // limited to queue timeout
      events: [
        {
          sqs: {
            arn: '${env:SQS_ARN_EXAMPLE}', // Prefer to create resources independently from this stack, preventing syncing and data loss problems
            enabled: true,
            batchSize: 1,
            maximumBatchingWindow: 10,
          },
        },
      ],
    },
    triggerEvents: {
      handler: './src/controllers/triggerEvents/handler.default',
      timeout: 28,
      events: [
        {
          httpApi: {
            method: 'POST',
            path: '/triggerEvents',
          },
        },
      ],
      environment: {
        S3_BUCKET_EXAMPLE: '${env:S3_BUCKET_EXAMPLE}',
        SNS_ARN_EXAMPLE: '${env:SNS_ARN_EXAMPLE}',
        SQS_URL_EXAMPLE: '${env:SQS_URL_EXAMPLE}',
      },
      // extra permissions for function
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['s3:PutObject'],
          Resource: '${env:S3_ARN_EXAMPLE}/*',
        },
        {
          Effect: 'Allow',
          Action: ['sns:Publish'],
          Resource: '${env:SNS_ARN_EXAMPLE}',
        },
        {
          Effect: 'Allow',
          Action: ['sqs:SendMessage'],
          Resource: '${env:SQS_ARN_EXAMPLE}',
        },
      ],
    },
  });
};
