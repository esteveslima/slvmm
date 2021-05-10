//
// Below code could be implemented with stream events on Image table
//

import * as imagesDao from '../../../common/database/dao/images-dao';

export default async (imageCreated, ContentType, ContentLength) => {
  // Check for new types
  const typeFound = await imagesDao.getTypeInfo(ContentType);
  if (!typeFound) await imagesDao.registerType(ContentType, ContentLength, imageCreated);

  // Update type's counter
  await imagesDao.updateTypeCount(ContentType);

  // Check for new size limits
  const smallestTypeImage = await imagesDao.getSmallestTypeImage(ContentType);
  const biggestTypeImage = await imagesDao.getBiggestTypeImage(ContentType);
  const isBigger = imageCreated.imageData.size > biggestTypeImage.sk;
  const isSmaller = imageCreated.imageData.size < smallestTypeImage.sk;

  if (isBigger || isSmaller) await imagesDao.registerTypeSize(ContentType, ContentLength, imageCreated);
};
