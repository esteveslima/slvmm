import {
  lambda, logger, middleware, s3,
} from '@sls/lib';

import multipartParser from 'lambda-multipart-parser';

middleware.before((event) => { logger.log('middleware usage example'); });

export default lambda(async (event) => {
  const { S3_BUCKET_INSTAGRAO } = process.env;
  const { s3objectkey } = event.pathParameters;
  const prefix = 'uploads';

  const { files } = await multipartParser.parse(event);
  const { filename, contentType, content } = files[0];

  const params = {
    Bucket: S3_BUCKET_INSTAGRAO,
    Key: `${prefix}/${s3objectkey}`,
    ContentType: contentType,
    Body: content,
  };
  const upload = await s3.putObject(params).promise();

  return {
    message: `File ${filename} uploaded to bucket ${params.Bucket} with the key ${params.Key}`,
  };
});
