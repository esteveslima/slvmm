import { ErrorResponse, lambda } from '@sls/lib';
import serviceErrors from '../../common/config/errors/service-errors';
import * as imagesDao from '../../common/database/dao/images-dao';

export default lambda(async (event) => {
  const s3objectkey = event.pathParameters.s3objectkey.replace('_', '');

  const imageMetadata = await imagesDao.getImageInfo(s3objectkey);

  if (!imageMetadata) throw new ErrorResponse(serviceErrors.IMAGE_NOT_FOUND, s3objectkey);

  return imageMetadata;
});
