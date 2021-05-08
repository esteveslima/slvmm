import { sqs } from '@sls/lib';

const { SQS_URL_EXAMPLE } = process.env;

export default async () => {
  // Triggering sqs event

  const params = {
    DelaySeconds: 10,
    MessageAttributes: {
      example: {
        DataType: 'String', // String, String.Array, Number or Binary
        StringValue: 'test',
      },
    },
    MessageBody: JSON.stringify({ messageKey: 'messageValue' }),
    QueueUrl: SQS_URL_EXAMPLE,
  };
  // requires the queue to be created, use aws cli on elasticmq container(or created script "npm run aws:sqs ...")
  const submission = await sqs.sendMessage(params).promise();

  return submission;
};
