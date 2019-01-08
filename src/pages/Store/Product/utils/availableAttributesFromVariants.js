// @flow

import { prop, keys, length, head } from 'ramda';

import { attributesFromVariants, filterVariantsByAttributes } from './';

import type { VariantType } from '../types';

type SelectedAttributesType = {
  [string]: string,
};

const availableAttributesFromVariants = (
  selectedAttributes: SelectedAttributesType,
  variants: Array<VariantType>,
) => {
  const allVariants = attributesFromVariants(variants);

  if (length(keys(selectedAttributes)) === 1) {
    const matchedVariants = filterVariantsByAttributes(
      selectedAttributes,
      variants,
    );
    const selectedAttributeId = head(keys(selectedAttributes));
    if (selectedAttributeId) {
      return {
        ...attributesFromVariants(matchedVariants),
        [selectedAttributeId]: prop(`${selectedAttributeId}`, allVariants),
      };
    }
  }

  if (length(keys(selectedAttributes)) > 1) {
    const matchedVariants = filterVariantsByAttributes(
      selectedAttributes,
      variants,
    );
    return attributesFromVariants(matchedVariants);
  }

  return allVariants;
};

export default availableAttributesFromVariants;
