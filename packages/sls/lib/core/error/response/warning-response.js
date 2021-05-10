import errorObjects from '../error-objects';

// Class wraping warning responses
class WarningResponse extends Error {
  constructor(errorObject, errorDetail) {
    super(errorObject.message);
    this.errorObject = errorObject ?? errorObjects.INTERNAL_SERVER_ERROR;
    this.errorDetail = errorDetail ?? 'Warning response';
    this.errorLevel = 'warn';
  }
}

export default WarningResponse;
