// @flow

import React, { PureComponent } from 'react';

import { ProductPrice } from 'pages/Store/Product';

import './ProductDetails.scss';

type stateTypes = {
  thumbnails: {img: string, alt: string}[],
}

class ProductDetails extends PureComponent<{}, stateTypes> {
  render() {
    return (
      <div styleName="container">
        <h2 styleName="title">Nike Air Jordan</h2>
        <ProductPrice />
        <p styleName="description">
          {/* eslint-disable max-len */}
          Наушники Bluetooth Beats Beats Solo3 Wireless On-Ear Violet (MNEQ2ZE/A) Объемное звучание на всех частотах, отлично подходит для прослушивания музыки, фильмов.
        </p>
      </div>
    );
  }
}

export default ProductDetails;
