import { s3, ErrorResponse } from '@sls/lib';
import serviceErrors from '../config/errors/service-errors';

const { S3_BUCKET_INSTAGRAO } = process.env;
const prefix = 'uploads';

export const getImage = async (key) => {
  const params = {
    Bucket: S3_BUCKET_INSTAGRAO,
    Key: `${prefix}/${key}`,
  };
  try {
    const result = await s3.getObject(params).promise();
    return { params, result };
  } catch (err) {
    if (err.code === 'NoSuchKey' || err.code === 'AccessDenied') throw new ErrorResponse(serviceErrors.IMAGE_NOT_FOUND);
    throw err;
  }
};

export const uploadImage = async (key, fileData) => {
  const { content, contentType } = fileData;

  const params = {
    Bucket: S3_BUCKET_INSTAGRAO,
    Key: `${prefix}/${key}`,
    ContentType: contentType,
    Body: content,
  };
  const result = await s3.putObject(params).promise();

  return { params, result };
};
