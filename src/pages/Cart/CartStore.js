// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import CartProduct from './CartProduct';
// eslint-disable-next-line
import type CartStore_store from './__generated__/CartStore_store.graphql';

import './CartStore.scss';

type PropsType = {
  // eslint-disable-next-line
  store: CartStore_store,
};

class CartStore extends PureComponent<PropsType> {
  render() {
    const { products } = this.props.store;
    return (
      <div styleName="container">
        {products.map(product => <CartProduct product={product} />)}
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
    }
  `,
);
