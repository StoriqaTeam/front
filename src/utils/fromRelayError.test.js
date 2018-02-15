import { fromRelayError } from 'utils';

const commonError = {
  source: {
    errors: [
      {
        data: {
          code: 100,
          details: {
            status: '400 Bad Request',
          },
        },
      },
    ],
  },
};

describe('fromRelayError helper', () => {
  describe('for common errors', () => {
    it('should convert to `{ code: status}`', () => {
      const converted = fromRelayError(commonError);
      expect(converted).toMatchObject({
        100: '400 Bad Request',
      });
    });
  });
});
