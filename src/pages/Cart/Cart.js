// @flow
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import {
  pipe,
  pathOr,
  path,
  map,
  prop,
  propEq,
  groupBy,
  filter,
  reject,
  isNil,
  reduce,
  head,
  defaultTo,
} from 'ramda';

import { Page } from 'components/App';

import CartStore from './CartStore';
import CartTotal from './CartTotal';

// eslint-disable-next-line
import type Cart_me from './__generated__/Cart_me.graphql';
import type CartStoresLocalFragment from './__generated__/CartStoresLocalFragment.graphql';

import './Cart.scss';

const STORES_FRAGMENT = graphql`
  fragment CartStoresLocalFragment on CartStoresConnection {
    edges {
      node {
        id
        products {
          id
          selected
          quantity
          price
          deliveryCost
        }
      }
    }
  }
`;

type PropsType = {
  // eslint-disable-next-line
  me: Cart_me,
};

type Totals = {
  [storeId: string]: {
    productsCost: number,
    deliveryCost: number,
    totalCount: number,
  },
};

type StateType = {
  storesRef: ?Object,
  totals: Totals,
};

const getTotals: (data: CartStoresLocalFragment) => Totals = data => {
  const defaultTotals = { productsCost: 0, deliveryCost: 0, totalCount: 0 };
  const fold = pipe(
    filter(propEq('selected', true)),
    reduce(
      (acc, elem) => ({
        productsCost: acc.productsCost + elem.quantity * elem.price,
        deliveryCost: acc.deliveryCost + elem.deliveryCost,
        totalCount: acc.totalCount + elem.quantity,
      }),
      defaultTotals,
    ),
  );
  return pipe(
    pathOr([], ['edges']),
    map(prop('node')),
    reject(isNil),
    map(store => ({ id: store.id, ...fold(store.products) })),
    groupBy(prop('id')),
    map(pipe(head, defaultTo(defaultTotals))),
  )(data);
};

/* eslint-disable react/no-array-index-key */
class Cart extends Component<PropsType, StateType> {
  state = {
    storesRef: null,
    totals: {},
  };

  componentWillMount() {
    const store = this.context.environment.getStore();
    const source = store.getSource().toJSON();
    const meId = path(['client:root', 'me', '__ref'])(source);
    // Technically we could make a full query here, but it will query
    // client:${meId}:cart:stores. And all updated work on
    // client:${meId}:cart:__Cart_stores_connection.
    // @connection directive work on makin a query, but unfortunately
    // store.lookup doesn't work with this directive. Hence this hacky
    // version.
    const connectionId = `client:${meId}:cart:__Cart_stores_connection`;
    const queryNode = STORES_FRAGMENT.data();
    const snapshot = store.lookup({
      dataID: connectionId, // root
      node: queryNode, // query starting from root
    });
    // This will be triggered each time any field in our query changes
    // Therefore it's important to include not only the data you need into the query,
    // but also the data you need to watch for.
    const { dispose } = store.subscribe(snapshot, s => {
      this.setState({ totals: getTotals(s.data) });
    });
    this.dispose = dispose;
    this.setState({ totals: getTotals(snapshot.data) });
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
    }
  }

  setStoresRef(ref) {
    if (ref && !this.state.storesRef) {
      this.setState({ storesRef: ref });
    }
  }

  storesRef: any;
  dispose: () => void;

  totalsForStore(id: string) {
    return (
      this.state.totals[id] || {
        productsCost: 0,
        deliveryCost: 0,
        totalCount: 0,
      }
    );
  }

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
            {stores.map(store => (
              <CartStore
                key={store.__id}
                store={store}
                totals={this.totalsForStore(store.__id)}
              />
            ))}
          </div>
          <div styleName="total-container">
            <CartTotal
              storesRef={this.state.storesRef}
              totals={this.state.totals}
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
