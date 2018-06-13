// @flow

import { map, isEmpty, isNil } from 'ramda';

import { extractText } from 'utils';

import type {
  ChildrenType,
  CategoryType,
  TransformedCategoryType,
} from '../types';

function build({
  name,
  rawId,
  children,
}: ChildrenType): TransformedCategoryType {
  return {
    name: extractText(name),
    rawId,
    children:
      !isEmpty(children) && !isNil(children) ? map(build, children) : [],
  };
}

const buildMobileCategories = (
  categories: CategoryType,
): Array<TransformedCategoryType> => map(build, categories.children);

export default buildMobileCategories;
