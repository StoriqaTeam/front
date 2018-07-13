// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { filter, whereEq } from 'ramda';

import { Rating } from 'components/common/Rating';
import { Icon } from 'components/Icon';
import { Container, Row, Col } from 'layout';
import { formatPrice, getNameText } from 'utils';

import CartProduct from './CartProduct';

// eslint-disable-next-line
import type CartStore_store from './__generated__/CartStore_store.graphql';

import './CartStore.scss';

type PropsType = {
  onlySelected: ?boolean,
  unselectable: ?boolean,
  // eslint-disable-next-line
  store: CartStore_store,
};

/* eslint-disable react/no-array-index-key */
class CartStore extends PureComponent<PropsType> {
  render() {
    const { store, onlySelected, unselectable } = this.props;
    const { products } = store;
    let filteredProducts = products;
    if (onlySelected) {
      filteredProducts = filter(whereEq({ selected: true }), products);
    }
    if (filteredProducts.length === 0) {
      return null;
    }
    return (
      <div styleName="container">
        <Container correct>
          <Row>
            <Col size={12}>
              {filteredProducts.map((product, idx) => (
                <div>
                  <CartProduct
                    key={idx}
                    product={product}
                    onlySelected={onlySelected}
                    unselectable={unselectable}
                  />
                  <div styleName="devider" />
                </div>
              ))}
              <div styleName="footer">
                <div styleName="store">
                  <Container correct>
                    <Row>
                      <Col size={6}>
                        <div styleName="store-info">
                          {store.logo ? (
                            <img
                              src={store.logo}
                              alt="store_picture"
                              styleName="image"
                            />
                          ) : (
                            <div styleName="noLogo">
                              <Icon type="camera" size={28} />
                            </div>
                          )}
                          <div styleName="store-description">
                            <div styleName="store-name">
                              {getNameText(store.name, 'EN')}
                            </div>
                            <Rating value={store.rating} />
                          </div>
                        </div>
                      </Col>
                      <Col size={6}>
                        <div styleName="storeTotalWrapper">
                          <div styleName="store-total">
                            <div styleName="label">Subtotal</div>
                            <div styleName="value">
                              {formatPrice(store.productsCost || 0)} STQ
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default createFragmentContainer(
  CartStore,
  graphql`
    fragment CartStore_store on CartStore {
      id
      productsCost
      deliveryCost
      totalCost
      totalCount
      products {
        selected
        ...CartProduct_product
      }
      name {
        lang
        text
      }
      rating
      logo
    }
  `,
);
