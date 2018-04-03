// @flow

import React, { PureComponent } from 'react';

import { Header } from 'components/App';

import './ProductCard.scss';

class ProductCard extends PureComponent<{}> {
  handleLightBox = {};
  render() {
    return (
      <div styleName="container">
        <Header />
      </div>
    );
  }
}

export default ProductCard;
