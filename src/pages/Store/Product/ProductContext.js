import { createContext } from 'react';

/**
 * The "defaultValue" argument is used when you render
 * a Consumer without a matching Provider above it in the tree.
 * This can be helpful for testing components in isolation without wrapping them.
 */
const ProductContext = createContext({});

export default ProductContext;
