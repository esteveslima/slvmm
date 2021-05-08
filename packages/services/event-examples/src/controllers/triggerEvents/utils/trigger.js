import { logger } from '@sls/lib';
import triggerSns from './triggerSns';
import triggerSqs from './triggerSqs';
import triggerS3 from './triggerS3';

const { IS_OFFLINE } = process.env;

export default async (triggeredEvents) => {
  const eventsInfo = {};

  // Triggering sns event
  if (triggeredEvents.includes('sns')) {
    eventsInfo.sns = await triggerSns();
  }

  // Triggering sqs event
  if (triggeredEvents.includes('sqs')) {
    if (!IS_OFFLINE) eventsInfo.sqs = await triggerSqs();
    else logger.info('Not triggering sqs with sls offline environment by default, check sqs plugin definition for more details');
  }

  // Triggering sqs event
  if (triggeredEvents.includes('s3')) {
    eventsInfo.s3 = await triggerS3();
  }

  return eventsInfo;
};
