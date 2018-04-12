// @flow

type IdType = {
  id?: string,
  rawId?: number,
}

type TranslationType = {
  lang: string,
  text: string,
}

type UIType = 'COMBOBOX' | 'RADIOBUTTON' | 'CHECKBOX' | 'COLOR_PICKER'

type TranslatedValueType = {
  translations: TranslationType[],
}

type AttributeMetaFieldType = {
  values?: string[],
  translatedValues?: TranslatedValueType[],
  uiElement: UIType,
}

type ProductType = {
  ...IdType,
  isActive?: boolean,
  discount?: number,
  photoMain?: string,
  additionalPhotos?: string[],
  vendorCode?: string,
  cashBack?: number,
  price?: number,
}

type Attribute = {
  ...IdType,
  name: TranslationType[],
  valueType?: string | number,
  metaField: AttributeMetaFieldType,
}

type AttributeValueType = {
  attribute: Attribute,
  value?: string,
  metaField?: string,
}

type VariantType = {
  rawId: number,
  product: ProductType,
  attributes: AttributeValueType[]
}

/**
 * @param {VariantType[]} variants
 */
export default function buildWidgets(variants: VariantType[]) {
  return variants;
}
