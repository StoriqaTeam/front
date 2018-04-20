// @flow

import { filter, any, propEq, prop, compose } from 'ramda';

import { buildWidgets } from './index';
/* eslint-disable */
/**
 * @desc Filters variants based on a value
 * @param {any} variants
 * @param {string} value
 * @return {[]}
 */
export default function filterVariants(variants, value): [] {
  let filtered = [];
  if (value !== undefined) {
    const hasValue = any(propEq('value', value));
    filtered = filter(compose(hasValue, prop('attributes')))(variants);
  } else {
    filtered = variants;
  }
  /* eslint-disable no-console */
  console.log('filtered', filtered);
  // console.log('buildWidgets(filtered)', buildWidgets(filtered));
  return buildWidgets(filtered);
}
