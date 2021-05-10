import { lambda } from '@sls/lib';
import * as imagesDao from '../../common/database/dao/images-dao';

export default lambda(async (event) => {
  // Get all types
  const registeredTypes = await imagesDao.getRegisteredTypes();

  // Get results
  const resultList = await Promise.all(
    registeredTypes.map(async (type) => {
      const typeInfo = await imagesDao.getTypeInfo(type);
      const biggest = await imagesDao.getBiggestTypeImage(type);
      const smallest = await imagesDao.getSmallestTypeImage(type);
      return { typeInfo, smallest, biggest };
    }),
  );
  // Bundle results
  const resultObj = resultList.reduce((acc, curr) => {
    const type = curr.typeInfo.type_key.replace('info_', '');
    acc[type] = curr;
    return acc;
  }, {});

  // Set general results
  resultObj.general = {
    info: {
      typesList: registeredTypes,
      typesCount: resultList.reduce((acc, curr) => acc + curr.typeInfo.typeCount, 0),
    },
    // eslint-disable-next-line prefer-spread
    biggestSize: Math.max.apply(Math, resultList.map((item) => item.biggest.sk)),
    // eslint-disable-next-line prefer-spread
    smallestSize: Math.min.apply(Math, resultList.map((item) => item.smallest.sk)),
  };

  return resultObj;
});
