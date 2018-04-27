// @flow

import React, { Component, PureComponent } from 'react';
import { createFragmentContainer, createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, pathOr, path, map } from 'ramda';

import { currentUserShape } from 'utils/shapes';
import { Page } from 'components/App';

import CartStore from './CartStore';

import type Cart_me from './__generated__/Cart_me.graphql';

import './Cart.scss';

type PropsType = {
  me: Cart_me
};

class Cart extends PureComponent<PropsType> {
  render() {
    const stores = pipe(
      pathOr([], ['me', 'cart', 'stores', 'edges']),
      map(path(['node'])),
    )(this.props);
    return (
      <div styleName="container">
        <div styleName="header">Cart</div>
        {stores.map(store => <CartStore store={store} />)}
      </div>
    );
  }
}

Cart.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createPaginationContainer(
  Page(Cart),
  graphql`
    fragment Cart_me on User 
    @argumentDefinitions(
      first: { type: "Int", defaultValue: null }
      after: { type: "ID", defaultValue: null }
    ) {
      cart {
        stores(first: $first, after: $after) @connection(key: "Cart_stores") {
          edges {
            node {
              ...CartStore_store
            }
          }
        }
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: props => path(['me', 'cart'], props),
    getVariables: () => ({
      first: null,
      after: null,
    }),
    query: graphql`
      query Cart_cart_Query($first: Int, $after: ID) {
        me {
          ...Cart_me @arguments(first: $first, after: $after)
        }
      }
    `,
  },
);
