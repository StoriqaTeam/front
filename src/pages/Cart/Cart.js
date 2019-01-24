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
import { setCookie, getCookie } from 'utils';

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
  constructor(props) {
    super(props);
    // console.log('---props', props);
    const prepareVariables = props.route.prepareVariables();
    const cartType = pathOr('FIAT', ['currencyType'], prepareVariables);

    // const currencyType = getCookie('CURRENCY_TYPE');

    this.state = {
      storesRef: null,
      totals: {},
      selectedTab: cartType === 'CRYPTO' ? 1 : 0,
    };
  }

  // componentDidMount() {
  //   console.log('---selectedTab', this.state.selectedTab);
  //   this.refetchCart(this.state.selectedTab);
  // }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    // console.log('---this.props', this.props);
    // console.log('---prevProps', prevProps);
    // console.log('---prevState', prevState);
    // debugger;
  }

  setStoresRef(ref) {
    if (ref && !this.state.storesRef) {
      this.setState({ storesRef: ref });
    }
  }

  storesRef: any;
  dispose: () => void;

  refetchCart = (selectedTab: number) => {
    this.props.relay.refetch(
      {
        currencyType: selectedTab === 1 ? 'CRYPTO' : 'FIAT',
      },
      null,
      () => {
        this.setState({ selectedTab }, () => {
          setCookie(
            'CURRENCY_TYPE',
            this.state.selectedTab === 1 ? 'CRYPTO' : 'FIAT',
          );
        });
      },
      { force: true },
    );
  };

  handleClickTab = (selectedTab: number) => {
    if (selectedTab === this.state.selectedTab) {
      return;
    }
    this.setState({ selectedTab }, () => {
      setCookie(
        'CURRENCY_TYPE',
        this.state.selectedTab === 1 ? 'CRYPTO' : 'FIAT',
      );
    });
    // this.refetchCart(selectedTab);
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

  render() {
    console.log('---this.props', this.props);
    const { selectedTab } = this.state;
    // console.log('---selectedTab', selectedTab);
    // const stores = pipe(
    //     //   pathOr([], ['cart', 'stores', 'edges']),
    //     //   map(path(['node'])),
    //     //   // $FlowIgnoreMe
    //     // )(this.props);

    // const cryptoStores = pipe(
    //   pathOr([], ['cart', 'crypto', 'stores', 'edges']),
    //   map(path(['node'])),
    //   // $FlowIgnoreMe
    // )(this.props);
    //
    // const stores = selectedTab === 0 ? fiatStores : cryptoStores;

    const { cart } = this.props;
    const actualCart = selectedTab === 0 ? cart.fiat : cart.crypto;

    console.log('---selectedTab', selectedTab);

    const stores = pipe(
      pathOr([], ['stores', 'edges']),
      map(path(['node'])),
      // $FlowIgnoreMe
    )(actualCart);

    console.log('---stores', stores);

    const { totalCount } = cart;
    const emptyCart = totalCount === 0 && isEmpty(stores);
    return (
      <div styleName="container">
        <Container withoutGrow>
          <Row withoutGrow>
            <Col size={12}>
              <div styleName="header">{t.myCart}</div>
              {!emptyCart && (
                <div styleName="tabs">
                  <Tabs selected={selectedTab} onClick={this.handleClickTab}>
                    <div label="Fiat" amount={2}>
                      This is the Fiat panel
                    </div>
                    <div label="Crypto" amount={2}>
                      This is the Crypto panel
                    </div>
                  </Tabs>
                </div>
              )}
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
                            cart={actualCart}
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
      ) {
      id
      productsCost
      deliveryCost
      totalCount
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
      fiat {
        id
        productsCost
        deliveryCost
        totalCount
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
      crypto {
        id
        productsCost
        deliveryCost
        totalCount
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
