import { parseErrorResponse } from './response/response';
import errorObjects from './error-objects';
import logger from '../logger/logger';

// const { IS_OFFLINE } = process.env;

export default (err) => {
  const errorResponse = parseErrorResponse(err);
  errorResponse.stack = err.stack;

  logger[errorResponse.errorLevel]({ errorResponse }); // Logging error by default

  return {
    errorObject: errorResponse, // used only for middleware
    response: {
      statusCode: errorResponse.errorObject?.httpCode ?? errorObjects.INTERNAL_SERVER_ERROR.httpCode,
      Error: errorResponse.errorObject?.errorCode ?? errorObjects.INTERNAL_SERVER_ERROR.errorCode,
      Message: errorResponse.errorObject?.message ?? errorObjects.INTERNAL_SERVER_ERROR.message,
      // headers, //TODO: return useful data?
    },
  };
};
