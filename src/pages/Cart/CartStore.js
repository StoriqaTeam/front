// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import Rating from 'components/Rating';

import CartProduct from './CartProduct';
import CartProductAttribute from './CartProductAttribute';
// eslint-disable-next-line
import type CartStore_store from './__generated__/CartStore_store.graphql';

import './CartStore.scss';

type PropsType = {
  // eslint-disable-next-line
  store: CartStore_store,
};

/* eslint-disable react/no-array-index-key */
class CartStore extends PureComponent<PropsType> {
  render() {
    const { store } = this.props;
    const { products } = store;
    return (
      <div styleName="container">
        <div styleName="products">
          {products.map((product, idx) => <CartProduct key={idx} product={product} />)}
        </div>
        <div styleName="footer">
          <div styleName="store-info">
            <img src={store.logo} alt="store_picture" styleName="image" />
            <div styleName="store-description">
              <div>
                {store.name[0].text}
              </div>
              <Rating rating={store.rating} />
            </div>
          </div>
          <div styleName="store-total">
            <div className="store-total-header">
              Summary
            </div>
            <CartProductAttribute title="Products cost" value={`${store.productsCost} STQ`} />
            <CartProductAttribute title="Delivery cost" value={`${store.deliveryCost} STQ`} />
            <CartProductAttribute title="Total cost" value={`${store.deliveryCost + store.productsCost} STQ`} />
          </div>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  CartStore,
  graphql`
    fragment CartStore_store on CartStore {
      products {
        ...CartProduct_product
      }
      name {
        lang
        text
      }
      rating
      logo
      productsCost
      deliveryCost
      totalCount
    }
  `,
);
