// @flow
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { graphql, createRefetchContainer } from 'react-relay';
import { Environment } from 'relay-runtime';
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
import { Tabs } from 'components/common';

import CartStore from './CartStore';
import CartEmpty from './CartEmpty';
import CheckoutSidebar from '../Checkout/CheckoutSidebar';

// eslint-disable-next-line
import type { Cart_cart } from './__generated__/Cart_cart.graphql';

import './Cart.scss';

import t from './i18n';

type PropsType = {
  // eslint-disable-next-line
  cart: Cart_cart,
  router: routerShape,
  route: {
    prepareVariables: () => void,
  },
  relay: {
    refetch: Function,
    environment: Environment,
  },
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
  selectedTab: number,
};

/* eslint-disable react/no-array-index-key */
class Cart extends Component<PropsType, StateType> {
  state = {
    storesRef: null,
    totals: {},
    selectedTab: 0,
  };

  componentDidMount() {
    // this.refetchCart();
    // window.scroll({ top: 0 });
  }

  setStoresRef(ref) {
    if (ref && !this.state.storesRef) {
      this.setState({ storesRef: ref });
    }
  }

  storesRef: any;
  dispose: () => void;

  refetchCart = () => {
    this.props.relay.refetch(
      {
        first: null,
        after: null,
      },
      null,
      () => {},
      { force: true },
    );
  };

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

  handleClickTab = (selectedTab: number) => {
    this.setState({ selectedTab }, () => {
      this.refetchCart();
    });
  };

  render() {
    console.log('---this.props', this.props);
    console.log('---preVar', this.props.route.prepareVariables());
    const { selectedTab } = this.state;
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
              <div styleName="header">{t.myCart}</div>
              <div styleName="tabs">
                <Tabs selected={selectedTab} onClick={this.handleClickTab}>
                  <div label="Fiat">This is the Fiat panel</div>
                  <div label="Crypto">This is the Crypto panel</div>
                </Tabs>
              </div>
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

export default createRefetchContainer(
  withRouter(Page(Cart, { withoutCategories: true })),
  graphql`
    fragment Cart_cart on Cart
      @argumentDefinitions(
        first: { type: "Int", defaultValue: null }
        after: { type: "ID", defaultValue: null }
        currencyType: { type: "String", defaultValue: "FIAT" }
      ) {
      id
      productsCost
      deliveryCost
      totalCount
      totalCountAll
      totalCost
      totalCostWithoutDiscounts
      productsCostWithoutDiscounts
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
              quantity
            }
          }
        }
      }
    }
  `,
  graphql`
    query Cart_cart_Query($first: Int, $after: ID) {
      cart {
        ...Cart_cart @arguments(first: $first, after: $after)
      }
    }
  `,
);
