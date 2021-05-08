import { SNS } from 'aws-sdk';

// Default config for sns instance, including offline sls plugin sns server
export default (function snsInstance() {
  const { IS_OFFLINE, STAGE, REGION } = process.env;

  const snsConfig = {
    apiVersion: '2010-03-31',
    region: REGION ?? 'us-east-1',
  };

  if (IS_OFFLINE) { // for local testing purposes
    snsConfig.endpoint = 'http://127.0.0.1:4002'; // 'http://localhost:4002';
  }

  const sns = new SNS(snsConfig);

  // wraps original function to replace accountId when running offline server
  sns.publish = (params, cb = undefined) => {
    const parameters = params;
    const snsPluginAccountId = '123456789012';
    if (IS_OFFLINE) parameters.TopicArn = parameters.TopicArn.replace(parameters.TopicArn.split(':')[4], snsPluginAccountId);
    const snsOriginal = new SNS(snsConfig);
    return snsOriginal.publish(parameters, cb);
  };

  return sns;
}());
