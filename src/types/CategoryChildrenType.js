// @flow

import type { TranslationType } from './index';

export type CategoryChildrenType = {
  rawId: number,
  parentId?: ?number,
  level?: ?number,
  name: Array<TranslationType>,
  children: Array<CategoryChildrenType>,
};
