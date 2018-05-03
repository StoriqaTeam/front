// @flow

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, pathOr, path, map } from 'ramda';

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
  storesTop: ?number,
  storesBottom: ?number,
}

/* eslint-disable react/no-array-index-key */
class Cart extends Component<PropsType, StateType> {
  state = {
    storesTop: null,
    storesBottom: null,
  }

  setStoresRef(ref) {
    this.storesRef = ref;
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    if ((this.state.storesTop !== rect.top) || (this.state.storesBottom !== rect.bottom)) {
      this.setState({ storesTop: rect.top, storesBottom: rect.bottom });
    }
  }

  storesRef: any;

  render() {
    const stores = pipe(
      pathOr([], ['me', 'cart', 'stores', 'edges']),
      map(path(['node'])),
    )(this.props);
    return (
      <div styleName="container">
        <div styleName="header">Cart</div>
        <div styleName="body-container">
          <div styleName="stores-container" ref={ref => this.setStoresRef(ref)}>
            {stores.map((store, idx) => <CartStore key={idx} store={store} />)}
          </div>
          <div styleName="total-container">
            <CartTotal
              threshold={168}
              top={this.state.storesTop}
              bottom={this.state.storesBottom}
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
