import logger from '../logger/logger';
import { errorHandler } from '../error/error';

// Simple singleton middleware for functions
export default (function middleware() {
  // Private properties

  // Registered middlewares
  const queue = {
    before: [],
    after: [],
    error: [],
  };
  // Run middlewares queue(does not modify arguments)
  const run = {
    async before(functionArgs) {
      await Promise.all(
        queue.before.map(async (func) => {
          const middlewareResult = await func(functionArgs);
          // custom logic ... ?
        }),
      );
    },
    async after(functionArgs, functionResult) {
      await Promise.all(
        queue.after.map(async (func) => {
          try {
            const middlewareResult = await func(functionResult, functionArgs);
            // custom logic ... ?
          } catch (middlewareError) {
            logger.error(`Silent Middleware Error: ${middlewareError.stack}`);
          }
        }),
      );
    },
    async error(functionArgs, errorObject) {
      await Promise.all(
        queue.error.map(async (func) => {
          try {
            const middlewareResult = await func(errorObject, functionArgs);
            // custom logic ... ?
          } catch (middlewareError) {
            logger.error(`Silent Middleware Error: ${middlewareError.stack}`);
          }
        }),
      );
    },
  };

  return {
    // Public properties

    // Resolve function between middlewares
    async resolve(func, args) {
      try {
        await run.before(args);
        const functionResult = await func.apply(this, args);
        await run.after(functionResult, args);

        return functionResult;
      } catch (error) {
        const handledError = errorHandler(error);
        await run.error(handledError.errorObject, args);
        return handledError.response;
      }
    },
    // Register middlewares(TODO: make only these methods public)
    before(func) { return typeof func === 'function' && queue.before.push(func); },
    after(func) { return typeof func === 'function' && queue.after.push(func); },
    error(func) { return typeof func === 'function' && queue.error.push(func); },
  };
}());
