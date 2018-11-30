// @flow

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
  find,
  whereEq,
  isNil,
  filter,
  contains,
  head,
  keys,
} from 'ramda';
import { routerShape, withRouter } from 'found';
import { validate } from '@storiqa/shared';

import { log } from 'utils';
import {
  CreateUserDeliveryAddressFullMutation,
  CreateOrdersMutation,
} from 'relay/mutations';
import { Page } from 'components/App';
import { Container, Row, Col } from 'layout';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { StickyBar } from 'components/StickyBar';
import smoothscroll from 'libs/smoothscroll';
import { transactionTracker } from 'rrHalper';

import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { CreateOrdersMutationResponseType } from 'relay/mutations/CreateOrdersMutation';

// eslint-disable-next-line
import type Cart_cart from '../Cart/__generated__/Cart_cart.graphql';
// eslint-disable-next-line
import type Checkout_me from './__generated__/Checkout_me.graphql';

import CheckoutHeader from './CheckoutHeader';
import CheckoutAddress from './CheckoutContent/CheckoutAddress';
import CheckoutProducts from './CheckoutContent/CheckoutProducts';
import CheckoutSidebar from './CheckoutSidebar';
import { PaymentInfo } from './PaymentInfo';
import CartStore from '../Cart/CartStore';
import CartEmpty from '../Cart/CartEmpty';
import CheckoutContext from './CheckoutContext';

import './Checkout.scss';

import t from './i18n';

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
    receiverPhone: string,
  },
  invoiceId: ?string,
  checkoutInProcess: boolean,
  errors: { [string]: Array<string> },
  scrollArr: Array<string>,
};

const emptyAddress = {
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
};

