// @flow

import React, { PureComponent } from 'react';

import { Header, Footer, Main } from 'components/App';
import { Container, Col, Row } from 'layout';
import {
  ProductImage,
  ProductShare,
  ProductDetails,
  Tab,
  Tabs,
  TabRow,
} from 'pages/Store/Product';

import './Product.scss';
import mockData from './mockData.json';

type stateTypes = {
  tabs: {id: string | number, label: string, content: any}[]
}

class Product extends PureComponent<{}, stateTypes> {
  state = {
    tabs: [
      {
        id: 0,
        label: 'Описание',
        content: (<TabRow row={mockData.row} />),
      },
    ],
  };
  handleLightBox = {};
  render() {
    const { tabs } = this.state;
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
          <Container>
            <Tabs>
              {tabs.map(({ id, label, content }) => (
                <Tab
                  key={id}
                  label={label}
                >
                  { content }
                </Tab>
              ))}
            </Tabs>
          </Container>
        </Main>
        <Footer />
      </div>
    );
  }
}

export default Product;
