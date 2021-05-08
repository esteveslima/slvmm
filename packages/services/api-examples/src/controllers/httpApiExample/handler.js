import { lambda, logger, middleware } from '@sls/lib';

middleware.before((event) => { logger.log('httpApiExample'); });
// TODO: service/script to host endpoints in dynamodb table by service name, easing the use of api gateway without proprietary domain
// TODO: improve example -> use api-key or other auth(different from getExample), generate and test simple logs in CW, make some api call with axios interceptor(TODO) and useful processing for simple json text return
export default lambda(async (event) => {
  const { pathParameters, queryStringParameters, headers } = event;

  const message = 'This is a simple get request to an aws httpApi endpoint';

  return {
    message,
    pathParameters,
    queryStringParameters,
  };
});
