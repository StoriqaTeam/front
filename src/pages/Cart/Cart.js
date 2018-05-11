// @flow

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, pathOr, path, map, __, prop, pick, reduce } from 'ramda';

import { Page } from 'components/App';

import CartStore from './CartStore';
import CartTotal from './CartTotal';

// eslint-disable-next-line
import type Cart_me from './__generated__/Cart_me.graphql';

import './Cart.scss';

type PropsType = {
  // eslint-disable-next-line
  me: Cart_me
};

type StateType = {
  storesRef: ?Object,
}

/* eslint-disable react/no-array-index-key */
class Cart extends Component<PropsType, StateType> {
  state = {
    storesRef: null,
  }

  getTotal(): { productsCost: number, deliveryCost: number } {
    const store = pipe(
      path(['context', 'environment']),
      env => env.getStore().getSource().toJSON(),
    )(this);
    return pipe(
      path(['context', 'environment']),
      env => env.getStore().getSource().toJSON(),
      path(['client:root', 'me', '__ref']),
      prop(__, store),
      path(['cart', '__ref']),
      prop(__, store),
      path(['stores', '__ref']),
      prop(__, store),
      path(['edges', '__refs']),
      map(prop(__, store)),
      map(path(['node', '__ref'])),
      map(prop(__, store)),
      map(pick(['productsCost', 'deliveryCost'])),
      reduce((acc, elem) => ({
        productsCost: acc.productsCost + elem.productsCost,
        deliveryCost: acc.deliveryCost + elem.deliveryCost,
        totalCount: acc.totalCount + elem.totalCount,
      }), { productsCost: 0, deliveryCost: 0, totalCount: 0 }),
    )(this);
  }

  setStoresRef(ref) {
    if (ref && !this.state.storesRef) {
      this.setState({ storesRef: ref });
    }
  }

  storesRef: any;

  render() {
    const stores = pipe(
      pathOr([], ['me', 'cart', 'stores', 'edges']),
      map(path(['node'])),
    )(this.props);
    const { productsCost, deliveryCost, totalCount } = this.getTotal();
    return (
      <div styleName="container">
        <div styleName="header">Cart</div>
        <div styleName="body-container">
          <div styleName="stores-container" ref={ref => this.setStoresRef(ref)}>
            {stores.map((store, idx) => <CartStore key={idx} store={store} />)}
          </div>
          <div styleName="total-container">
            <CartTotal
              storesRef={this.state.storesRef}
              productsCost={productsCost}
              deliveryCost={deliveryCost}
              totalCount={totalCount}
            />
          </div>
        </div>
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
