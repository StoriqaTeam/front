// @flow strict

import React from 'react';

import { Button } from 'components/common/Button';

import './ProductsHeader.scss';

import t from './i18n';

type PropsType = {
  onAdd: () => void,
};

const ProductsHeader = ({ onAdd }: PropsType) => (
  <header styleName="container">
    <h3 styleName="subtitle">
      <strong>{t.goodsList}</strong>
    </h3>
    <div styleName="addItem">
      <Button wireframe big onClick={onAdd} dataTest="addProductButton">
        {t.addItem}
      </Button>
    </div>
  </header>
);

export default ProductsHeader;
