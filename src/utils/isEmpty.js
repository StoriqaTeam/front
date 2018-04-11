// @flow

import { isEmpty } from 'ramda';

/**
 * @param {string} obj
 * @return {boolean}
 */
export default (obj: {}): boolean => isEmpty(obj);
