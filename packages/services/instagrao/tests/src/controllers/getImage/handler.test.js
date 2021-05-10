/* eslint-disable import/first */

// Import sut resources
import { ErrorObjects } from '@sls/lib'; // errors for comparision
import * as manageS3 from '../../../../src/common/utils/manage-s3';

// mock sut resources
// @sls/lib mocked on initial setup
jest.mock('../../../../src/common/utils/manage-s3');

// Import mocks
import * as mocks from '../../../mocks/src/controllers/getImage/handler.mock';

// Import sut
import sut from '../../../../src/controllers/getImage/handler';

// Function tests
describe('(@services/instagrao): getImage', () => {
  beforeAll(() => { });
  beforeEach(() => { jest.resetAllMocks(); });
  afterEach(() => { });
  afterAll(() => { jest.restoreAllMocks(); });

  it('expect [test scope] to [test goal] if [scenario conditions]', () => { expect(true).toBeTruthy(); }); // Test description template

  it('expect [function] to [work and call required functions with proper parameters] if [parameters are correct and function returns desired results]', async () => {
    const getImageSpy = jest.spyOn(manageS3, 'getImage').mockReturnValue(mocks.getImage.RESULT.OK);
    const event = mocks.sut.PARAMETERS.OK;

    const sutResult = await sut(event);

    expect(getImageSpy).toBeCalledWith(event.pathParameters.s3objectkey);
    expect(sutResult).toEqual(expect.objectContaining({
      headers: expect.objectContaining({
        'Content-type': expect.any(String),
      }),
      body: expect.any(String),
      isBase64Encoded: true,
    }));
  });

  it('expect [validation] to [throw wrong parameters error] if [path parameter is not valid]', async () => {
    const getImageSpy = jest.spyOn(manageS3, 'getImage').mockReturnValue(mocks.getImage.RESULT.OK);
    const event = mocks.sut.PARAMETERS.ERROR;

    expect(getImageSpy).not.toBeCalled();
    await expect(sut(event)).rejects.toThrow(ErrorObjects.WRONG_PARAMETERS);
  });

  it('expect [function] to [throw error] if [getImage function rejects]', async () => {
    const getImageSpy = jest.spyOn(manageS3, 'getImage').mockImplementation(mocks.getImage.RESULT.ERROR);
    const event = mocks.sut.PARAMETERS.OK;

    await expect(sut(event)).rejects.toThrow();
  });
});
