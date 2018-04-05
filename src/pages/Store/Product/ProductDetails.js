// @flow

import React, { PureComponent } from 'react';

import { ProductPrice, ProductSize } from 'pages/Store/Product';

import './ProductDetails.scss';

type stateTypes = {
  sizes: string | number[]
}

class ProductDetails extends PureComponent<{}, stateTypes> {
  state = {
    sizes: [2, 34, 56, 12, 45],
  };
  render() {
    const { sizes } = this.state;
    return (
      <div styleName="container">
        <h2 styleName="title">Nike Air Jordan</h2>
        <ProductPrice />
        <p styleName="description">
          {/* eslint-disable max-len */}
          Наушники Bluetooth Beats Beats Solo3 Wireless On-Ear Violet (MNEQ2ZE/A) Объемное звучание на всех частотах, отлично подходит для прослушивания музыки, фильмов.
        </p>
        <ProductSize sizes={sizes} />
      </div>
    );
  }
}

export default ProductDetails;
