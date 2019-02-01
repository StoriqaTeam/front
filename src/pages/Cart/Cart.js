// @flow
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
// import { Environment } from 'relay-runtime';
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
import { setCookie, getCookie, getCurrentCurrency } from 'utils';

import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { StickyBar } from 'components/StickyBar';
import { Tabs } from 'components/common';

import CartStore from './CartStore';
import CartEmpty from './CartEmpty';
import CheckoutSidebar from '../Checkout/CheckoutSidebar';

// eslint-disable-next-line
import type { Cart_cart as CartType } from './__generated__/Cart_cart.graphql';

import './Cart.scss';

import t from './i18n';

type PropsType = {
  // eslint-disable-next-line
  cart: CartType,
  router: routerShape,
  // route: {
  //   prepareVariables: () => void,
  // },
  // relay: {
  //   refetch: Function,
  //   environment: Environment,
  // },
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
  noTabs: boolean,
};

/* eslint-disable react/no-array-index-key */
class Cart extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType) {
    const { cart } = nextProps;
    let currencyType = getCookie('CURRENCY_TYPE');
    if (!currencyType) {
      setCookie('CURRENCY_TYPE', 'FIAT');
    }
    let noTabs = false;
    // $FlowIgnoreMe
    const storesFiat = pathOr([], ['fiat', 'stores', 'edges'], cart);
    // $FlowIgnoreMe
    const storesCrypto = pathOr([], ['crypto', 'stores', 'edges'], cart);

    if (isEmpty(storesFiat) || isEmpty(storesCrypto)) {
      noTabs = true;
    }
    if (isEmpty(storesFiat)) {
      setCookie('CURRENCY_TYPE', 'CRYPTO');
      currencyType = 'CRYPTO';
    }
    if (isEmpty(storesCrypto)) {
      setCookie('CURRENCY_TYPE', 'FIAT');
      currencyType = 'FIAT';
    }
    return {
      selectedTab: currencyType === 'CRYPTO' ? 1 : 0,
      noTabs,
    };
  }

  constructor(props) {
    super(props);

    const currencyType = getCookie('CURRENCY_TYPE');

    this.state = {
      storesRef: null,
      totals: {},
      selectedTab: currencyType === 'CRYPTO' ? 1 : 0,
      noTabs: false,
    };
  }

  componentDidUpdate(prevProps: PropsType) {
    const { cart } = this.props;
    if (cart.totalCount !== prevProps.cart.totalCount) {
      //
    }
  }

  setStoresRef(ref) {
    if (ref && !this.state.storesRef) {
      this.setState({ storesRef: ref });
    }
  }

  storesRef: any;
  dispose: () => void;

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

  isAllSelectedProductsHaveShipping = (cart: any): boolean => {
    const storeEdges = pathOr([], ['stores', 'edges'], cart);
    const stores = map(prop('node'), [...storeEdges]);
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
    const { cart } = this.props;
    const { selectedTab, noTabs } = this.state;
    const actualCart = selectedTab === 0 ? cart.fiat : cart.crypto;
    const stores = pipe(
      pathOr([], ['stores', 'edges']),
      map(path(['node'])),
      // $FlowIgnoreMe
    )(actualCart);
    // $FlowIgnoreMe
    const totalCountFiat = pathOr(0, ['fiat', 'totalCount'], cart);
    // $FlowIgnoreMe
    const totalCountCrypto = pathOr(0, ['crypto', 'totalCount'], cart);
    const { totalCount } = actualCart;
    const emptyCart = cart.totalCount === 0 && isEmpty(stores);
    return (
      <div styleName="container">
        <Container withoutGrow>
          <Row withoutGrow>
            <Col size={12}>
              {/* <div styleName="header">{t.myCart}</div> */}
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
                      {!noTabs && (
                        <div styleName="tabs">
                          <Tabs
                            selected={selectedTab}
                            onClick={this.handleClickTab}
                            withoutPanel
                          >
                            <div label={t.cart} amount={totalCountFiat} />
                            <div
                              label={t.cryptoCart}
                              amount={totalCountCrypto}
                            />
                          </Tabs>
                        </div>
                      )}
                      <div styleName="wrapper">
                        <div styleName="storeContainer">
                          {stores.map(store => (
                            <CartStore
                              key={store.__id}
                              store={store}
                              totals={this.totalsForStore(store.__id)}
                              isOpenInfo
                              currency={getCurrentCurrency(
                                selectedTab === 1 ? 'CRYPTO' : 'FIAT',
                              )}
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
                              this.isAllSelectedProductsHaveShipping(actualCart)
                            }
                            cart={actualCart}
                            currency={getCurrentCurrency(
                              selectedTab === 1 ? 'CRYPTO' : 'FIAT',
                            )}
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

export default createFragmentContainer(
  withRouter(Page(Cart, { withoutCategories: true })),
  graphql`
    fragment Cart_cart on Cart {
      id
      totalCount
      fiat {
        id
        productsCost
        deliveryCost
        totalCount
        totalCost
        totalCostWithoutDiscounts
        productsCostWithoutDiscounts
        couponsDiscounts
        stores {
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
        stores {
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
);
