import { buildWidgets } from 'utils';

import mockJson from './mock.json';
import expectedMock from './expectedMock.json';

describe('test buildWidgets', () => {
  it('should be equal to mock', () => {
    expect(buildWidgets(mockJson)).toMatchObject(expectedMock);
  });
});
