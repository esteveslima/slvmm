export const sut = {
  PARAMETERS: {
    OK: {
      pathParameters: {
        s3objectkey: 'someS3Key',
      },
    },
    ERROR: {
      pathParameters: {
        s3objectkey: '_',
      },
    },
  },
};

export const getImage = {
  RESULT: {
    OK: {
      result: {
        Body: Buffer.from('mockBuffer'),
        ContentType: 'some-type',
      },
    },
    ERROR: () => { throw new Error('GETIMAGE ERROR'); },
  },
};
