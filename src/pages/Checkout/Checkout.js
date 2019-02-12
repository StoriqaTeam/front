// @flow

import React, { Component } from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import PropTypes from 'prop-types';
import {
  pipe,
  pathOr,
  path,
  map,
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
import uuidv4 from 'uuid/v4';

import { routerShape, withRouter } from 'found';
import { validate } from '@storiqa/shared';

import { renameKeys } from 'utils/ramda';
import {
  log,
  fromRelayError,
  getCookie,
  setCookie,
  getCurrentCurrency,
} from 'utils';
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
import type { OrderStatusType } from 'types';

import CheckoutHeader from './CheckoutHeader';
import CheckoutAddress from './CheckoutContent/CheckoutAddress';
import CheckoutProducts from './CheckoutContent/CheckoutProducts';
import CheckoutSidebar from './CheckoutSidebar';
import { PaymentInfoFiat } from './PaymentInfoFiat';
import { PaymentInfo } from './PaymentInfo';
import CartStore from '../Cart/CartStore';
import CartEmpty from '../Cart/CartEmpty';
import CheckoutContext from './CheckoutContext';
import updateUserPhoneMutation from './mutations/UpdateUserPhoneMutation';

import './Checkout.scss';

import t from './i18n';

type CartType = {
  id: string,
  productsCost: number,
  deliveryCost: number,
  totalCount: number,
  totalCost: number,
  totalCostWithoutDiscounts: number,
  productsCostWithoutDiscounts: number,
  couponsDiscounts: number,
  stores: {
    edges: Array<{
      node: {
        id: string,
        productsCost: number,
        deliveryCost: number,
        totalCost: number,
        totalCount: number,
        products: Array<{
          id: string,
          selected: boolean,
          baseProduct: ?{
            id: string,
            isShippingAvailable: boolean,
          },
          quantity: number,
        }>,
      },
    }>,
  },
};

type PropsType = {
  me: any,
  // eslint-disable-next-line
  cart: {
    id: string,
    totalCount: number,
    fiat: CartType,
    crypto: CartType,
  },
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
  invoice: ?{
    id: string,
    amount: number,
    currency: string,
    priceReservedDueDateTime: string,
    state: OrderStatusType,
    wallet: ?string,
    transactions: Array<{
      id: string,
      amount: number,
    }>,
    orders: Array<{
      id: string,
      slug: number,
      productId: number,
      quantity: number,
      price: number,
    }>,
    paymentIntent: {
      id: string,
      clientSecret: string,
    },
  },
  checkoutInProcess: boolean,
  errors: { [string]: Array<string> },
  scrollArr: Array<string>,
  currencyType: 'FIAT' | 'CRYPTO',
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

    const currencyType = getCookie('CURRENCY_TYPE');
    if (!currencyType) {
      setCookie('CURRENCY_TYPE', 'FIAT');
    }
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
      invoice: null,
      checkoutInProcess: false,
      errors: {},
      scrollArr: ['receiverName', 'phone', 'deliveryAddress'],
      currencyType: currencyType === 'CRYPTO' ? 'CRYPTO' : 'FIAT',
    };
  }

  setStoresRef(ref) {
    if (ref && !this.state.storesRef) {
      this.setState({ storesRef: ref });
    }
  }

  storesRef: any;

  createAddress = () => {
    this.setState({ checkoutInProcess: true });
    // $FlowIgnore
    const addressFull = pathOr(null, ['orderInput', 'addressFull'], this.state);
    // $FlowIgnore
    const userId = pathOr(null, ['me', 'rawId'], this.props);
    CreateUserDeliveryAddressFullMutation.commit({
      input: {
        clientMutationId: uuidv4(),
        userId,
        addressFull,
        isPriority: false,
      },
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
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
        this.setState({
          isAddressSelect: true,
          isNewAddress: false,
          checkoutInProcess: false,
          step: 2,
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.setState(() => ({
          isAddressSelect: true,
          isNewAddress: false,
          checkoutInProcess: false,
        }));
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    });
  };

  handleChangeStep = (step: number) => {
    const { saveAsNewAddress, isNewAddress } = this.state;
    if (saveAsNewAddress && isNewAddress) {
      this.createAddress();
      return;
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

    const { orderInput } = this.state;
    const { me } = this.props;
    if (me != null && me.phone !== orderInput.receiverPhone) {
      updateUserPhoneMutation({
        environment: this.context.environment,
        variables: {
          input: {
            clientMutationId: uuidv4(),
            id: me.id,
            phone: orderInput.receiverPhone,
          },
        },
      })
        .then(() => {
          this.handleChangeStep(2);
          return true;
        })
        .catch(error => {
          const relayErrors = fromRelayError({ source: { errors: [error] } });
          // $FlowIgnoreMe
          const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
          if (!isEmpty(validationErrors)) {
            this.setState({
              errors: renameKeys(
                {
                  phone: 'receiverPhone',
                },
                validationErrors,
              ),
            });
          }
        });
      return;
    }
    this.handleChangeStep(2);
  };

  validate = () => {
    const { addressFull } = this.state.orderInput;
    let { errors } = validate(
      {
        receiverName: [[val => Boolean(val), t.errors.receiverNameRequired]],
        receiverPhone: [[val => Boolean(val), t.errors.receiverPhoneRequired]],
      },
      this.state.orderInput,
    );
    if (!addressFull.country || !addressFull.postalCode || !addressFull.value) {
      const errorString = `
        ${!addressFull.country ? t.errors.country : ''}
        ${!addressFull.value ? `, ${t.errors.address}` : ''}
        ${!addressFull.postalCode ? `, ${t.errors.postalCode}` : ''}
        ${t.errors.areRequired}
      `;
      errors = {
        ...errors,
        deliveryAddress: [
          errorString.replace(/^(\s+)?,\s+/, '').replace(/\s+,\s+/g, ', '),
        ],
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
    this.setState({ orderInput, errors: {} });
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
    const currencyType = getCookie('CURRENCY_TYPE');
    let actualCurrency = null;
    if (currencyType === 'FIAT') {
      actualCurrency = getCookie('FIAT_CURRENCY');
    }
    if (currencyType === 'CRYPTO') {
      actualCurrency = getCookie('CURRENCY');
    }

    if (!actualCurrency) {
      this.props.showAlert({
        type: 'danger',
        text: t.error,
        link: { text: t.close },
      });
      return;
    }

    const {
      orderInput: { addressFull, receiverName, receiverPhone },
    } = this.state;

    this.setState({ checkoutInProcess: true }, () => {
      CreateOrdersMutation.commit({
        input: {
          clientMutationId: uuidv4(),
          addressFull,
          receiverName,
          receiverPhone,
          currency: actualCurrency,
        },
        environment: this.context.environment,
        onCompleted: (response: CreateOrdersMutationResponseType, errors) => {
          if (response && response.createOrders) {
            this.props.showAlert({
              type: 'success',
              text: t.ordersSuccessfullyCreated,
              link: { text: t.close },
            });
            const { invoice } = response.createOrders;
            this.setState({
              // $FlowIgnore
              invoice, // eslint-disable-line
              checkoutInProcess: false,
            });
            this.handleChangeStep(3);

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

  checkReadyToCheckout = (cart: CartType): boolean => {
    if (!cart) {
      return false;
    }

    const { totalCount, stores } = cart;
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
      // $FlowIgnore
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
    const { me, cart } = this.props;
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
      invoice,
      currencyType,
    } = this.state;
    const actualCart = currencyType === 'CRYPTO' ? cart.crypto : cart.fiat;
    const stores = pipe(pathOr([], ['stores', 'edges']), map(path(['node'])))(
      // $FlowIgnore
      actualCart,
    );
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
                      isReadyToNext={this.checkReadyToCheckout(actualCart)}
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
                                  currency={getCurrentCurrency(currencyType)}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {step === 3 &&
                          currencyType === 'FIAT' && (
                            <PaymentInfoFiat
                              restCartCount={
                                cart.crypto ? cart.crypto.totalCount : 0
                              }
                              invoice={invoice}
                              me={this.props.me}
                            />
                          )}
                        {step === 3 &&
                          invoice &&
                          currencyType === 'CRYPTO' && (
                            <PaymentInfo
                              restCartCount={
                                cart.fiat ? cart.fiat.totalCount : 0
                              }
                              invoiceId={invoice.id}
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
                              isReadyToClick={this.checkReadyToCheckout(
                                actualCart,
                              )}
                              checkoutInProcess={this.state.checkoutInProcess}
                              onCheckout={this.handleCheckout}
                              goToCheckout={this.goToCheckout}
                              cart={actualCart}
                              currency={getCurrentCurrency(currencyType)}
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

export default createFragmentContainer(
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

    fragment Checkout_cart on Cart {
      id
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
    }
  `,
);

Checkout.contextTypes = {
  environment: PropTypes.object.isRequired,
};
