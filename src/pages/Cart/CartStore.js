// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { filter, whereEq } from 'ramda';

import { Rating } from 'components/common/Rating';
import { Icon } from 'components/Icon';
import { Container, Row, Col } from 'layout';
import { formatPrice, getNameText, currentCurrency, convertSrc } from 'utils';

import CartProduct from './CartProduct';

// eslint-disable-next-line
import type CartStore_store from './__generated__/CartStore_store.graphql';

import './CartStore.scss';

type PropsType = {
  onlySelected: ?boolean,
  unselectable: ?boolean,
  // eslint-disable-next-line
  store: CartStore_store,
  isOpenInfo: ?boolean,
};

/* eslint-disable react/no-array-index-key */
class CartStore extends PureComponent<PropsType> {
  render() {
    const { store, onlySelected, unselectable, isOpenInfo } = this.props;
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
                <div key={idx}>
                  <CartProduct
                    product={product}
                    onlySelected={onlySelected}
                    unselectable={unselectable}
                    isOpenInfo={isOpenInfo}
                  />
                  <div styleName="devider" />
                </div>
              ))}
              <div styleName="footer">
                <div>
                  <Container correct>
                    <Row>
                      <div styleName="store-info">
                        {store.logo ? (
                          <img
                            src={convertSrc(store.logo, 'small')}
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
                      <div styleName="storeTotalWrapper">
                        <div>
                          <div styleName="label">Subtotal</div>
                          <div styleName="value">
                            {formatPrice(store.productsCost || 0)}{' '}
                            {currentCurrency()}
                          </div>
                        </div>
                      </div>
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
