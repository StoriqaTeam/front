// @flow

import React, { PureComponent } from 'react';

import { Header, Footer, Main } from 'components/App';
import { ProductImage, ProductShare, ProductDetails } from 'pages/Store/Product';
import { Container, Col, Row } from 'layout';

import './Product.scss';

class Product extends PureComponent<{}> {
  handleLightBox = {};
  render() {
    return (
      <div styleName="container">
        <Header />
        <Main>
          <div styleName="ProductBackground">
            <Container>
              <Row>
                <Col size={6}>
                  <ProductImage />
                  <ProductShare />
                </Col>
                <Col size={6}>
                  <ProductDetails />
                </Col>
              </Row>
            </Container>
          </div>
        </Main>
        <Footer />
      </div>
    );
  }
}

export default Product;
