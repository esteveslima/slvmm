import {
  ErrorResponse, lambda, logger, middleware,
} from '@sls/lib';

middleware.before((event) => { logger.log('snsExample'); });
// TODO: test examples with actions plugged at sns topic(aws console)
export default lambda(async (event) => {
  const snsMessages = event.Records.map((record) => JSON.parse(record.Sns.Message));

  const message = 'This lambda function was triggered by a sns topic';

  logger.log(message);
  logger.log(snsMessages);

  return true;
});
