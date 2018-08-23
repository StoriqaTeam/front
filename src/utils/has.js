// @flow

import { has } from 'ramda';

/**
 * @link https://github.com/airbnb/javascript#objects--prototype-builtins
 * @param {{}} obj
 * @param {string} prop
 * @return {boolean}
 */
export default (obj: {}, prop: string): boolean => has(prop)(obj);
