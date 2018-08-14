// @flow

import {
  has,
  map,
  pipe,
  prop,
  reduce,
  flatten,
  uniqBy,
  ifElse,
  assoc,
  over,
  lensPath,
  concat,
  values,
  sortBy,
  find,
  propEq,
} from 'ramda';

import type { VariantType, VarianAttributeType, WidgetType } from '../types';

export const makeWidgetsFromVariants = (
  variants: Array<VariantType>,
): Array<WidgetType> => {
  // $FlowIgnoreMe
  const allAttrs: Array<VarianAttributeType> = flatten(
    map(prop('attributes'), variants),
  );
  return values(
    reduce(
      (acc, item) =>
        ifElse(
          has(item.attribute.id),
          over(
            lensPath([item.attribute.id, 'options']),
            pipe(
              concat([
                {
                  label: item.value,
                  image: item.metaField,
                },
              ]),
              uniqBy(prop('label')),
              sortBy(prop('label')),
            ),
          ),
          assoc(item.attribute.id, {
            id: item.attribute.id,
            title: prop(
              'text',
              find(propEq('lang', 'EN'), item.attribute.name) || { text: '' },
            ),
            uiElement: item.attribute.metaField.uiElement,
            options: [
              {
                label: item.value,
                image: item.metaField,
              },
            ],
          }),
        )(acc),
      {},
      allAttrs,
    ),
  );
};

export default makeWidgetsFromVariants;
