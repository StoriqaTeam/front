// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import { Header, Footer, Main } from 'components/App';
import { Container, Col, Row } from 'layout';
import {
  ProductContext,
  ProductImage,
  ProductShare,
  ProductDetails,
  Tab,
  Tabs,
  TabRow,
} from './index';

import './Product.scss';
import mockData from './mockData.json';

type PropsType = {
  me?: {}
};

type StateType = {
  tabs: {id: string | number, label: string, content: any}[]
}

class Product extends PureComponent<PropsType, StateType> {
  state = {
    tabs: [
      {
        id: 0,
        label: 'Описание',
        content: (<TabRow row={mockData.row} />),
      },
    ],
  };
  render() {
    const { me } = this.props;
    const { tabs } = this.state;
    return (
      <div styleName="container">
        <Header />
        <Main>
          <div styleName="ProductBackground">
            <Container>
              <div styleName="whiteBackground">
                <ProductContext.Provider value={me}>
                  <Row>
                    <Col size={6}>
                      <ProductImage />
                      <ProductShare />
                    </Col>
                    <Col size={6}>
                      <ProductDetails />
                    </Col>
                  </Row>
                </ProductContext.Provider>
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

export default createFragmentContainer(
  Product,
  graphql`
    fragment Product_me on User
    @argumentDefinitions(productId: { type: "Int!" }) {
      baseProduct(id: $productID) {
        name {
          text
          lang
        }
        longDescription {
          text
          lang
        }
      }
    }
  `,
);
