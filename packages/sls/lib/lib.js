// // Export main resources objects
// export * as Core from './core/core';
// export * as Aws from './providers/aws/aws';

// Export frequently used core resources
export {
  logger,
  middleware,
  WarningResponse,
  ErrorResponse,
  ErrorObjects,
} from './core/core';

// Export frequently used aws resources
export {
  lambda,
  s3,
  sns,
  sqs,
} from './providers/aws/aws';

// TODO: rename to index?
