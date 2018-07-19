// @flow
/* eslint-disable no-underscore-dangle */

import React, { Component } from 'react';
import { createPaginationContainer, graphql } from 'react-relay';
import PropTypes from 'prop-types';
import { pipe, pathOr, path, map, prop } from 'ramda';
import { routerShape, withRouter } from 'found';

import { log } from 'utils';
import {
  CreateUserDeliveryAddressFullMutation,
  CreateOrdersMutation,
} from 'relay/mutations';
import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';
import type { AddAlertInputType } from 'components/App/AlertContext';

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
  saveAsNewAddress: boolean,
  orderInput: {
    addressFull: AddressFullType,
    receiverName: string,
  },
};

/* eslint-disable react/no-array-index-key */
class Checkout extends Component<PropsType, StateType> {
  state = {
    storesRef: null,
    step: 1,
    isAddressSelect: true,
    isNewAddress: false,
    saveAsNewAddress: true,
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

  setStoresRef(ref) {
    if (ref && !this.state.storesRef) {
      this.setState({ storesRef: ref });
    }
  }

  storesRef: any;

  createAddress = () => {
    // $FlowIgnore
    const addressFull = pathOr(null, ['orderInput', 'addressFull'], this.state);
    // $FlowIgnore
    const userId = pathOr(null, ['me', 'rawId'], this.props);
    CreateUserDeliveryAddressFullMutation.commit({
      input: {
        clientMutationId: '',
        userId,
        addressFull,
        isPriority: false,
      },
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        this.setState(() => ({
          isAddressSelect: true,
          isNewAddress: false,
        }));
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong. New address was not created.',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Address created!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.setState(() => ({
          isAddressSelect: true,
          isNewAddress: false,
        }));
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong. New address was not created.',
          link: { text: 'Close.' },
        });
      },
    });
  };

  handleChangeStep = step => () => {
    const { saveAsNewAddress, isNewAddress } = this.state;
    if (saveAsNewAddress && isNewAddress) {
      this.createAddress();
    }
    this.setState({ step });
  };

  handleOnChangeOrderInput = orderInput => {
    this.setState({ orderInput });
  };

  handleOnChangeAddressType = () => {
    this.setState(prevState => ({
      isAddressSelect: !prevState.isAddressSelect,
      isNewAddress: !prevState.isNewAddress,
    }));
  };

  handleChangeSaveCheckbox = () => {
    this.setState(prevState => ({
      saveAsNewAddress: !prevState.saveAsNewAddress,
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
        this.props.router.push('/checkout');
      },
    });
  };

  checkReadyToCheckout = () => {
    const {
      orderInput: {
        addressFull: { value, country, postalCode },
      },
    } = this.state;
    if (!value || !country || !postalCode) {
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
      saveAsNewAddress,
      orderInput,
    } = this.state;
    const {
      cart: { totalCost, totalCount, deliveryCost, productsCost },
    } = this.props;
    const stores = pipe(
      pathOr([], ['cart', 'stores', 'edges']),
      map(path(['node'])),
      // $FlowIgnore
    )(this.props);
    const emptyCart = totalCount === 0;
    return (
      <Container withoutGrow>
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
                            saveAsNewAddress={saveAsNewAddress}
                            onChangeSaveCheckbox={this.handleChangeSaveCheckbox}
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
  Page(withShowAlert(withRouter(Checkout)), true, false),
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
