// @flow

import React from 'react';

import './ProductSize.scss';

type propTypes = {
  sizes: string | number[],
}

const ProductSize = (props: propTypes) => (
  <div styleName="container">
    <h4 styleName="title">
      Размер
    </h4>
    <div styleName="sizes">
      {props.sizes.map((size, index) => (
        /* eslint-disable react/no-array-index-key */
        <div
          key={index}
          styleName="size"
        >
          { size }
        </div>
      ))}
    </div>
  </div>
);

export default ProductSize;
