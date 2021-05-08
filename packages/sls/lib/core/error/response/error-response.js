import errorObjects from '../error-objects';

// Class wraping error responses
class ErrorResponse extends Error {
  constructor(errorObject, errorDetail) {
    super();
    this.errorObject = errorObject ?? errorObjects.INTERNAL_SERVER_ERROR;
    this.errorDetail = errorDetail ?? 'Error response';
    this.errorLevel = 'error';
  }
}

ErrorResponse.parse = (err) => {
  if (err instanceof ErrorResponse) return { ...err };

  // If it is not a manually thrown ErrorResponse or WarningResponse object...
  // ... is possible to test map the error and parse to a proper ErrorResponse object
  const errorObject = errorObjects.INTERNAL_SERVER_ERROR;
  const errorDetail = `${err}`;
  // TODO: enable customize these errors per function
  /* switch (true) {
    case (err.name === ''): {
      errorObject = ...
      errorDetail = ...
      break;
    }
    case (err.name === ' '): {

      break;
    }
    default: {
      errorObject = { ...errorObjects.INTERNAL_SERVER_ERROR };
      errorDetail = `${err}`;
    }
  } */

  return new ErrorResponse(errorObject, errorDetail);
};

export default ErrorResponse;
