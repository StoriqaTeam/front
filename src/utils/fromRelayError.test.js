import { fromRelayError } from 'utils';

const commonError = {
  source: {
    errors: [
      {
        data: {
          code: 100,
          details: {
            status: '400 Bad Request',
            // eslint-disable-next-line
            message: "{\"email\":[{\"code\":\"email\",\"message\":\"Invalid email format\",\"params\":{\"value\":\"\"}}],\"phone\":[{\"code\":\"phone\",\"message\":\"Incorrect phone format\",\"params\":{\"value\":\"\"}}]}",
          },
        },
      },
    ],
  },
};

describe('fromRelayError helper', () => {
  describe('for common errors', () => {
    it('should convert to `{ code: { status, message }}`', () => {
      const converted = fromRelayError(commonError);
      expect(converted).toMatchObject({
        100: {
          status: '400 Bad Request',
          message: {
            email: 'Invalid email format',
            phone: 'Incorrect phone format',
          },
        },
      });
    });
  });
});
