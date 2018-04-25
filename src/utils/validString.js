// @flow

/**
 * @param {string} string
 * @return {boolean}
 */
export default function validString(string: string): boolean {
  return typeof string === 'string' && string !== '' && string !== null && string !== undefined;
}
