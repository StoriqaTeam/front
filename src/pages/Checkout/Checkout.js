// @flow
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import {
  filter,
  propEq,
  reduce,
  reject,
  groupBy,
  isNil,
  head,
  defaultTo,
  pipe,
  pathOr,
  path,
  map,
  prop,
} from 'ramda';
import { routerShape, withRouter } from 'found';

import { log } from 'utils';
import { CreateOrdersMutation } from 'relay/mutations';
import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';
import type { AddAlertInputType } from 'components/App/AlertContext';

// eslint-disable-next-line
import type Cart_cart from '../Cart/__generated__/Cart_cart.graphql';
// eslint-disable-next-line
import type CartStoresLocalFragment from '../Cart/__generated__/CartStoresLocalFragment.graphql';
// eslint-disable-next-line
import type Checkout_me from './__generated__/Checkout_me.graphql';

import CheckoutHeader from './CheckoutHeader';
import CheckoutAddress from './CheckoutContent/CheckoutAddress';
import CheckoutProducts from './CheckoutContent/CheckoutProducts';
import CheckoutSidebar from './CheckoutSidebar';

import CartStore from '../Cart/CartStore';
// import CartTotal from '../Cart/CartTotal';

import './Checkout.scss';

type PropsType = {
  me: any,
  // eslint-disable-next-line
  cart: Cart_cart,
  router: routerShape,
  // $FlowIgnore
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  storesRef: any,
  step: number,
  isAddressSelect: boolean,
  isNewAddress: boolean,
  orderInput: {
    addressFull: AddressFullType,
    receiverName: string,
  },
};

const STORES_FRAGMENT = graphql`
  fragment CheckoutStoresLocalFragment on CartStoresConnection {
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

const getTotals: (data: CheckoutStoresLocalFragment) => Totals = data => {
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
class Checkout extends Component<PropsType, StateType> {
  state = {
    storesRef: null,
    step: 1,
    isAddressSelect: true,
    isNewAddress: false,
    orderInput: {
      addressFull: {
        value: '',
        country: '',
        administrativeAreaLevel1: '',
        administrativeAreaLevel2: '',
        locality: '',
        political: '',
        postalCode: '',
        route: '',
        streetNumber: '',
        placeId: '',
      },
      receiverName: '',
    },
  };

  componentWillMount() {
    const store = this.context.environment.getStore();
    const connectionId = `client:root:cart:__Cart_stores_connection`;
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

  handleChangeStep = step => () => this.setState({ step });

  handleOnChangeOrderInput = orderInput => {
    this.setState({ orderInput });
  };

  handleOnChangeAddressType = () => {
    this.setState(prevState => ({
      isAddressSelect: !prevState.isAddressSelect,
      isNewAddress: !prevState.isNewAddress,
    }));
  };

  handleCheckout = () => {
    const {
      orderInput: { addressFull, receiverName },
    } = this.state;
    CreateOrdersMutation.commit({
      input: { clientMutationId: '', addressFull, receiverName },
      environment: this.context.environment,
      onCompleted: (response, errors) => {
        log.debug('Success for DeleteFromCart mutation');
        if (response) {
          log.debug('Response: ', response);
          this.props.showAlert({
            type: 'success',
            text: 'Orders successfully created',
            link: { text: 'Close.' },
          });
          this.props.router.push('/profile/orders');
        }
        if (errors) {
          log.debug('Errors: ', errors);
        }
      },
      onError: error => {
        log.error('Error in DeleteFromCart mutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something went wrong :(',
          link: { text: 'Close.' },
        });
      },
    });
  };

  checkReadyToCheckout = () => {
    const {
      orderInput: {
        addressFull: { value, country, locality, postalCode, streetNumber },
      },
    } = this.state;
    if (!value || !country || !locality || !postalCode || !streetNumber) {
      return false;
    }
    return true;
  };

  render() {
    const { me } = this.props;
    // $FlowIgnore
    const deliveryAddresses = pathOr(
      null,
      ['me', 'deliveryAddresses'],
      this.props,
    );
    const {
      step,
      isAddressSelect,
      isNewAddress,
      orderInput,
      totals,
    } = this.state;
    const { cart } = this.props;
    const stores = pipe(
      pathOr([], ['cart', 'stores', 'edges']),
      map(path(['node'])),
    )(this.props);
    console.log('>>> Checkout totals: ', { totals });
    return (
      <Container withoutGrow>
        <Row withoutGrow>
          <Col size={12}>
            <CheckoutHeader
              currentStep={step}
              isReadyToNext={this.checkReadyToCheckout()}
              onChangeStep={this.handleChangeStep}
            />
          </Col>
          <Col size={12}>
            <div ref={ref => this.setStoresRef(ref)}>
              <Row withoutGrow>
                <Col size={9}>
                  {step === 1 && (
                    <div styleName="container">
                      <CheckoutAddress
                        me={me}
                        isAddressSelect={isAddressSelect}
                        isNewAddress={isNewAddress}
                        onChangeAddressType={this.handleOnChangeAddressType}
                        deliveryAddresses={deliveryAddresses || []}
                        orderInput={orderInput}
                        onChangeOrderInput={this.handleOnChangeOrderInput}
                      />
                    </div>
                  )}
                  {step === 2 && (
                    <div>
                      <div styleName="container">
                        <CheckoutProducts
                          me={me}
                          orderInput={orderInput}
                          onChangeStep={this.handleChangeStep}
                        />
                      </div>
                      <div styleName="storeContainer">
                        {stores.map(store => (
                          <CartStore
                            onlySelected
                            unselectable
                            key={store.__id}
                            store={store}
                            totals={1000}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </Col>
                <Col size={3}>
                  {/* <CartTotal
                    storesRef={this.state.storesRef}
                    // cart={cart}
                    totlas={totals}
                    buttonText={step === 1 ? 'Next' : 'Checkout'}
                    onClick={
                      (step === 1 && this.handleChangeStep(2)) ||
                      this.handleCheckout
                    }
                    isReadyToClick={this.checkReadyToCheckout()}

                  /> */}
                  <CheckoutSidebar
                    storesRef={this.state.storesRef}
                    cart={cart}
                    buttonText={step === 1 ? 'Next' : 'Checkout'}
                    onClick={
                      (step === 1 && this.handleChangeStep(2)) ||
                      this.handleCheckout
                    }
                    isReadyToClick={this.checkReadyToCheckout()}
                  />
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default createPaginationContainer(
  Page(withShowAlert(withRouter(Checkout))),
  graphql`
    fragment Checkout_me on User {
      id
      rawId
      email
      firstName
      lastName
      deliveryAddresses {
        address {
          value
          country
          administrativeAreaLevel1
          administrativeAreaLevel2
          locality
          political
          postalCode
          route
          streetNumber
          placeId
        }
      }
    }

    fragment Checkout_cart on Cart
      @argumentDefinitions(
        first: { type: "Int", defaultValue: null }
        after: { type: "ID", defaultValue: null }
      ) {
      stores(first: $first, after: $after) @connection(key: "Cart_stores") {
        edges {
          node {
            productsCost
            deliveryCost
            totalCost
            totalCount
            ...CartStore_store
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
      query Checkout_cart_Query($first: Int, $after: ID) {
        cart {
          ...Cart_cart @arguments(first: $first, after: $after)
        }
      }
    `,
  },
);

Checkout.contextTypes = {
  environment: PropTypes.object.isRequired,
};
