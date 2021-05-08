import { SQS } from 'aws-sdk';
import { logger } from '../../../core/core';

// Default config for sqs instance, including offline sls plugin sqs server
export default (function sqsInstance() {
  const { IS_OFFLINE, STAGE, REGION } = process.env;

  const sqsConfig = {
    apiVersion: '2012-11-05',
    region: REGION ?? 'us-east-1',
  };

  if (IS_OFFLINE) { // for local testing purposes
    sqsConfig.endpoint = 'http://localhost:9324'; // 'http://queue-container:9324'
  }

  const sqsOriginal = new SQS(sqsConfig);
  const sqs = new SQS(sqsConfig);

  // wraps original function to change request to local queue when running offline server(may conflict inside docker container)
  sqs.sendMessage = (params, cb = undefined) => {
    const parameters = params;

    if (IS_OFFLINE) {
      // mock queueUrl for local testing
      const queueName = parameters.QueueUrl.split('/').slice(-1)[0];
      const queueDomain = sqsConfig.endpoint;
      parameters.QueueUrl = `${queueDomain}/000000000000/${queueName}`; // check with created queue url
    }

    return sqsOriginal.sendMessage(parameters, cb);
  };

  return sqs;
}());

// // Default config for sqs instance, including offline sls plugin sqs server
// const { IS_OFFLINE, STAGE, REGION } = process.env;

// const sqsConfig = {
//   apiVersion: '2012-11-05',
//   region: REGION ?? 'us-east-1',
// };

// const sqsOriginal = new SQS(sqsConfig);
// const sqs = new SQS(sqsConfig);

// // wraps original function to change queueUrl to localhost when running offline server(sqs plugin not working inside docker container)
// sqs.sendMessage = (params) => {
//   const parameters = params;
//   if (IS_OFFLINE) parameters.QueueUrl = parameters.QueueUrl.replace('https', 'http').replace(parameters.QueueUrl.split('/')[2], 'localhost:9324');
//   return sqsOriginal.sendMessage(parameters);
// };

// export default sqs;
