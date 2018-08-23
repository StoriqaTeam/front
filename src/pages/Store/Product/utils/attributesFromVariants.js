// @flow

import {
  reduce,
  map,
  ifElse,
  has,
  over,
  lensProp,
  concat,
  assoc,
  prop,
  flatten,
  uniq,
  pipe,
} from 'ramda';

import type { VariantType } from '../types';

const attributesFromVariants = (variants: VariantType) => {
  // $FlowIgnoreMe
  const attributes = flatten(map(prop('attributes'), variants));
  return reduce(
    (acc, attribute) =>
      ifElse(
        has(attribute.attribute.id),
        over(
          lensProp(attribute.attribute.id),
          pipe(concat([attribute.value]), uniq),
        ),
        assoc(attribute.attribute.id, [attribute.value]),
      )(acc),
    {},
    attributes,
  );
};

export default attributesFromVariants;
