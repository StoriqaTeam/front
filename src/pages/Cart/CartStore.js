// @flow

import React, { Component, PureComponent } from 'react';
import { createFragmentContainer, createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, path, pathOr, map } from 'ramda';

import { Page } from 'components/App';

import CartProduct from './CartProduct';

import './CartStore.scss';

type PropsType = {};

class CartStore extends PureComponent<PropsType> {
  render() {
    const { store } = this.props;
    console.log("Store:", store);
    const products = pipe(
      pathOr([], ['baseProducts', 'edges']),
      map(path(['node'])),
    )(store);
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
    fragment CartStore_store on Store {
      baseProducts {
        edges {
          node {
            ...CartProduct_product
          }
        }
      }
    }
  `,
);
