// @flow

import React, { PureComponent } from 'react';

import CartProduct from './CartProduct';
// eslint-disable-next-line
import type CartStore_store from './__generated__/CartStore_store.graphql';

import './CartStore.scss';

type PropsType = {
};

class CartTotal extends PureComponent<PropsType> {
  render() {
    const { products } = this.props.store;
    return (
      <div styleName="container">
        {products.map(product => <CartProduct product={product} />)}
      </div>
    );
  }
}

