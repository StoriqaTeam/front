import { createContext } from 'react';

const ProductFormContext = createContext({
  isLoading: false,
  handleSaveBaseProductWithVariant: () => {},
  comeResponse: true,
  resetComeResponse: () => {},
  onChangeVariantForm: () => {},
  variantFormErrors: null,
});

export default ProductFormContext;
