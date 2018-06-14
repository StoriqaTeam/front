// @flow

import type { TranslationType } from './index';

export type ChildrenType = {
  rawId: number,
  parentId?: ?number,
  level?: ?number,
  name: Array<TranslationType>,
  children: Array<ChildrenType>,
};
