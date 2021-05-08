import { lambda, logger, middleware } from '@sls/lib';

middleware.before((event) => { logger.log('middleware usage example'); });

export default lambda(async (event) => {
  const result = 123;
  return {
    someResult: result,
  };
});
