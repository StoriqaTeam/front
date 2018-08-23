// @flow

import { isEmpty, filter, whereEq, assoc, reduce } from 'ramda';

import type { VariantType } from '../types';

type SelectedAttributesType = {
  [string]: string,
};

const filterVariantsByAttributes = (
  selectedAttributes: SelectedAttributesType,
  variants: Array<VariantType>,
) => {
  if (isEmpty(selectedAttributes)) {
    return variants;
  }

  return filter((variant: VariantType) => {
    const attributes = reduce(
      // $FlowIgnoreMe
      (acc, attribute) => assoc(attribute.attribute.id, attribute.value, acc),
      {},
      variant.attributes,
    );
    return whereEq(selectedAttributes, attributes);
  }, variants);
};

export default filterVariantsByAttributes;
