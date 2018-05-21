type WidgetOptionType = {
  id: string,
  label: string,
  img: string,
  state: 'selected' | 'available' | 'disabled',
  variantIds: Array<string>,
};

export default WidgetOptionType;
