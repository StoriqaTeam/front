// @flow

import type { TranslationType, CategoryChildrenType } from './index';

export type CategoryType = {
  name: Array<TranslationType>,
  children: Array<CategoryChildrenType>,
};
