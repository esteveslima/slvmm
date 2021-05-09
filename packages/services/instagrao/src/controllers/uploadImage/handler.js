import { lambda, logger, middleware } from '@sls/lib';
import multipartParser from 'lambda-multipart-parser';
import { uploadImage } from '../../common/utils/manageS3Image';

middleware.before((event) => { logger.log('middleware usage example'); });

export default lambda(async (event) => {
  const { s3objectkey } = event.pathParameters;

  const { files } = await multipartParser.parse(event);
  const file = files[0];

  const uploadImageRequest = await uploadImage(s3objectkey, file);

  return {
    message: `File ${file.filename} successfully uploaded with the key ${uploadImageRequest.params.Key} to the bucket ${uploadImageRequest.params.Bucket}`,
  };
});
