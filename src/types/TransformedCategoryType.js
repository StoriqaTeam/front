// @flow

export type TransformedCategoryType = {
  rawId?: number,
  parentId?: ?number,
  level?: ?number,
  name: string,
  children: Array<TransformedCategoryType>,
};
