import {
  lambda, logger, middleware, s3,
} from '@sls/lib';

middleware.before((event) => { logger.log('middleware usage example'); });

export default lambda(async (event) => {
  const { S3_BUCKET_INSTAGRAO } = process.env;
  const { s3objectkey } = event.pathParameters;
  const prefix = 'uploads';

  const params = {
    Bucket: S3_BUCKET_INSTAGRAO,
    Key: `${prefix}/${s3objectkey}`,
  };
  const image = await s3.getObject(params).promise();

  const base64 = Buffer.from(image.Body).toString('base64');
  const { ContentType } = image;

  return {
    headers: { 'Content-type': ContentType },
    body: base64,
    isBase64Encoded: true,
  };
});
