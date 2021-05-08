import {
  lambda,
  logger,
  middleware,
} from '@sls/lib';

middleware.before((event) => { logger.log('getExample'); });
// TODO: use examples with lodash
// TODO:
// TODO: improve example -> validate request parameters(check if it works), use api-key or other auth,
export default lambda(async (event) => {
  const { pathParameters, queryStringParameters, headers } = event;

  const message = 'This is a simple get request with path, query and header parameters';

  return {
    message,
    pathParameters,
    queryStringParameters,
  };
});
