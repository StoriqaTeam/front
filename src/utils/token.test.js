import { isTokenExpired } from 'utils/token'

/* { user_id: 6, exp: 1527236289 } */
const token1 = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjo2LCJleHAiOjE1MjcyMzYyODl9.TQvuMKIdWtKuxyu7J0vnGXFsIGsc_9ljSd7Z2OPezya1HEZkDsg5J6FYquLXRuyqNhSqDWYsiZK2iUwjBEVxWS9inXfuu3mpqfSae_JngLPxxuExA89rzjSdd0cIiIXZZ5730aqqpvJjVlgCaU-3sHAVvkw8C5ztZjnvwwSJMC5B69DzUBSF8SJJcrPZC8dx_NA6Y1obyCtGj4o3PEqxntA8yb3rcPpOe_s8mOXhBN6qAcLjQeFBqJcpJHq55Fc47PJ_fuT1r_VGbblsDUHCv_Hd1b3mbKe_BDXVNshhL5EgFHtoM-zwc0LptSz0MZIxKdWGRDvoOtgqrJh3yjY0HA";

const token2 = 'asdfasdfasdfas';

const currentTimestamp = parseInt(Date.now() / 1000, 10);
const tokenCreationTimestamp = 1527236289;
const actualLivetime = currentTimestamp - tokenCreationTimestamp + 2000;
const expiredLivetime = currentTimestamp - tokenCreationTimestamp - 2000;

describe('Check if token is expired', () => {
  it ('should return `true` when token is null', () => {
    const isExpired = isTokenExpired(null);
    expect(isExpired).toBeTruthy();
  });
  it ('should return `true` when token is incorrect', () => {
    const isExpired = isTokenExpired(token2);
    expect(isExpired).toBeTruthy();
  });
  it('should return `false` when token is actual', () => {
    const isExpired = isTokenExpired(token1, actualLivetime);
    expect(isExpired).toBeFalsy();
  });
  it('should return `true` when token is expired', () => {
    const isExpired = isTokenExpired(token1, expiredLivetime);
    expect(isExpired).toBeTruthy();
  })

})