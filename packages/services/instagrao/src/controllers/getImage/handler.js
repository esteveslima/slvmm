import { lambda, logger, middleware } from '@sls/lib';
import { getImage } from '../../common/utils/manageS3Image';

middleware.before((event) => { logger.log('middleware usage example'); });

export default lambda(async (event) => {
  const { s3objectkey } = event.pathParameters;

  const getImageRequest = await getImage(s3objectkey);

  const base64 = Buffer.from(getImageRequest.result.Body).toString('base64');
  const { ContentType } = getImageRequest.result;

  return {
    headers: { 'Content-type': ContentType },
    body: base64,
    isBase64Encoded: true,
  };
});
