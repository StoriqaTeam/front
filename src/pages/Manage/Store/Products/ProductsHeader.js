// @flow

import React from 'react';

import { Button } from 'components/common/Button';

import './ProductsHeader.scss';

type PropsType = {
  onAdd: () => any,
}

const ProductsHeader = ({ onAdd }: PropsType) => (
  <header styleName="container">
    <h3 styleName="subtitle">
      <strong>Goods list</strong>
    </h3>
    <Button
      wireframe
      big
      onClick={onAdd}
      dataTest="addProductButton"
    >
      Add item
    </Button>
  </header>
);

export default ProductsHeader;
