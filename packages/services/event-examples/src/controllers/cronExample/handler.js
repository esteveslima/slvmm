import { lambda, logger, middleware } from '@sls/lib';

middleware.before((event) => { logger.log('cronExample'); });

export default lambda(async (event) => {
  const message = 'This lambda function was triggered by a cloudwatch event';

  logger.log(message);
});
