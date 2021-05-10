import * as dynamoose from 'dynamoose';

export default () => {
  const { IS_OFFLINE } = process.env;
  if (IS_OFFLINE) dynamoose.aws.ddb.local('http://dynamodb-container:8000'); // side effects(?)
};
