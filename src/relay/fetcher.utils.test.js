import { isJwtExpiredErrorInResponse, isJwtRevokedInResponse } from './fetcher.utils';

const jwtExpiredError = {
    data: {
        code: 111,
        details: 'asdfasdf'
    }
}

const jwtRevokedError = {
    data: {
        code: 112,
        details: 'asdfas'
    }
}

describe('isJwtExpiredErrorInResponse', ()=> {
    describe('when response is null', () => {
        it('returns false', () => {
            const result = isJwtExpiredErrorInResponse(null);
            expect(result).toBeFalsy();
        })
    });

    describe('when errors have different shape', () => {
        it('returns false', () => {
            const result = isJwtExpiredErrorInResponse({ errors: [{ kode: 11 }]});
            expect(result).toBeFalsy();
        })
    });

    describe('when errors exist', () => {
        it('returns `true` when any error has code `111`', () => {
            const result = isJwtExpiredErrorInResponse({ errors: [
                jwtExpiredError, 
                jwtRevokedError
              ]
            })
            expect(result).toBeTruthy();
        })

        it('returns `false` when no errors have code `111`', () => {
            const result = isJwtExpiredErrorInResponse({ errors: [
                jwtRevokedError,
                jwtRevokedError
              ]
            })
            expect(result).toBeFalsy();
        })
    })
})

describe('isJwtRevokedInResponse', ()=> {
    describe('when response is null', () => {
        it('returns false', () => {
            const result = isJwtRevokedInResponse(null);
            expect(result).toBeFalsy();
        })
    });

    describe('when errors have different shape', () => {
        it('returns false', () => {
            const result = isJwtRevokedInResponse({ errors: [{ kode: 112 }]});
            expect(result).toBeFalsy();
        })
    });

    describe('when errors exist', () => {
        it('returns `true` when any error has code `112`', () => {
            const result = isJwtRevokedInResponse({ errors: [
                jwtExpiredError, 
                jwtRevokedError
              ]
            })
            expect(result).toBeTruthy();
        })

        it('returns `false` when no errors have code `112`', () => {
            const result = isJwtRevokedInResponse({ errors: [
                jwtExpiredError,
                jwtExpiredError
              ]
            })
            expect(result).toBeFalsy();
        })
    })
})
