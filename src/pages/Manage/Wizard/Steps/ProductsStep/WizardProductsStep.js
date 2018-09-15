// @flow strict

import React from 'react';

import type { BaseProductsNodeType } from './ProductsStep';

export default (props: { product: BaseProductsNodeType }) => (
  <div>{props.product.id}</div>
);