/* eslint-disable react/no-array-index-key */
class Checkout extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { deliveryAddressesFull } = props.me;
    this.state = {
      storesRef: null,
      step: 1,
      isAddressSelect: !isEmpty(deliveryAddressesFull),
      isNewAddress: isEmpty(deliveryAddressesFull),
      saveAsNewAddress: true,
      orderInput: {
        addressFull: emptyAddress,
        receiverName:
          (props.me && `${props.me.firstName} ${props.me.lastName}`) || '',
        receiverPhone: (props.me && props.me.phone) || '',
      },
      invoiceId: null,
      checkoutInProcess: false,
      errors: {},
      scrollArr: ['receiverName', 'phone', 'deliveryAddress'],
    };
  }

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
        this.setState(() => ({
          isAddressSelect: true,
          isNewAddress: false,
        }));
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: t.addressCreated,
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
          text: t.somethingGoingWrong,
          link: { text: t.close },
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

  goToCheckout = () => {
    this.setState({ errors: {} });
    const preValidationErrors = this.validate();
    if (!isEmpty(preValidationErrors)) {
      this.setState({ errors: preValidationErrors });
      return;
    }
    this.setState({ step: 2 });
  };

  validate = () => {
    const { addressFull } = this.state.orderInput;
    let { errors } = validate(
      {
        receiverName: [[val => Boolean(val), 'Receiver name is required']],
        receiverPhone: [[val => Boolean(val), 'Receiver phone is required']],
      },
      this.state.orderInput,
    );
    if (!addressFull.country || !addressFull.postalCode || !addressFull.value) {
      errors = {
        ...errors,
        deliveryAddress: ['Country, address and postal code are required'],
      };
    }
    if (errors && !isEmpty(errors)) {
      const { scrollArr } = this.state;
      const oneArr = filter(item => contains(item, keys(errors)), scrollArr);
      if (!isEmpty(oneArr) && head(oneArr)) {
        smoothscroll.scrollTo(head(oneArr));
      }
    }
    return errors || {};
  };

  handleOnChangeOrderInput = orderInput => {
    this.setState({ orderInput });
  };

  handleOnChangeAddressType = () => {
    const { me } = this.props;
    if (isEmpty(me.deliveryAddressesFull)) {
      return;
    }
    this.setState(prevState => ({
      isAddressSelect: !prevState.isAddressSelect,
      isNewAddress: !prevState.isNewAddress,
      orderInput: {
        ...prevState.orderInput,
        addressFull: emptyAddress,
      },
    }));
  };

  handleChangeSaveCheckbox = () => {
    this.setState(prevState => ({
      saveAsNewAddress: !prevState.saveAsNewAddress,
    }));
  };

  handleCheckout = () => {
    const {
      orderInput: { addressFull, receiverName, receiverPhone },
    } = this.state;
    this.setState({ checkoutInProcess: true }, () => {
      CreateOrdersMutation.commit({
        input: {
          clientMutationId: '',
          addressFull,
          receiverName,
          receiverPhone,
          currency: 'STQ',
        },
        environment: this.context.environment,
        onCompleted: (response: CreateOrdersMutationResponseType, errors) => {
          if (response && response.createOrders) {
            this.props.showAlert({
              type: 'success',
              text: t.ordersSuccessfullyCreated,
              link: { text: t.close },
            });
            this.setState({
              invoiceId: response.createOrders.invoice.id,
              checkoutInProcess: false,
            });
            this.handleChangeStep(3)();

            const { invoice } = response.createOrders;

            if (
              process.env.BROWSER &&
              process.env.REACT_APP_RRPARTNERID &&
              invoice
            ) {
              const items = map(
                item => ({
                  id: item.productId,
                  qnt: item.quantity,
                  price: item.price,
                }),
                [...invoice.orders],
              );

              transactionTracker({
                transactionId: invoice.id,
                items,
              });
            }
          } else if (!errors) {
            this.props.showAlert({
              type: 'danger',
              text: t.error,
              link: { text: t.close },
            });
            this.setState({ checkoutInProcess: false });
          } else {
            this.props.showAlert({
              type: 'danger',
              text: t.error,
              link: { text: t.close },
            });
            this.setState({ checkoutInProcess: false });
          }
        },
        onError: error => {
          log.error(t.errorInDeleteFromCart);
          log.error(error);
          this.props.showAlert({
            type: 'danger',
            text: t.somethingWentWrong,
            link: { text: t.close },
          });
          this.setState({ checkoutInProcess: false });
          this.props.router.push('/checkout');
        },
      });
    });
  };

  checkReadyToCheckout = (): boolean => {
    if (!this.props.cart) {
      return false;
    }

    const {
      cart: { totalCount, stores },
    } = this.props;
    const { step } = this.state;

    // check that all products have selected delivery packages
    if (step === 2 && stores && stores.edges instanceof Array) {
      const products = flatten(
        map(item => {
          if (item.node && item.node.products instanceof Array) {
            return item.node.products;
          }
          return [];
        }, stores.edges),
      );

      const selectedProducts = filter(whereEq({ selected: true }), products);

      const isProductsWithoutPackageExist = find(
        whereEq({ selectPackage: null }),
        selectedProducts,
      );

      if (!isNil(isProductsWithoutPackageExist)) {
        return false;
      }
    }

    if (totalCount === 0 && step === 2) {
      return false;
    }
    return true;
  };

  render() {
    const { me } = this.props;
    // $FlowIgnore
    const deliveryAddresses = pathOr(
      null,
      ['me', 'deliveryAddressesFull'],
      this.props,
    );
    const {
      step,
      isAddressSelect,
      isNewAddress,
      saveAsNewAddress,
      orderInput,
      errors,
    } = this.state;
    const stores = pipe(
      pathOr([], ['cart', 'stores', 'edges']),
      map(path(['node'])),
      // $FlowIgnore
    )(this.props);

    const emptyCart = stores.length === 0;
    return (
      <CheckoutContext.Provider
        value={{
          // $FlowIgnore
          country: pathOr(
            null,
            ['addressFull', 'country'],
            this.state.orderInput,
          ),
        }}
      >
        <div styleName="mainContainer">
          <Container withoutGrow>
            <Row withoutGrow>
              {(!emptyCart || step === 3) && (
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
                    {emptyCart && step !== 3 ? (
                      <Col size={12}>
                        <div styleName="wrapper">
                          <div styleName="storeContainer">
                            <CartEmpty />
                          </div>
                        </div>
                      </Col>
                    ) : (
                      <Col
                        size={12}
                        lg={step !== 3 ? 8 : 12}
                        xl={step !== 3 ? 9 : 12}
                      >
                        {step === 1 && (
                          <div styleName="wrapper">
                            <div styleName="container addressContainer">
                              <CheckoutAddress
                                me={me}
                                isAddressSelect={isAddressSelect}
                                isNewAddress={isNewAddress}
                                saveAsNewAddress={saveAsNewAddress}
                                onChangeSaveCheckbox={
                                  this.handleChangeSaveCheckbox
                                }
                                onChangeAddressType={
                                  this.handleOnChangeAddressType
                                }
                                deliveryAddresses={deliveryAddresses || []}
                                orderInput={orderInput}
                                onChangeOrderInput={
                                  this.handleOnChangeOrderInput
                                }
                                errors={errors}
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
                                  key={store.__id} // eslint-disable-line
                                  store={store}
                                  totals={1000}
                                  withDeliveryCompaniesSelect
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {step === 3 &&
                          this.state.invoiceId && (
                            <PaymentInfo
                              invoiceId={this.state.invoiceId}
                              me={this.props.me}
                            />
                          )}
                      </Col>
                    )}
                    {!emptyCart &&
                      step !== 3 && (
                        <Col size={12} lg={4} xl={3}>
                          <StickyBar>
                            <CheckoutSidebar
                              step={step}
                              buttonText={step === 1 ? t.next : t.checkout}
                              isReadyToClick={this.checkReadyToCheckout()}
                              checkoutInProcess={this.state.checkoutInProcess}
                              onCheckout={this.handleCheckout}
                              goToCheckout={this.goToCheckout}
                            />
                          </StickyBar>
                        </Col>
                      )}
                  </Row>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </CheckoutContext.Provider>
    );
  }
}

export default createPaginationContainer(
  Page(withShowAlert(withRouter(Checkout)), { withoutCategories: true }),
  graphql`
    fragment Checkout_me on User {
      ...PaymentInfo_me
      id
      rawId
      email
      firstName
      lastName
      phone
      deliveryAddressesFull {
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
        isPriority
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
            id
            productsCost
            deliveryCost
            totalCost
            totalCount
            ...CartStore_store
            products {
              id
              companyPackage {
                id
                rawId
              }
              selectPackage {
                id
                shippingId
              }
              selected
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
