import { S3, Endpoint } from 'aws-sdk';

// Default config for s3 instance, including offline sls plugin s3 server
export default (function s3Instance() {
  const { IS_OFFLINE, STAGE, REGION } = process.env;

  const s3Config = {
    apiVersion: '2006-03-01',
    region: REGION ?? 'us-east-1',
  };

  if (IS_OFFLINE) { // for local testing purposes
    s3Config.s3ForcePathStyle = true;
    s3Config.accessKeyId = 'S3RVER'; // This specific key is required when working offline with sls plugin
    s3Config.secretAccessKey = 'S3RVER';
    s3Config.endpoint = new Endpoint('https://localhost:4569');
  }

  const s3 = new S3(s3Config);

  return s3;
}());
