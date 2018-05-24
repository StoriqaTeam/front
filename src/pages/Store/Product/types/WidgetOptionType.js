// @flow

export type WidgetOptionType = {
  id: string,
  label: string,
  image: string,
  state: 'selected' | 'available' | 'disabled',
  variantIds: Array<string>,
};
