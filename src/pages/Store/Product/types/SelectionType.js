// @flow

export type SelectionType = {
  id: string,
  state: 'selected' | 'available' | 'disabled',
  variantIds: Array<string>,
  value: 'string',
};
