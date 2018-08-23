// @flow

import React from 'react';

import { Button } from 'components/common/Button';

import './ProductsHeader.scss';

type PropsType = {
  onAdd: () => any,
};

const ProductsHeader = ({ onAdd }: PropsType) => (
  <header styleName="container">
    <h3 styleName="subtitle">
      <strong>Goods list</strong>
    </h3>
    <div styleName="addItem">
      <Button wireframe big onClick={onAdd} dataTest="addProductButton">
        Add item
      </Button>
    </div>
  </header>
);

export default ProductsHeader;
