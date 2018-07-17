// @flow
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, pathOr, path, map, prop } from 'ramda';
import { routerShape, withRouter } from 'found';

import { log } from 'utils';
import { CreateOrdersMutation } from 'relay/mutations';
import { Page } from 'components/App';
import { PaymentPopup } from 'pages/common/PaymentPopup';
import { Container, Row, Col } from 'layout';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';
import type { AddAlertInputType } from 'components/App/AlertContext';
import type { CreateOrdersMutationResponseType } from 'relay/mutations/CreateOrdersMutation';

// eslint-disable-next-line
import type Cart_cart from '../Cart/__generated__/Cart_cart.graphql';
// eslint-disable-next-line
import type Checkout_me from './__generated__/Checkout_me.graphql';

import CheckoutHeader from './CheckoutHeader';
import CheckoutAddress from './CheckoutContent/CheckoutAddress';
import CheckoutProducts from './CheckoutContent/CheckoutProducts';
import CheckoutSidebar from './CheckoutSidebar';

import CartStore from '../Cart/CartStore';
import CartEmpty from '../Cart/CartEmpty';

import './Checkout.scss';

type PropsType = {
  me: any,
  // eslint-disable-next-line
  cart: Cart_cart,
  router: routerShape,
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
  isPaymentPopupShown: boolean,
  wallet: ?string,
  amount: ?number,
  resevedDueDate: ?string,
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
    isPaymentPopupShown: false,
    wallet: null,
    amount: null,
    resevedDueDate: null,
  };

  setStoresRef(ref) {
    if (ref && !this.state.storesRef) {
      this.setState({ storesRef: ref });
    }
  }

  storesRef: any;

  showPaymentPopup = (input: {
    wallet: string,
    amount: number,
    resevedDueDate: string,
  }) => {
    this.setState({
      isPaymentPopupShown: true,
      ...input,
    });
  };

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
    this.showPaymentPopup({
      wallet: '0x0702dfed3d8b0bb356afccf2bd59ba4fb7a3f1a0',
      amount: 123321,
      resevedDueDate: '1',
    });
    /* const {
      orderInput: { addressFull, receiverName },
    } = this.state;
    CreateOrdersMutation.commit({
      input: { clientMutationId: '', addressFull, receiverName },
      environment: this.context.environment,
      onCompleted: (response: CreateOrdersMutationResponseType, errors) => {
        log.debug('Success for DeleteFromCart mutation');
        if (response) {
          log.debug('Response: ', response);
          this.props.showAlert({
            type: 'success',
            text: 'Orders successfully created',
            link: { text: 'Close.' },
          });
          this.showPaymentPopup(response.createOrders.billingUrl);
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
        this.props.router.push('/checkout');
      },
    }); */
  };

  checkReadyToCheckout = () => {
    const {
      orderInput: {
        addressFull: { value, country, locality, postalCode },
      },
    } = this.state;
    if (!value || !country || !locality || !postalCode) {
      return false;
    }
    return true;
  };

  handlePaymentPopupClose = () => {
    // this.setState({ isPaymentPopupShown: true, paymentPageUrl: null }, () => {
    //   this.props.router.push('/profile/orders');
    // });
  };

  render() {
    const { me } = this.props;
    // $FlowIgnore
    const deliveryAddresses = pathOr(
      null,
      ['me', 'deliveryAddresses'],
      this.props,
    );
    const { step, isAddressSelect, isNewAddress, orderInput } = this.state;
    const {
      cart: { totalCost, totalCount, deliveryCost, productsCost },
    } = this.props;
    const stores = pipe(
      pathOr([], ['cart', 'stores', 'edges']),
      map(path(['node'])),
      // $FlowIgnore
    )(this.props);

    const { wallet, amount, resevedDueDate } = this.state;
    const emptyCart = totalCount === 0;
    return (
      <Container withoutGrow>
        {wallet &&
          amount &&
          resevedDueDate && (
            <PaymentPopup
              onCloseClicked={this.handlePaymentPopupClose}
              isShown={this.state.isPaymentPopupShown}
              walletAddress={wallet}
              amount={amount}
              reservedDueDate={resevedDueDate}
            />
          )}
        <Row withoutGrow>
          {!emptyCart && (
            <Col size={12}>
              <div styleName="headerWrapper">
                <CheckoutHeader
                  currentStep={step}
                  isReadyToNext={this.checkReadyToCheckout()}
                  onChangeStep={this.handleChangeStep}
                />
              </div>
            </Col>
          )}
          <Col size={12}>
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
                  <Col size={12} md={8} lg={9}>
                    {step === 1 && (
                      <div styleName="wrapper">
                        <div styleName="container addressContainer">
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
                      </div>
                    )}
                    {step === 2 && (
                      <div styleName="wrapper">
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
                )}
                {!emptyCart && (
                  <Col size={12} md={4} lg={3}>
                    <CheckoutSidebar
                      storesRef={this.state.storesRef}
                      buttonText={step === 1 ? 'Next' : 'Checkout'}
                      onClick={
                        (step === 1 && this.handleChangeStep(2)) ||
                        this.handleCheckout
                      }
                      productsCost={productsCost}
                      deliveryCost={deliveryCost}
                      totalCount={totalCount}
                      totalCost={totalCost}
                      isReadyToClick={this.checkReadyToCheckout()}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default createPaginationContainer(
  Page(withShowAlert(withRouter(Checkout)), true),
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
      id
      productsCost
      deliveryCost
      totalCost
      totalCount
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
