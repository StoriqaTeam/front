// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { filter, whereEq } from 'ramda';

import { Rating } from 'components/common/Rating';
import { Row, Col } from 'layout';
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
    console.log('>>> CartStore products: ', { props: this.props, products });
    if (onlySelected) {
      filteredProducts = filter(whereEq({ selected: true }), products);
    }
    if (filteredProducts.length === 0) {
      return null;
    }
    return (
      <Row>
        <Col size={12}>
          <div styleName="container">
            <div styleName="products">
              {filteredProducts.map((product, idx) => (
                <CartProduct
                  key={idx}
                  product={product}
                  onlySelected={onlySelected}
                  unselectable={unselectable}
                />
              ))}
            </div>
            <div styleName="footer">
              <div styleName="store">
                <div styleName="store-info">
                  <img src={store.logo} alt="store_picture" styleName="image" />
                  <div styleName="store-description">
                    <div styleName="store-name">
                      {getNameText(store.name, 'EN')}
                    </div>
                    <Rating value={store.rating} />
                  </div>
                </div>
              </div>
              <div styleName="store-total">
                <div styleName="label">Subtotal</div>
                <div styleName="value">
                  {formatPrice(store.productsCost || 0)} STQ
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
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
