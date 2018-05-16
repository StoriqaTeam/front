// @flow

import {
  all,
  // $FlowIgnoreMe
  chain,
  filter,
  groupBy,
  has,
  isEmpty,
  isNil,
  keys,
  map,
  uniqBy,
  not,
  pathEq,
  pipe,
  prop,
  reduce,
} from 'ramda';

import { extractText } from 'utils';

import { VariantType, WidgetType, GroupedWidgetsType } from '../types';

import { removeWidgetOptionsDuplicates } from './index';

type TransformedVariantType = {
  id: string,
  image: string,
  title: string,
  uiElement: string,
  value: string,
  variantId: string,
};

type SelectionType = { id: string, value: string };

const setImage = (image: string): string => {
  const defaultImage =
    'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png';
  return !isNil(image) && image.includes('http') ? image : defaultImage;
};

/* function matchSelection(selection: SelectionType, variant: VariantType): boolean {
  const { attributes } = variant;
  const filtered = attributes.filter(attr => (attr.attribute.id === selection.id) && (attr.value === selection.value));
  return filtered.length > 0;
} */

export const matchSelection: SelectionType => VariantType => boolean = selection => variant =>
  pipe(
    prop('attributes'),
    filter(pathEq(['attribute', 'id'], selection.id)),
    filter(pathEq(['value'], selection.value)),
    isEmpty,
    not,
  )(variant);

export const isVariantSelected: (
  Array<SelectionType>,
) => VariantType => boolean = selections => variant =>
  all(selection => matchSelection(selection)(variant), selections);

export const filterVariantsBySelection: (
  Array<SelectionType>,
) => (Array<VariantType>) => Array<VariantType> = selections => variants =>
  // filter(variant => isVariantSelected(selections)(variant), variants)
  filter(isVariantSelected(selections), variants);

export const pluckVariantAttributes = ({
  id: variantId,
  attributes,
}: VariantType): Array<TransformedVariantType> =>
  attributes.map(
    ({
      value,
      metaField,
      attribute: {
        id,
        name,
        metaField: { uiElement },
      },
    }) => ({
      id,
      title: extractText(name),
      uiElement,
      options: [
        {
          id,
          image: setImage(metaField),
          label: value,
          state: 'available',
          variantIds: [variantId],
        },
      ],
    }),
  );

export const transformProductVariants: (
  Array<VariantType>,
) => Array<TransformedVariantType> = chain(pluckVariantAttributes);

export const groupWidgets: (
  Array<TransformedVariantType>,
) => GroupedWidgetsType = groupBy(prop('id'));

const makeWidget = (groupedWidgets: GroupedWidgetsType): Array<WidgetType> => {
  /**
   * @desc Reduce all the options of the previous item with the next one
   * into a single array of WidgetOptions
   */
  const reduceWidgetsOptions: (WidgetType, WidgetType) => WidgetType = (
    accumulator,
    item,
  ) => {
    if (has('options')(accumulator)) {
      return {
        ...item,
        options: [...accumulator.options, ...item.options],
      };
    }
    return item;
  };
  const mergeWidgetOptions = (key: string): WidgetType =>
    reduce(reduceWidgetsOptions, {}, groupedWidgets[key]);
  return map(mergeWidgetOptions, keys(groupedWidgets));
};

export const makeWidgetsFromVariants: (
  Array<VariantType>,
) => Array<WidgetType> = variants =>
  pipe(
    transformProductVariants,
    groupWidgets,
    makeWidget,
    removeWidgetOptionsDuplicates,
  )(variants);

export const makeWidgets: (
  Array<SelectionType>,
) => (Array<VariantType>) => Array<WidgetType> = selections => variants => {
  const filteredVariants = filterVariantsBySelection(selections)(variants);
  return makeWidgetsFromVariants(filteredVariants);
};

export default makeWidgets;
