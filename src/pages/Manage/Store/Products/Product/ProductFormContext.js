import { createContext } from 'react';

const ProductFormContext = createContext({
  isLoading: false,
  handleSaveBaseProductWithVariant: () => {},
  comeResponse: true,
  resetComeResponse: () => {},
});

export default ProductFormContext;
