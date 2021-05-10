// Using atomic operators/counters(may not be totally reliable, but this application may tolerate some error margin)
// https://dynamoosejs.com/guide/Model/#modelupdatekey-updateobj-settings-callback
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#update-property
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/WorkingWithItems.html#WorkingWithItems.AtomicCounters
// https://docs.amazonaws.cn/en_us/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.04

import Images from '../models/Images';

const imageKey = 'image_{S3_KEY}';
const infoKey = 'info_{TYPE}';
const listTypes = 'list_types';

export const registerImage = async (s3Key, contentType, size, width, height) => {
  const key = imageKey.replace('{S3_KEY}', s3Key);

  const imageCreated = await Images.create({
    type_key: key,
    sk: key,
    imageData: {
      contentType,
      size,
      width,
      height,
    },
  });

  return imageCreated;
};

// register(or initialize) new type when it doesn't exists
export const registerType = async (type, size, image) => {
  const key = infoKey.replace('{TYPE}', type);
  const sizeKey = `${size}`.padStart(15, '0');

  // initialize new info_{type}
  await Images.create({ type_key: key, sk: key, typeCount: 0 });
  await Images.create({ type_key: key, sk: sizeKey, imageReference: image });

  // check to initialize list_types
  const listTypesFound = await Images.get({ type_key: listTypes, sk: listTypes });
  if (!listTypesFound) await Images.create({ type_key: listTypes, sk: listTypes, listTypes: [] });

  // add type to list_types
  await Images.update({ type_key: listTypes, sk: listTypes }, { $ADD: { listTypes: [type] } });

  return true;
};

// register new size every time a new limit is found
// old sizes are left on table(maybe would be necessary to cleanup old limits)
export const registerTypeSize = async (type, size, image) => {
  const key = infoKey.replace('{TYPE}', type);
  const sizeKey = `${size}`.padStart(15, '0');

  await Images.create({ type_key: key, sk: sizeKey, imageReference: image }, { overwrite: true });

  return true;
};

export const updateTypeCount = async (type) => {
  const key = infoKey.replace('{TYPE}', type);

  const updatedTypeCount = await Images.update({ type_key: key, sk: key }, { $ADD: { typeCount: 1 } });

  return updatedTypeCount;
};

export const getImageInfo = async (s3Key) => {
  const key = imageKey.replace('{S3_KEY}', s3Key);

  const imageFound = await Images.get({ type_key: key, sk: key });

  return imageFound;
};

export const getTypeInfo = async (type) => {
  const key = infoKey.replace('{TYPE}', type);

  const typeFound = await Images.get({ type_key: key, sk: key });

  return typeFound;
};

export const getBiggestTypeImage = async (type) => {
  const key = infoKey.replace('{TYPE}', type);

  const typeDescending = await Images.query('type_key').eq(key).sort('descending').limit(2).exec(); // limit 2 because info_{type} comes first
  const biggestImage = typeDescending[1]; // getting the item with sort key {size} and ignoring info_{type}
  biggestImage.sk = parseInt(biggestImage.sk, 10); // parse image size sort key to int

  return biggestImage;
};

export const getSmallestTypeImage = async (type) => {
  const key = infoKey.replace('{TYPE}', type);

  const typeAscending = await Images.query('type_key').eq(key).sort('ascending').limit(1).exec();
  const smallestImage = typeAscending[0]; // getting the first item(smallest)
  smallestImage.sk = parseInt(smallestImage.sk, 10); // parse image size sort key to int

  return smallestImage;
};

export const getRegisteredTypes = async () => {
  const typesDocument = await Images.get({ type_key: listTypes, sk: listTypes });
  const types = typesDocument.listTypes;

  return types;
};
