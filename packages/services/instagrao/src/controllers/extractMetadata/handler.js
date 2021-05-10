import { lambda } from '@sls/lib';
import sizeOf from 'image-size';
import { getImage } from '../../common/utils/manage-s3';
import * as imagesDao from '../../common/database/dao/images-dao';
import registerIndexes from './utils/register-indexes';

export default lambda(async (event) => {
  const s3objectkey = event.Records[0].s3.object.key.split('/')[1];

  const getImageRequest = await getImage(s3objectkey);
  const { ContentType, ContentLength } = getImageRequest.result;

  const imageBuffer = getImageRequest.result.Body;
  const { width, height } = sizeOf(imageBuffer);

  // Register image on ddb
  const imageCreated = await imagesDao.registerImage(s3objectkey, ContentType, ContentLength, width, height);

  // Register indexes to avoid using SCAN operations on the table
  await registerIndexes(imageCreated, ContentType, ContentLength);
});
