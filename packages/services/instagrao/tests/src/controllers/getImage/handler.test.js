/* eslint-disable import/first */

import { lambda } from '@sls/lib';
import { getImage } from '../../../../src/common/utils/manage-s3';

jest.mock('@sls/lib');
jest.mock('../../../../src/common/utils/manage-s3');

import sut from '../../../../src/controllers/getImage/handler';

describe('test(@services/instagrao) -> getImage', () => {
  beforeAll(() => { });
  beforeEach(() => { jest.resetAllMocks(); });
  afterEach(() => { });
  afterAll(() => { jest.restoreAllMocks(); });

  it('abc', () => {
    expect(1).toBe(1);
  });
});
