// @flow

import { toPairs, forEach, append, isEmpty, difference, filter } from 'ramda';

import { attributesFromVariants, filterVariantsByAttributes } from './';

import type { VariantType } from '../types';

type SelectedAttributesType = {
  [string]: string,
};

const availableAttributesFromVariants = (
  selectedAttributes: SelectedAttributesType,
  variants: Array<VariantType>,
) => {
  let set = [];
  let allVariants = attributesFromVariants(variants);
  const pairsSelectedAttributes = toPairs(selectedAttributes);
  const pairsAllVariants = toPairs(allVariants);

  forEach(item => {
    const itemKey = item[0];
    const itemValues = item[1];
    const selected = selectedAttributes[itemKey];

    forEach(value => {
      if (value !== selected) {
        set = append({ ...selectedAttributes, [itemKey]: value }, set);
      }
    }, itemValues);
  }, pairsAllVariants);

  forEach(item => {
    const matchedVariants = filterVariantsByAttributes(item, variants);

    if (isEmpty(matchedVariants)) {
      const pairsAttributes = toPairs(item);
      const differenceAttributes = difference(
        pairsAttributes,
        pairsSelectedAttributes,
      );
      const differenceAttributesHead = differenceAttributes[0];
      const key = differenceAttributesHead[0];
      const value = differenceAttributesHead[1];
      allVariants = {
        ...allVariants,
        [key]: filter(attrValue => attrValue !== value, allVariants[key]),
      };
    }
  }, set);

  return allVariants;
};

export default availableAttributesFromVariants;
