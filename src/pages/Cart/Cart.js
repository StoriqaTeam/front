// @flow

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, pathOr, path, map, prop, propEq, groupBy, filter, reject, isNil, reduce, head, find } from 'ramda';

import { Page } from 'components/App';

import CartStore from './CartStore';
import CartTotal from './CartTotal';

// eslint-disable-next-line
import type Cart_me from './__generated__/Cart_me.graphql';
import type CartStoresLocalQueryResponse from './__generated__/CartStoresLocalQuery.graphql';

import './Cart.scss';

const STORES_QUERY = graphql`
query CartStoresLocalQuery {
  me {
    cart {
      stores {
        edges {
          node {
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
    }
  }
}
`;

type PropsType = {
  // eslint-disable-next-line
  me: Cart_me
};

type Totals = { [storeId: string]: { productsCost: number, deliveryCost: number, totalCount: number }}

type StateType = {
  storesRef: ?Object,
  totals: Totals,
}

const getTotals: (data: CartStoresLocalQueryResponse) => Totals =
  data => {
    const fold = pipe(
      filter(propEq('selected', true)),
      reduce((acc, elem) => ({
        productsCost: acc.productsCost + elem.quantity * elem.price,
        deliveryCost: acc.deliveryCost + elem.deliveryCost,
        totalCount: acc.totalCount + elem.quantity,
      }), { productsCost: 0, deliveryCost: 0, totalCount: 0 }),
    );
    return pipe(
      pathOr([], ['edges']),
      map(prop('node')),
      reject(isNil),
      map(store => ({ id: store.id, ...fold(store.products) })),
      groupBy(prop('id')),
      map(head),
    )(data);
  }

/* eslint-disable react/no-array-index-key */
class Cart extends Component<PropsType, StateType> {
  state = {
    storesRef: null,
    totals: {},
  }

  componentWillMount() {
    const store = this.context.environment.getStore();
    const source = store.getSource().toJSON();
    const meId = path(['client:root', 'me', '__ref'])(source);
    const connectionId = `client:${meId}:cart:__Cart_stores_connection`;
    const queryNode = pipe(
      prop('operation'),
      prop('selections'),
      find(propEq('name', 'me')),
      prop('selections'),
      find(propEq('name', 'cart')),
      prop('selections'),
      find(propEq('name', 'stores')),
    )(STORES_QUERY());
    const snapshot = store.lookup({
      dataID: connectionId,
      node: queryNode,
    });
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
    return this.state.totals[id] || { productsCost: 0, deliveryCost: 0, totalCount: 0 };
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
            {stores.map(store => <CartStore key={store.__id} store={store} totals={this.totalsForStore(store.__id)} />)}
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
