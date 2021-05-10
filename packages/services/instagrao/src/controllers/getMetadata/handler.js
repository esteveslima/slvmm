import { lambda, logger, middleware } from '@sls/lib';
import * as imagesDao from '../../common/database/dao/images-dao';

middleware.before((event) => { logger.log('middleware usage example'); });

export default lambda(async (event) => {
  const { s3objectkey } = event.pathParameters;

  const imageMetadata = await imagesDao.getImageInfo(s3objectkey);

  return imageMetadata;
});
