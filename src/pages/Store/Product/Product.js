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
              <div styleName="whiteBackground">
                <Row>
                  <Col size={6}>
                    <ProductImage />
                    <ProductShare />
                  </Col>
                  <Col size={6}>
                    <ProductDetails />
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
        </Main>
        <Footer />
      </div>
    );
  }
}

export default Product;
