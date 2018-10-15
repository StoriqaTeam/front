// @flow strict

import { map, isEmpty, isNil } from 'ramda';

import { extractText } from 'utils';

import type {
  CategoryChildrenType,
  CategoryType,
  TransformedCategoryType,
} from 'types';

function build({
  name,
  rawId,
  children,
}: CategoryChildrenType): TransformedCategoryType {
  return {
    name: extractText(name),
    rawId,
    children:
      !isEmpty(children) && !isNil(children) ? map(build, children) : [],
  };
}

const buildMobileCategories = (
  categories: CategoryType,
): Array<TransformedCategoryType> =>
  map(build, categories ? categories.children : []);

export default buildMobileCategories;
