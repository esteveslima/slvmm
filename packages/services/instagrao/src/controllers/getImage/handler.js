import { lambda } from '@sls/lib';
import { getImage } from '../../common/utils/manage-s3';

export default lambda(async (event) => {
  const s3objectkey = event.pathParameters.s3objectkey.replace('_', '');

  const getImageRequest = await getImage(s3objectkey);

  const base64 = Buffer.from(getImageRequest.result.Body).toString('base64');
  const { ContentType } = getImageRequest.result;

  return {
    headers: { 'Content-type': ContentType },
    body: base64,
    isBase64Encoded: true,
  };
});
