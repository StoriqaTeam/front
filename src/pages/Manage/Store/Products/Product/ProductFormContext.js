// @flow

import { createContext } from 'react';

const ProductFormContext = createContext({
  isLoading: false,
  handleSaveBaseProductWithVariant: () => {},
  onChangeVariantForm: () => {},
  variantFormErrors: {},
});

export default ProductFormContext;
