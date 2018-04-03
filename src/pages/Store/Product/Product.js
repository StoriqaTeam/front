// @flow

import React, { PureComponent } from 'react';

import { Header } from 'components/App';

import './Product.scss';

class Product extends PureComponent<{}> {
  handleLightBox = {};
  render() {
    return (
      <div styleName="container">
        <Header />
      </div>
    );
  }
}

export default Product;
