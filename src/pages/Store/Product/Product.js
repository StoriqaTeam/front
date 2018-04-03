// @flow

import React, { PureComponent } from 'react';

import { Header, Footer } from 'components/App';
import { Container } from 'layout';

import './Product.scss';

class Product extends PureComponent<{}> {
  handleLightBox = {};
  render() {
    return (
      <div styleName="container">
        <Header />
        <Container>
          <h1>Product</h1>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Product;
