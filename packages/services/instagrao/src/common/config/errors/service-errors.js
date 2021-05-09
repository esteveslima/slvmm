import { ErrorObjects } from '@sls/lib';

// Extend default core ErrorObjects to the service scope level
export default {
  ...ErrorObjects,
  IMAGE_NOT_FOUND: { errorCode: 1100, httpCode: 404, message: 'Image not found, try with another key' },
};
