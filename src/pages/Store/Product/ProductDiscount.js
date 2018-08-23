// @flow

import React from 'react';

import './ProductDiscount.scss';

type PropType = {
  discount: number,
};

const ProductDiscount = ({ discount }: PropType) => (
  <span styleName="container">
    <span styleName="price">
      Price <br /> Off <br />
    </span>
    <span
      style={{
        fontSize: 16,
      }}
    >
      {`- ${Math.round(discount * 100)} %`}
    </span>
  </span>
);

export default ProductDiscount;
