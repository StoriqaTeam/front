// @flow

import React, { PureComponent } from 'react';

import { Header, Footer } from 'components/App';
import { ProductImage } from 'pages/Store/Product';
import { Container, Col, Row } from 'layout';

import './Product.scss';

class Product extends PureComponent<{}> {
  handleLightBox = {};
  render() {
    return (
      <div styleName="container">
        <Header />
        <Container>
          <Row>
            <Col size={6}>
              <ProductImage />
            </Col>
            <Col size={6}>
              <h1>Product description</h1>
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }
}

export default Product;
