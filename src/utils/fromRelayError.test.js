import { fromRelayError } from 'utils';

const commonErrorWrapper = errObj => ({
  source: {
    errors: [{
      data: errObj,
    }],
  },
});

const apiErrorWithDetails = commonErrorWrapper({
  code: 100,
  details: {
    status: '400 Bad Request',
    message: "{\"email\":[{\"code\":\"email\",\"message\":\"Invalid email format\",\"params\":{\"value\":\"\"}}],\"phone\":[{\"code\":\"phone\",\"message\":\"Incorrect phone format\",\"params\":{\"value\":\"\"}}]}",
  },
});

const apiErrorWithoutDetails = commonErrorWrapper({
  code: 100,
  details: {
    status: '403 Forbidden',
  },
});

const networkError = commonErrorWrapper({
  code: 200,
  details: 'Some network error message',
});

const parseError = commonErrorWrapper({
  code: 300,
  details: 'Some parse error message',
});

const unknownError = commonErrorWrapper({
  code: 400,
  details: 'Some unknown error message',
});

describe('fromRelayError helper', () => {
  //
  describe('API errors (code 100)', () => {
    describe('error with `message`', () => {
      it('should return correct object', () => {
        const converted = fromRelayError(apiErrorWithDetails);
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
    describe('error without `message`', () => {
      it('should return correct object', () => {
        const converted = fromRelayError(apiErrorWithoutDetails);
        expect(converted).toMatchObject({
          100: {
            status: '403 Forbidden',
          },
        });
      });
    });
  });

  describe('Network errors (code 200)', () => {
    it('should return correct object', () => {
      const converted = fromRelayError(networkError);
      expect(converted).toMatchObject({
        200: {
          status: 'Some network error message',
        },
      });
    });
  });

  describe('Parse errors (code 300)', () => {
    it('should return correct object', () => {
      const converted = fromRelayError(parseError);
      expect(converted).toMatchObject({
        300: {
          status: 'Some parse error message',
        },
      });
    });
  });

  describe('Unknown errors (code 400)', () => {
    it('should return correct object', () => {
      const converted = fromRelayError(unknownError);
      expect(converted).toMatchObject({
        400: {
          status: 'Some unknown error message',
        },
      });
    });
  });
});
