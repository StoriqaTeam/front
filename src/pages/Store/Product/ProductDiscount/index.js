// @flow strict

import React from 'react';

import './ProductDiscount.scss';

import t from './i18n';

type PropType = {
  discount: number,
};

const ProductDiscount = ({ discount }: PropType) => (
  <span styleName="container">
    <span styleName="price">
      {t.price} <br /> {t.off} <br />
    </span>
    <span
      style={{
        fontSize: 16,
      }}
    >
      {`− ${Math.round(discount * 100)} %`}
    </span>
  </span>
);

export default ProductDiscount;
