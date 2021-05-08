/* eslint-disable no-template-curly-in-string */

// Default config for aws lambda
module.exports = {
  name: 'aws',
  runtime: 'nodejs12.x',
  profile: 'aws-cloud',
  stage: "${opt:stage, 'local'}",
  region: "${opt:region, 'us-east-1'}",

  memorySize: 128,
  timeout: 10,

  logRetentionInDays: 7,

  apiGateway: {
    shouldStartNameWithService: true,
  },

  environment: {
    STAGE: '${sls:stage}',
    ACCOUNT_ID: { Ref: 'AWS::AccountId' },
  },

  lambdaHashingVersion: '20201221',
};
