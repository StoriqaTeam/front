// @flow

import React, { Component, Fragment } from 'react';
import { createFragmentContainer, graphql, Relay } from 'react-relay';
import {
  filter,
  find,
  head,
  map,
  propEq,
  pathOr,
  toUpper,
  isEmpty,
  contains,
  keys,
  isNil,
  assoc,
} from 'ramda';
import { routerShape } from 'found';
import classNames from 'classnames';
import { validate } from '@storiqa/shared';
import uuidv4 from 'uuid/v4';

import { Page } from 'components/App';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { Container, Row, Col } from 'layout';
import { Input, RadioButton, Select, Checkbox } from 'components/common';
import { AddressForm } from 'components/AddressAutocomplete';
import { StickyBar } from 'components/StickyBar';
import {
  log,
  getNameText,
  fromRelayError,
  checkCurrencyType,
  getCurrentCurrency,
} from 'utils';
import smoothscroll from 'libs/smoothscroll';
import {
  BuyNowMutation,
  CreateUserDeliveryAddressFullMutation,
} from 'relay/mutations';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { AddressFullType, SelectItemType, AllCurrenciesType } from 'types';
import type { MutationParamsType as CreateMutationParamsType } from 'relay/mutations/CreateUserDeliveryAddressFullMutation';
import type { MutationParamsType as BuyNowMutationParamsType } from 'relay/mutations/BuyNowMutation';
import type { AvailableDeliveryPackageType } from 'relay/queries/fetchAvailableShippingForUser';
import type { BuyNow_baseProduct as BuyNowBaseProductType } from './__generated__/BuyNow_baseProduct.graphql';

import Header from './Header';
import AddressInfo from './AddressInfo';
import CheckoutProducts from './CheckoutProducts';
import CartStore from './CartStore';
import CheckoutSidebar from './CheckoutSidebar';
import { addressesToSelect } from './utils';
import fetchBuyNow from './fetchBuyNow';
import updateUserPhoneMutation from '../Checkout/mutations/UpdateUserPhoneMutation';

import './BuyNow.scss';

import t from './i18n';

const emptyAddressFull = {
  value: '',
  country: '',
  countryCode: '',
  administrativeAreaLevel1: '',
  administrativeAreaLevel2: '',
  locality: '',
  political: '',
  postalCode: '',
  route: '',
  streetNumber: '',
  placeId: '',
};

type DeliveryAddressType = {
  id: string,
  address: AddressFullType,
  isPriority: boolean,
};

export type CalculateBuyNowType = {
  couponsDiscounts: number, // скидка
  totalCost: number, // сумма + доставка - скидка
  totalCostWithoutDiscounts: number, // сумма + доставка
  totalCount: number, // количество
  deliveryCost: number, // цена доставки
  subtotalWithoutDiscounts: number, // цена всех продуктов без доставки и без скидки
  subtotal: number, // цена всех продуктов без доставки
};

type StateType = {
  step: number,
  receiverName: string,
  phone: string,
  addresses: Array<SelectItemType>,
  selectedAddress: ?SelectItemType,
  deliveryAddress: AddressFullType,
  saveAsNewAddress: boolean,
  buyNowData: CalculateBuyNowType,
  changeCountLoading: boolean,
  couponCodeValue: string,
  successCouponCodeValue: ?string,
  couponCodeButtonDisabled: boolean,
  isLoadingCouponButton: boolean,
  isLoadingCheckout: boolean,
  errors: { [string]: Array<string> },
  scrollArr: Array<string>,
  deliveryPackage: ?AvailableDeliveryPackageType,
  currency: AllCurrenciesType,
};

type PropsType = {
  me: {
    id: string,
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    deliveryAddressesFull: Array<DeliveryAddressType>,
  },
  baseProduct: BuyNowBaseProductType,
  calculateBuyNow: CalculateBuyNowType,
  showAlert: (input: AddAlertInputType) => void,
  relay: Relay,
  router: routerShape,
};

