import { lambda, logger, middleware } from '@sls/lib';

middleware.before((event) => { logger.log('postExample'); });

export default lambda(async (event) => {
  const parameters = event.body;
  // TODO: improve example -> input data, joi validate(maybe find a way to use native json schema valdiator from aws), return generated file pdf/xls/doc/... (binary data)
  const message = 'This is a simple post request with input validation';

  return { message, parameters };
});
