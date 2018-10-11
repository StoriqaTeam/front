// @flow strict

/**
 * @param {[]} array
 * @return {boolean}
 */
export default function validArray<T>(array: Array<T>): boolean {
  return Array.isArray(array);
}
