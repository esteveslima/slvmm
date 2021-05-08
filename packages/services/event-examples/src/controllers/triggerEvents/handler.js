import { lambda, logger, middleware } from '@sls/lib';
import trigger from './utils/trigger';

middleware.before((event) => { logger.log('triggerEventsExample'); });

export default lambda(async (event) => {
  const { events } = event.queryStringParameters ?? {};
  const availableEvents = ['sns', /* 'sqs', */ 's3'];
  const triggeredEvents = events?.split(',') ?? availableEvents;

  const result = await trigger(triggeredEvents);

  return result;
});
