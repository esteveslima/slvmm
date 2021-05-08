/* eslint-disable no-template-curly-in-string */

// Provider default configurations for AWS
// These configurations can be overrided and also be defined at function level, check https://www.serverless.com/framework/docs/providers/aws/guide/serverless.yml/)
module.exports = {
  // Main config
  name: 'aws',
  runtime: 'nodejs12.x',
  profile: 'aws-cloud', // profile with production keys in the credentials file
  stage: "${opt:stage, 'local'}",
  region: "${opt:region, 'us-east-1'}",
  // deploymentBucket: {},   // TODO(?)

  // Performance related config
  memorySize: 128,
  timeout: 10,
  // reservedConcurrency: ,
  // provisionedConcurrency: ,
  // endpointType: ,

  // Logs config
  logRetentionInDays: 7,
  // logs: {},
  // onError: arn:aws:sns:...,

  // Specific configs
  apiGateway: {
    // SEE OTHERS FEATURES
    // usagePlan:
    //  - free:
    //      quota:
    //      throttle
    //  - paid:
    //      quota:
    //      throttle
    // apiKeySourceType: ,
    // apiKeys:
    //  - free:
    //  - paid:
    // restApiId: ,
    // restApiRootResourceId: ,
    // websocketApiId: ,
    // binaryMediaTypes: [ // TODO: TEST DEPRECATION OF PLUGIN apigtwbinary and verify if */* is a jokerconfig or this must be configurated
    //   '*/*',
    // ],
    shouldStartNameWithService: true, // DEPRECATION_RESOLUTION - new naming pattern upcomming in next version
  },

  // httpApi: {},
  // TODO: see possibility of lambda layer for common functions from @sls/lib(propagating modifications in all lambdas on deploy)

  // Security configs
  // iamRoleStatements: [], // service wide permissions - plugin
  // vpc: {}, // TODO: rate-limiting, firewall and others security configurations

  // Default non-sensitive environment variables
  // AWS provides a set of default environment variables, check: https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html, https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html#cfn-pseudo-param-partition
  environment: {
    STAGE: '${sls:stage}',
    ACCOUNT_ID: { Ref: 'AWS::AccountId' },
    // API_ID: { Ref: 'ApiGatewayRestApi' }, // requires a function with "http" event in the stack
    // HTTP_API_ID: { Ref: 'HttpApi' }, // requires a function with "httpApi" event in the stack
    // URL_SUFFIX: { Ref: 'AWS::URLSuffix' },
  },

  lambdaHashingVersion: '20201221', // DEPRECATION_RESOLUTION - new lambda hashing algoritm upcoming in next version
};
