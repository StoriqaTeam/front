// @flow

import { filter, any, propEq, prop, compose } from 'ramda';

import { VariantType, WidgetsType } from '../types';

import { buildWidgets } from './index';
/**
 * @desc Filters variants based on a value
 * @param {any} variants
 * @param {string} value
 * @return {[]}
 */
export default function filterVariants(
  variants: VariantType,
  value: string,
): WidgetsType {
  let filtered = [];
  if (value !== undefined) {
    const hasValue = any(propEq('value', value));
    filtered = filter(compose(hasValue, prop('attributes')))(variants);
  } else {
    filtered = variants;
  }
  return buildWidgets(filtered);
}