class BuyNow extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { me, calculateBuyNow, baseProduct } = props;
    const { currency } = baseProduct;
    const currencyType =
      // $FlowIgnore
      checkCurrencyType(currency) === 'crypto' ? 'CRYPTO' : 'FIAT';
    const {
      couponsDiscounts,
      totalCost,
      totalCostWithoutDiscounts,
      totalCount,
      deliveryCost,
      subtotalWithoutDiscounts,
      subtotal,
    } = calculateBuyNow;
    const { deliveryAddressesFull } = me;
    const addresses = addressesToSelect(deliveryAddressesFull);
    const selectedAddress = this.getDefaultSelectedDeliveryAddress();

    this.state = {
      step: 1,
      receiverName: `${me.firstName} ${me.lastName}`,
      phone: me.phone || '',
      addresses,
      selectedAddress: selectedAddress || null,
      deliveryAddress: this.getDeliveryAddress(selectedAddress),
      saveAsNewAddress: true,
      buyNowData: {
        couponsDiscounts,
        totalCost,
        totalCostWithoutDiscounts,
        totalCount,
        deliveryCost,
        subtotalWithoutDiscounts,
        subtotal,
      },
      changeCountLoading: false,
      couponCodeValue: '',
      successCouponCodeValue: null,
      couponCodeButtonDisabled: true,
      isLoadingCouponButton: false,
      isLoadingCheckout: false,
      errors: {},
      scrollArr: ['receiverName', 'phone', 'deliveryAddress'],
      deliveryPackage: null,
      // $FlowIgnore
      currency: getCurrentCurrency(currencyType),
    };
  }

  componentDidMount() {
    window.scroll({ top: 0 });
    const { baseProduct } = this.props;
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    // $FlowIgnore
    const variants = pathOr([], ['variants', 'all'], baseProduct);
    const variant = find(propEq('rawId', parseInt(queryParams.variant, 10)))(
      variants,
    );

    if (
      variant &&
      !variant.preOrder &&
      parseInt(queryParams.quantity, 10) > variant.quantity
    ) {
      this.handleChangeCount(variant.quantity);
    }

    // if (queryParams.delivery) {
    //   this.handleChangeDelivery(queryParams.delivery);
    // }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.step === 1 && prevState.step === 2) {
      const { me } = this.props;
      const selectedAddressAvailable = this.state.selectedAddress;
      const { deliveryAddressesFull } = me;
      const addresses = addressesToSelect(deliveryAddressesFull);
      const selectedAddress =
        selectedAddressAvailable || this.getDefaultSelectedDeliveryAddress();
      const deliveryAddress = this.getDeliveryAddress(selectedAddress);
      this.updateAddressState({
        addresses,
        selectedAddress,
        deliveryAddress,
      });
    }
  };

  getDefaultSelectedDeliveryAddress = () => {
    const { me } = this.props;
    const { deliveryAddressesFull } = me;
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);

    const countriesFromQuery = filter(
      item => item.address.countryCode === queryParams.country,
      deliveryAddressesFull || [],
    );
    const countryFromQuery = isEmpty(countriesFromQuery)
      ? null
      : head(countriesFromQuery);
    const addresses = addressesToSelect(deliveryAddressesFull);

    return !isNil(countryFromQuery)
      ? find(propEq('id', countryFromQuery.id))(addresses)
      : find(propEq('id', '0'))(addresses) || head(addresses) || null;
  };

  getDeliveryAddress = (selectedAddress: ?SelectItemType): AddressFullType => {
    if (!selectedAddress) {
      return emptyAddressFull;
    }

    const { deliveryAddressesFull } = this.props.me;

    const newDeliveryAddresses = filter(
      newAddressItem => Boolean(newAddressItem.needed),
      map(
        addressItem => ({
          ...addressItem,
          needed:
            (selectedAddress &&
              selectedAddress.id === '0' &&
              addressItem.isPriority) ||
            (selectedAddress && selectedAddress.id === addressItem.id),
        }),
        deliveryAddressesFull,
      ),
    );

    if (head(newDeliveryAddresses)) {
      return head(newDeliveryAddresses).address;
    }

    return emptyAddressFull;
  };

  updateAddressState = (data: {
    addresses: Array<SelectItemType>,
    selectedAddress: ?SelectItemType,
    deliveryAddress: AddressFullType,
  }) => {
    const { addresses, selectedAddress, deliveryAddress } = data;
    this.setState({ addresses, selectedAddress, deliveryAddress });
  };

  handleChangeReceiver = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({ receiverName: e.target.value });
  };

  handleChangePhone = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!/^\+?\d*$/.test(value)) {
      return;
    }
    this.setState({ phone: value });
  };

  handleOnSelectAddress = (item: ?SelectItemType) => {
    this.setState({
      selectedAddress: item,
      deliveryAddress: this.getDeliveryAddress(item),
    });
  };

  handleOnChangeAddressType = (id: string) => {
    if (id === 'newAddressCheckbox') {
      this.setState({
        selectedAddress: null,
        deliveryAddress: emptyAddressFull,
      });
      return;
    }
    const selectedAddress = this.getDefaultSelectedDeliveryAddress();
    this.setState((prevState: StateType) => {
      if (prevState.selectedAddress) {
        return {
          selectedAddress: prevState.selectedAddress,
          deliveryAddress: this.getDeliveryAddress(prevState.selectedAddress),
        };
      }
      return {
        selectedAddress: selectedAddress || null,
        deliveryAddress: this.getDeliveryAddress(selectedAddress),
      };
    });
  };

  handleChangeSaveCheckbox = () => {
    this.setState((prevState: StateType) => ({
      saveAsNewAddress: !prevState.saveAsNewAddress,
    }));
  };

  handleChangeData = (addressFullData: AddressFullType): void => {
    this.setState({ deliveryAddress: addressFullData });
  };

  goToCheckout = () => {
    // const { errors } = this.state;
    this.setState({ errors: {} });
    const preValidationErrors = this.validate();
    if (!isEmpty(preValidationErrors)) {
      this.setState({ errors: preValidationErrors });
      return;
    }
    const { saveAsNewAddress, selectedAddress } = this.state;
    if (saveAsNewAddress && !selectedAddress) {
      this.createAddress();
    }

    const handleFetchBuyNow = () => {
      const { deliveryAddress } = this.state;
      // $FlowIgnore
      const queryParams = pathOr(
        [],
        ['match', 'location', 'query'],
        this.props,
      );
      this.setState({ isLoadingCheckout: true });
      const variables = {
        productId: parseInt(queryParams.variant, 10),
        quantity: parseInt(queryParams.quantity, 10),
      };
      fetchBuyNow(
        this.props.relay.environment,
        deliveryAddress && deliveryAddress.countryCode === queryParams.country
          ? assoc('shippingId', parseInt(queryParams.delivery, 10), variables)
          : variables,
      )
        .then(({ calculateBuyNow }) => {
          const {
            couponsDiscounts,
            totalCost,
            totalCostWithoutDiscounts,
            totalCount,
            deliveryCost,
            subtotalWithoutDiscounts,
            subtotal,
          } = calculateBuyNow;
          this.setState({
            step: 2,
            isLoadingCheckout: false,
            buyNowData: {
              couponsDiscounts,
              totalCost,
              totalCostWithoutDiscounts,
              totalCount,
              deliveryCost,
              subtotalWithoutDiscounts,
              subtotal,
            },
          });
          return true;
        })
        .catch(() => {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          this.setState({ isLoadingCheckout: false });
        });
    };

    const { me } = this.props;

    if (me != null && me.phone !== this.state.phone) {
      updateUserPhoneMutation({
        environment: this.props.relay.environment,
        variables: {
          input: {
            clientMutationId: uuidv4(),
            id: me.id,
            phone: this.state.phone,
          },
        },
      })
        .then(() => {
          handleFetchBuyNow();
          return true;
        })
        .catch(error => {
          const relayErrors = fromRelayError({ source: { errors: [error] } });
          // $FlowIgnoreMe
          const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
          if (!isEmpty(validationErrors)) {
            this.setState({ errors: validationErrors });
          }
        });
      return;
    }
    handleFetchBuyNow();
  };

  validate = () => {
    const { deliveryAddress } = this.state;
    let { errors } = validate(
      {
        receiverName: [[val => Boolean(val), t.errors.receiverNameRequired]],
        phone: [[val => Boolean(val), t.errors.receiverPhoneRequired]],
      },
      this.state,
    );
    if (
      !deliveryAddress.country ||
      !deliveryAddress.postalCode ||
      !deliveryAddress.value
    ) {
      const errorString = `
        ${!deliveryAddress.country ? t.errors.country : ''}
        ${!deliveryAddress.value ? `, ${t.errors.address}` : ''}
        ${!deliveryAddress.postalCode ? `, ${t.errors.postalCode}` : ''}
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

  replaceAddress = () => {
    this.setState({ step: 1 });
  };

  handleCheckout = () => {
    this.setState({ isLoadingCheckout: true });
    const {
      deliveryAddress,
      receiverName,
      phone,
      successCouponCodeValue,
      deliveryPackage,
      currency,
    } = this.state;
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    let input = {
      clientMutationId: uuidv4(),
      productId: parseInt(queryParams.variant, 10),
      quantity: parseInt(queryParams.quantity, 10),
      addressFull: deliveryAddress,
      receiverName,
      receiverPhone: phone,
      currency,
      shippingId: deliveryPackage ? deliveryPackage.shippingId : null,
    };
    if (successCouponCodeValue) {
      input = { ...input, couponCode: successCouponCodeValue };
    }
    const params: BuyNowMutationParamsType = {
      input,
      environment: this.props.relay.environment,
      onCompleted: (response, errors) => {
        this.setState({ isLoadingCheckout: false });
        log.debug('Success for BuyNowMutation');
        if (response && response.buyNow) {
          log.debug('Response: ', response);
          this.props.showAlert({
            type: 'success',
            text: t.orderSuccessfullyCreated,
            link: { text: t.close },
          });
          const responseOrders = pathOr(
            null,
            ['invoice', 'orders'],
            response.buyNow,
          );
          const order = responseOrders[0];
          this.props.router.push(`/profile/orders/${order.slug}/payment-info`);
        } else if (!errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.error,
            link: { text: t.close },
          });
        } else {
          log.debug('Errors: ', errors);
          this.props.showAlert({
            type: 'danger',
            text: t.error,
            link: { text: t.close },
          });
        }
      },
      onError: error => {
        this.setState({ isLoadingCheckout: false });
        log.error('Error in BuyNowMutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingWentWrong,
          link: { text: t.close },
        });
      },
    };
    BuyNowMutation.commit(params);
  };

  createAddress = () => {
    // $FlowIgnore
    const userId = pathOr(null, ['me', 'rawId'], this.props);
    const params: CreateMutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
        userId,
        addressFull: this.state.deliveryAddress,
        isPriority: false,
      },
      environment: this.props.relay.environment,
      onCompleted: (response: ?Object, errors: ?Array<*>) => {
        log.debug({ response, errors });
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrongNewAddressWasNotCreated,
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
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrongNewAddressWasNotCreated,
          link: { text: t.close },
        });
      },
    };
    CreateUserDeliveryAddressFullMutation.commit(params);
  };

  handleChangeCount = (quantity: number) => {
    if (this.state.changeCountLoading) {
      return;
    }
    this.setState({ changeCountLoading: true });
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    const { successCouponCodeValue, deliveryPackage } = this.state;
    const variables = {
      productId: parseInt(queryParams.variant, 10),
      quantity,
      couponCode: successCouponCodeValue || null,
      shippingId: deliveryPackage ? deliveryPackage.shippingId : null,
    };
    fetchBuyNow(this.props.relay.environment, variables)
      .then(({ calculateBuyNow }) => {
        const {
          couponsDiscounts,
          totalCost,
          totalCostWithoutDiscounts,
          totalCount,
          deliveryCost,
          subtotalWithoutDiscounts,
          subtotal,
        } = calculateBuyNow;
        this.setState(
          {
            buyNowData: {
              couponsDiscounts,
              totalCost,
              totalCostWithoutDiscounts,
              totalCount,
              deliveryCost,
              subtotalWithoutDiscounts,
              subtotal,
            },
            changeCountLoading: false,
          },
          () => {
            this.props.router.replace(
              `/buy-now?product=${queryParams.product}&variant=${
                queryParams.variant
              }&quantity=${quantity}`,
            );
          },
        );
        return true;
      })
      .catch(() => {
        this.props.showAlert({
          type: 'danger',
          text: t.somethingWentWrong,
          link: { text: t.close },
        });
        this.setState({ changeCountLoading: false });
      });
  };

  handleChangeCoupon = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const value = toUpper(e.target.value);
    if (!/^[A-Za-z0-9]*$/.test(value)) {
      return;
    }
    this.setState({
      couponCodeValue: toUpper(value),
      couponCodeButtonDisabled: !value,
    });
  };

  handleSetCoupon = () => {
    this.setState({ isLoadingCouponButton: true });
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    const {
      couponCodeValue,
      successCouponCodeValue,
      deliveryPackage,
    } = this.state;
    const variables = {
      productId: parseInt(queryParams.variant, 10),
      quantity: parseInt(queryParams.quantity, 10),
      couponCode: couponCodeValue,
      shippingId: deliveryPackage ? deliveryPackage.shippingId : null,
    };
    fetchBuyNow(this.props.relay.environment, variables)
      .then(({ calculateBuyNow }) => {
        if (!calculateBuyNow) {
          throw new Error(t.couponNotFound);
        }
        if (couponCodeValue === successCouponCodeValue) {
          throw new Error(t.couponAlreadyApplied);
        }
        const {
          couponsDiscounts,
          totalCost,
          totalCostWithoutDiscounts,
          totalCount,
          deliveryCost,
          subtotalWithoutDiscounts,
          subtotal,
        } = calculateBuyNow;
        this.setState(
          {
            buyNowData: {
              couponsDiscounts,
              totalCost,
              totalCostWithoutDiscounts,
              totalCount,
              deliveryCost,
              subtotalWithoutDiscounts,
              subtotal,
            },
            successCouponCodeValue: couponCodeValue,
            isLoadingCouponButton: false,
          },
          () => {
            this.props.showAlert({
              type: 'success',
              text: t.couponApplied,
              link: { text: '' },
            });
          },
        );
        return true;
      })
      .catch((error: string) => {
        this.props.showAlert({
          type: 'danger',
          text: `${error}`,
          link: { text: t.close },
        });
        this.setState({ isLoadingCouponButton: false });
      });
  };

  handleDeleteProduct = () => {
    // $FlowIgnore
    const storeId = pathOr(null, ['baseProduct', 'store', 'rawId'], this.props);
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    this.props.router.push(`/store/${storeId}/products/${queryParams.product}`);
  };

  handleChangeDelivery = (
    pkg: ?AvailableDeliveryPackageType,
  ): Promise<boolean> => {
    if (!pkg) {
      return Promise.resolve(true);
    }
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    const { successCouponCodeValue } = this.state;
    const variables = {
      productId: parseInt(queryParams.variant, 10),
      quantity: parseInt(queryParams.quantity, 10),
      couponCode: successCouponCodeValue || null,
      shippingId: pkg.shippingId,
    };
    return fetchBuyNow(this.props.relay.environment, variables)
      .then(({ calculateBuyNow }) => {
        if (!calculateBuyNow) {
          throw new Error();
        }
        const {
          couponsDiscounts,
          totalCost,
          totalCostWithoutDiscounts,
          totalCount,
          deliveryCost,
          subtotalWithoutDiscounts,
          subtotal,
        } = calculateBuyNow;
        this.setState(
          {
            buyNowData: {
              couponsDiscounts,
              totalCost,
              totalCostWithoutDiscounts,
              totalCount,
              deliveryCost,
              subtotalWithoutDiscounts,
              subtotal,
            },
            deliveryPackage: pkg,
          },
          () => {
            this.props.showAlert({
              type: 'success',
              text: t.deliveryApplied,
              link: { text: '' },
            });
          },
        );
        return Promise.resolve(true);
      })
      .catch(() => {
        this.props.showAlert({
          type: 'danger',
          text: t.somethingWentWrong,
          link: { text: t.close },
        });
        return Promise.reject();
      });
  };

  handlePackagesFetched = (packages: Array<AvailableDeliveryPackageType>) => {
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    if (queryParams.delivery) {
      const deliveryPackage = find(
        propEq('shippingId', parseInt(queryParams.delivery, 10)),
      )(packages);
      this.setState({ deliveryPackage: deliveryPackage || null });
    }
  };

  render() {
    const { me, baseProduct } = this.props;
    const {
      step,
      receiverName,
      phone,
      selectedAddress,
      addresses,
      deliveryAddress,
      saveAsNewAddress,
      buyNowData,
      couponCodeValue,
      couponCodeButtonDisabled,
      isLoadingCouponButton,
      isLoadingCheckout,
      errors,
      deliveryPackage,
      currency,
    } = this.state;
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    // $FlowIgnore
    const variants = pathOr([], ['variants', 'all'], baseProduct);
    const variant = find(propEq('rawId', parseInt(queryParams.variant, 10)))(
      variants,
    );
    const productName = getNameText(baseProduct.name, 'EN');
    const isEmptyDeliveryAddressesFull = isEmpty(me.deliveryAddressesFull);

    return (
      <div styleName="container">
        <Container withoutGrow>
          <Row withoutGrow>
            <Col size={12}>
              <div styleName="headerWrapper">
                <Header
                  currentStep={step}
                  isReadyToNext={() => {}}
                  onChangeStep={() => {}}
                />
              </div>
            </Col>
            <Col size={12} lg={step !== 3 ? 8 : 12} xl={step !== 3 ? 9 : 12}>
              {step === 1 && (
                <div styleName="body">
                  <div styleName="addressWrap">
                    <Container correct>
                      <Row>
                        <Col size={12} xl={6}>
                          <div styleName="address">
                            <Row>
                              <Col size={12}>
                                <div styleName="title">{t.deliveryInfo}</div>
                                <div styleName="receiverItem">
                                  <Input
                                    fullWidth
                                    id="receiverName"
                                    label={
                                      <span>
                                        {t.labelReceiverName}{' '}
                                        <span styleName="red">*</span>
                                      </span>
                                    }
                                    onChange={this.handleChangeReceiver}
                                    value={receiverName}
                                    limit={50}
                                    errors={errors.receiverName}
                                  />
                                </div>
                                <div styleName="receiverItem">
                                  <Input
                                    fullWidth
                                    id="phone"
                                    label={
                                      <span>
                                        {`${t.labelReceiverPhone} `}
                                        <span styleName="red">*</span>
                                      </span>
                                    }
                                    onChange={this.handleChangePhone}
                                    value={phone}
                                    errors={errors.phone}
                                  />
                                </div>
                                {!isEmptyDeliveryAddressesFull && (
                                  <div styleName="selectItem">
                                    <RadioButton
                                      id="existingAddressCheckbox"
                                      label={t.labelChooseYourAddress}
                                      isChecked={selectedAddress !== null}
                                      onChange={this.handleOnChangeAddressType}
                                    />
                                    {selectedAddress !== null && (
                                      <div styleName="select">
                                        <Select
                                          label={t.labelAddress}
                                          items={addresses}
                                          activeItem={selectedAddress}
                                          onSelect={this.handleOnSelectAddress}
                                          forForm
                                          containerStyle={{ width: '26rem' }}
                                          dataTest="selectExistingAddress"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Col>
                              <Col size={12} sm={9} md={8} xl={12}>
                                <div
                                  styleName={classNames('addressFormWrap', {
                                    isEmptyDeliveryAddressesFull,
                                  })}
                                >
                                  {!isEmptyDeliveryAddressesFull && (
                                    <RadioButton
                                      id="newAddressCheckbox"
                                      label={
                                        t.labelOrFillFieldsBelowAndSaveAsAddress
                                      }
                                      isChecked={selectedAddress === null}
                                      onChange={this.handleOnChangeAddressType}
                                    />
                                  )}
                                  {selectedAddress === null && (
                                    <Fragment>
                                      <div
                                        id="deliveryAddress"
                                        styleName="addressForm"
                                      >
                                        <AddressForm
                                          isOpen
                                          onChangeData={this.handleChangeData}
                                          country={deliveryAddress.country}
                                          address={deliveryAddress.value}
                                          addressFull={deliveryAddress}
                                        />
                                        <div styleName="addressError">
                                          {errors.deliveryAddress
                                            ? head(errors.deliveryAddress)
                                            : ''}
                                        </div>
                                      </div>
                                      <div styleName="saveAddressCheckbox">
                                        <Checkbox
                                          id="saveAddressCheckbox"
                                          label={t.labelSaveAsANewAddress}
                                          isChecked={saveAsNewAddress}
                                          onChange={
                                            this.handleChangeSaveCheckbox
                                          }
                                        />
                                      </div>
                                    </Fragment>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col size={12} xl={6}>
                          {deliveryAddress &&
                            deliveryAddress.country && (
                              <div styleName="addressInfo">
                                <AddressInfo
                                  addressFull={deliveryAddress}
                                  receiverName={receiverName}
                                  email={me.email}
                                />
                              </div>
                            )}
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div styleName="body">
                  <div styleName="otherWrap">
                    <div styleName="products">
                      <CheckoutProducts
                        addressFull={deliveryAddress}
                        receiverName={receiverName}
                        email={me.email}
                        replaceAddress={this.replaceAddress}
                      />
                    </div>
                    <div styleName="store">
                      <CartStore
                        product={variant}
                        productName={productName}
                        store={baseProduct.store}
                        buyNowData={buyNowData}
                        onChangeCount={this.handleChangeCount}
                        couponCodeValue={couponCodeValue}
                        couponCodeButtonDisabled={couponCodeButtonDisabled}
                        isLoadingCouponButton={isLoadingCouponButton}
                        handleChangeCoupon={this.handleChangeCoupon}
                        handleSetCoupon={this.handleSetCoupon}
                        onDeleteProduct={this.handleDeleteProduct}
                        country={deliveryAddress.country}
                        isShippingAvailable={baseProduct.isShippingAvailable}
                        baseProductId={baseProduct.rawId}
                        onChangeDelivery={this.handleChangeDelivery}
                        deliveryPackage={deliveryPackage}
                        onPackagesFetched={this.handlePackagesFetched}
                        currency={currency}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Col>
            <Col size={12} lg={4} xl={3}>
              <StickyBar>
                <CheckoutSidebar
                  step={step}
                  buyNowData={buyNowData}
                  goToCheckout={this.goToCheckout}
                  isLoadingCheckout={isLoadingCheckout}
                  onCheckout={this.handleCheckout}
                  shippingId={
                    deliveryPackage ? deliveryPackage.shippingId : null
                  }
                  currency={currency}
                />
              </StickyBar>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(Page(BuyNow)),
  graphql`
    fragment BuyNow_baseProduct on BaseProduct {
      id
      rawId
      categoryId
      isShippingAvailable
      name {
        text
        lang
      }
      shortDescription {
        text
        lang
      }
      longDescription {
        text
        lang
      }
      store {
        rawId
        name {
          lang
          text
        }
        rating
        logo
      }
      rating
      currency
      variants {
        all {
          id
          rawId
          photoMain
          additionalPhotos
          price
          preOrder
          preOrderDays
          cashback
          discount
          quantity
          attributes {
            value
            metaField
            attribute {
              id
              name {
                text
                lang
              }
              metaField {
                values
                uiElement
              }
            }
          }
        }
      }
    }
  `,
);
