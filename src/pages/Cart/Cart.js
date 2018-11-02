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
  isEmpty,
  flatten,
  filter,
  whereEq,
  find,
  isNil,
  anyPass,
} from 'ramda';
import { routerShape, withRouter } from 'found';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { StickyBar } from 'components/StickyBar';

import CartStore from './CartStore';
import CartEmpty from './CartEmpty';
import CheckoutSidebar from '../Checkout/CheckoutSidebar';

// eslint-disable-next-line
import type { Cart_cart } from './__generated__/Cart_cart.graphql';

import './Cart.scss';

type PropsType = {
  // eslint-disable-next-line
  cart: Cart_cart,
  router: routerShape,
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

/* eslint-disable react/no-array-index-key */
class Cart extends Component<PropsType, StateType> {
  state = {
    storesRef: null,
    totals: {},
  };

  componentDidMount() {
    window.scroll({ top: 0 });
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

  isAllSelectedProductsHaveShipping = (): boolean => {
    const storeEdges = this.props.cart ? this.props.cart.stores.edges : [];
    const stores = map(prop('node'), [...storeEdges]);
    // $FlowIgnoreMe
    const products = flatten(map(prop('products'), stores));
    const selectedProducts = filter(whereEq({ selected: true }), products);
    const productsWithoutShipping = find(
      item => item.baseProduct.isShippingAvailable === false,
      selectedProducts,
    );

    return anyPass([isEmpty, isNil])(productsWithoutShipping);
  };

  handleToCheckout = () => {
    this.props.router.push('/checkout');
  };

  render() {
    const stores = pipe(
      pathOr([], ['cart', 'stores', 'edges']),
      map(path(['node'])),
      // $FlowIgnoreMe
    )(this.props);

    // $FlowIgnoreMe
    const totalCount = pathOr(0, ['cart', 'totalCount'], this.props);
    const emptyCart = totalCount === 0 && isEmpty(stores);
    return (
      <div styleName="container">
        <Container withoutGrow>
          <Row withoutGrow>
            <Col size={12}>
              <div styleName="header">My cart</div>
              <div ref={ref => this.setStoresRef(ref)}>
                <Row withoutGrow>
                  {emptyCart ? (
                    <Col size={12}>
                      <div styleName="wrapper">
                        <div styleName="storeContainer">
                          <CartEmpty />
                        </div>
                      </div>
                    </Col>
                  ) : (
                    <Col size={12} lg={8} xl={9}>
                      <div styleName="wrapper">
                        <div styleName="storeContainer">
                          {stores.map(store => (
                            <CartStore
                              key={store.__id}
                              store={store}
                              totals={this.totalsForStore(store.__id)}
                              isOpenInfo
                            />
                          ))}
                        </div>
                      </div>
                    </Col>
                  )}
                  <Col size={12} lg={4} xl={3}>
                    {!emptyCart && (
                      <div styleName="sidebarWrapper">
                        <StickyBar>
                          <CheckoutSidebar
                            buttonText="Checkout"
                            onClick={this.handleToCheckout}
                            isReadyToClick={
                              totalCount > 0 &&
                              this.isAllSelectedProductsHaveShipping()
                            }
                          />
                        </StickyBar>
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

Cart.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createPaginationContainer(
  withRouter(Page(Cart, true, true)),
  graphql`
    fragment Cart_cart on Cart
      @argumentDefinitions(
        first: { type: "Int", defaultValue: null }
        after: { type: "ID", defaultValue: null }
      ) {
      id
      productsCost
      deliveryCost
      totalCount
      totalCost
      totalCostWithoutDiscounts
      couponsDiscounts
      stores(first: $first, after: $after) @connection(key: "Cart_stores") {
        edges {
          node {
            id
            ...CartStore_store
            productsCost
            deliveryCost
            totalCost
            totalCount
            products {
              id
              selected
              baseProduct(visibility: "active") {
                id
                isShippingAvailable
              }
            }
          }
        }
      }
    }
  `,
  {
    direction: 'forward',
    getConnectionFromProps: prop('cart'),
    getVariables: () => ({
      first: null,
      after: null,
    }),
    query: graphql`
      query Cart_cart_Query($first: Int, $after: ID) {
        cart {
          ...Cart_cart @arguments(first: $first, after: $after)
        }
      }
    `,
  },
);
