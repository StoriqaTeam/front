import { fromRelayError } from 'utils';

const commonErrorWrapper = errObj => ({
  source: {
    errors: [{
      data: errObj,
    }],
  },
});

const code100error = commonErrorWrapper({
  code: 100,
  details: {
    status: '400 Bad Request',
    message: "{\"email\":[{\"code\":\"email\",\"message\":\"Invalid email format\",\"params\":{\"value\":\"\"}}],\"phone\":[{\"code\":\"phone\",\"message\":\"Incorrect phone format\",\"params\":{\"value\":\"\"}}]}",
  },
});

describe('fromRelayError helper', () => {
  describe('for API errors (with code 100)', () => {
    it('should convert to `{ code: { status, message }}`', () => {
      const converted = fromRelayError(code100error);
      expect(converted).toMatchObject({
        100: {
          status: '400 Bad Request',
          messages: {
            email: ['Invalid email format'],
            phone: ['Incorrect phone format'],
          },
        },
      });
    });
  });
});
