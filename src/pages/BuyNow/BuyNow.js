// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql, Relay } from 'react-relay';
import {filter, find, head, map, propEq, pathOr, toUpper} from 'ramda';
import { routerShape } from 'found';

import { Page } from 'components/App';
import { withShowAlert } from 'components/App/AlertContext';
import { Container, Row, Col } from 'layout';
import { Input, RadioButton, Select, Checkbox } from 'components/common';
import { AddressForm } from 'components/AddressAutocomplete';
import { StickyBar } from 'components/StickyBar';
import { log, getNameText, currentCurrency } from 'utils';
import { BuyNowMutation } from 'relay/mutations';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { AddressFullType, SelectItemType } from 'types';
import type { MutationParamsType } from 'relay/mutations/BuyNowMutation';

import Header from './Header';
import AddressInfo from './AddressInfo';
import CheckoutProducts from './CheckoutProducts';
import CartStore from './CartStore';
import CheckoutSidebar from './CheckoutSidebar';
import { addressesToSelect } from './utils';
import fetchBuyNow from './fetchBuyNow';

import './BuyNow.scss';

const emptyAddressFull = {
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

type DeliveryAddressType = {
  id: string,
  address: AddressFullType,
  isPriority: boolean,
};

export type CalculateBuyNow = {
  couponsDiscounts: number,
  totalCost: number,
  totalCostWithoutDiscounts: number,
  totalCount: number,
};

type StateType = {
  step: number,
  receiverName: string,
  phone: string,
  addresses: Array<SelectItemType>,
  selectedAddress: ?SelectItemType,
  deliveryAddress: AddressFullType,
  saveAsNewAddress: boolean,
  buyNowData: CalculateBuyNow,
  changeCountLoading: boolean,
  couponCodeValue: string,
  successCouponCodeValue: ?string,
  couponCodeButtonDisabled: boolean,
  isLoadingCouponButton: boolean,
  isLoadingCheckout: boolean,
};

type PropsType = {
  me: {
    firstName: string,
    lastName: string,
    phone: string,
    email: string,
    deliveryAddressesFull: Array<DeliveryAddressType>,
  },
  baseProduct: any,
  calculateBuyNow: CalculateBuyNow,
  showAlert: (input: AddAlertInputType) => void,
  relay: Relay,
  router: routerShape,
};

class BuyNow extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { me, calculateBuyNow } = props;
    const { couponsDiscounts, totalCost, totalCostWithoutDiscounts, totalCount } = calculateBuyNow;
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
      saveAsNewAddress: !selectedAddress,
      buyNowData: {
        couponsDiscounts,
        totalCost,
        totalCostWithoutDiscounts,
        totalCount
      },
      changeCountLoading: false,
      couponCodeValue: '',
      successCouponCodeValue: null,
      couponCodeButtonDisabled: true,
      isLoadingCouponButton: false,
      isLoadingCheckout: false,
    };
  }

  getDefaultSelectedDeliveryAddress = () => {
    const { me } = this.props;
    const { deliveryAddressesFull } = me;
    const addresses = addressesToSelect(deliveryAddressesFull);
    return find(propEq('id', '0'))(addresses) || head(addresses) || null;
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
          (selectedAddress && selectedAddress.id === '0' && addressItem.isPriority) ||
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
    this.setState({
      selectedAddress: selectedAddress || null,
      deliveryAddress: this.getDeliveryAddress(selectedAddress),
    });
  };

  handleChangeSaveCheckbox = () => {
    this.setState((prevState: StateType) => ({ saveAsNewAddress: !prevState.saveAsNewAddress }));
  };

  handleChangeData = (addressFullData: AddressFullType): void => {
    this.setState({ deliveryAddress: addressFullData });
  };

  handleChangeStep = (step: number) => {
    this.setState({ step });
  };

  handleCheckout = () => {
    this.setState({ isLoadingCheckout: true });
    const { deliveryAddress, receiverName, phone, successCouponCodeValue } = this.state;
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    let input = {
      clientMutationId: '',
      productId: parseFloat(queryParams.variant),
      quantity: parseFloat(queryParams.quantity),
      addressFull: deliveryAddress,
      receiverName,
      receiverPhone: phone,
      currency: currentCurrency(),
    };
    if (successCouponCodeValue) {
      input = { ...input, couponCode: successCouponCodeValue };
    }
    const params: MutationParamsType = {
      input,
      environment: this.props.relay.environment,
      onCompleted: (response, errors) => {
        this.setState({ isLoadingCheckout: false });
        log.debug('Success for BuyNowMutation');
        if (response && response.buyNow) {
          log.debug('Response: ', response);
          this.props.showAlert({
            type: 'success',
            text: 'Orders successfully created',
            link: { text: 'Close.' },
          });
          const responseOrders = pathOr(
            null,
            ['invoice', 'orders'],
            response.buyNow,
          );
          const order = responseOrders[0];
          this.props.router.push(
            `/profile/orders/${order.slug}/payment-info`,
          );
        } else if (!errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Error :(',
            link: { text: 'Close.' },
          });
        } else {
          log.debug('Errors: ', errors);
          this.props.showAlert({
            type: 'danger',
            text: 'Error :(',
            link: { text: 'Close.' },
          });
        }
      },
      onError: error => {
        this.setState({ isLoadingCheckout: false });
        log.error('Error in BuyNowMutation');
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something went wrong :(',
          link: { text: 'Close.' },
        });
      },
    };
    BuyNowMutation.commit(params);
  };

  checkReadyToCheckout = (): boolean => {
    return true;
  };

  handleChangeCount = (quantity: number) => {
    if (this.state.changeCountLoading) {
      return;
    }
    this.setState({ changeCountLoading: true });
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    const variables = {
      productId: parseFloat(queryParams.variant),
      quantity,
    };
    fetchBuyNow(this.props.relay.environment, variables)
      .then(({ calculateBuyNow }) => {
        const { couponsDiscounts, totalCost, totalCostWithoutDiscounts, totalCount } = calculateBuyNow;
        this.setState({
          buyNowData: {
            couponsDiscounts,
            totalCost,
            totalCostWithoutDiscounts,
            totalCount,
          },
          changeCountLoading: false,
        }, () => {
          this.props.router.replace(
            `/buy-now?product=${queryParams.product}&variant=${queryParams.variant}&quantity=${quantity}`,
          );
        });
      })
      .catch(() => {
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
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
    this.setState({
      isLoadingCouponButton: true,
      successCouponCodeValue: null,
    });
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    const { couponCodeValue } = this.state;
    const variables = {
      productId: parseFloat(queryParams.variant),
      quantity: parseFloat(queryParams.quantity),
      couponCode: couponCodeValue,
    };
    fetchBuyNow(this.props.relay.environment, variables)
      .then(({ calculateBuyNow }) => {
        if (!calculateBuyNow) {
          throw new Error('Coupon nor found!');
        }
        const { couponsDiscounts, totalCost, totalCostWithoutDiscounts, totalCount } = calculateBuyNow;
        this.setState({
          buyNowData: {
            couponsDiscounts,
            totalCost,
            totalCostWithoutDiscounts,
            totalCount,
          },
          successCouponCodeValue: couponCodeValue,
          isLoadingCouponButton: false,
        }, () => {
          this.props.showAlert({
            type: 'success',
            text: 'Сoupon applied!',
            link: { text: '' },
          });
        });
      })
      .catch((error: string) => {
        this.props.showAlert({
          type: 'danger',
          text: `${error} :(`,
          link: { text: 'Close.' },
        });
        this.setState({ isLoadingCouponButton: false });
      });
  };

  handleDeleteProduct = () => {
    // $FlowIgnore
    const storeId = pathOr(null, ['baseProduct', 'store', 'rawId'], this.props);
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    this.props.router.push(
      `/store/${storeId}/products/${queryParams.product}`,
    );
  };

  render() {
    console.log('---this.props', this.props);
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
    } = this.state;
    // $FlowIgnore
    const queryParams = pathOr([], ['match', 'location', 'query'], this.props);
    // $FlowIgnore
    const variants = pathOr([], ['variants', 'all'], baseProduct);
    const variant = find(propEq('rawId', parseFloat(queryParams.variant)))(variants);
    const productName = getNameText(baseProduct.name, 'EN');
    console.log('---this.state', this.state);

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
            <Col
              size={12}
              lg={step !== 3 ? 8 : 12}
              xl={step !== 3 ? 9 : 12}
            >
              {step === 1 &&
                <div styleName="body">
                  <div styleName="addressWrap">
                    <Container correct>
                      <Row>
                        <Col size={12} xl={6}>
                          <div styleName="address">
                            <Row>
                              <Col size={12}>
                                <div styleName="title">Delivery info</div>
                                <div styleName="receiverItem">
                                  <Input
                                    fullWidth
                                    id="receiverName"
                                    label={
                                      <span>
                                        Receiver name <span styleName="red">*</span>
                                      </span>
                                    }
                                    onChange={this.handleChangeReceiver}
                                    value={receiverName}
                                    limit={50}
                                  />
                                </div>
                                <div styleName="receiverItem">
                                  <Input
                                    fullWidth
                                    id="receiverPhone"
                                    label={
                                      <span>
                                        Receiver phone <span styleName="red">*</span>
                                      </span>
                                    }
                                    onChange={this.handleChangePhone}
                                    value={phone}
                                    limit={50}
                                  />
                                </div>
                                <div styleName="selectItem">
                                  <RadioButton
                                    id="existingAddressCheckbox"
                                    label="Choose your address"
                                    isChecked={selectedAddress !== null}
                                    onChange={this.handleOnChangeAddressType}
                                  />
                                  {selectedAddress !== null && (
                                    <div styleName="select">
                                      <Select
                                        label="Address"
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
                              </Col>
                              <Col size={12} xlHidden>
                                {deliveryAddress && (
                                  <AddressInfo
                                    addressFull={deliveryAddress}
                                    receiverName={receiverName}
                                    email={me.email}
                                  />
                                )}
                              </Col>
                              <Col size={12} sm={9} md={8} xl={12}>
                                <div styleName="addressFormWrap">
                                  <RadioButton
                                    id="newAddressCheckbox"
                                    label="Or fill fields below and save as address"
                                    isChecked={selectedAddress === null}
                                    onChange={this.handleOnChangeAddressType}
                                  />
                                  {selectedAddress === null && (
                                    <div styleName="addressForm">
                                      <AddressForm
                                        isOpen
                                        onChangeData={this.handleChangeData}
                                        country={deliveryAddress.country}
                                        address={deliveryAddress.value}
                                        addressFull={deliveryAddress}
                                      />
                                      <div styleName="saveAddressCheckbox">
                                        <Checkbox
                                          id="saveAddressCheckbox"
                                          label="Save as a new address"
                                          isChecked={saveAsNewAddress}
                                          onChange={this.handleChangeSaveCheckbox}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                        <Col size={6} xlVisibleOnly>
                          {deliveryAddress.country && (
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
              }
              {step === 2 &&
                <div styleName="body">
                  <div styleName="otherWrap">
                    <div styleName="products">
                      <CheckoutProducts
                        addressFull={deliveryAddress}
                        receiverName={receiverName}
                        email={me.email}
                        onChangeStep={this.handleChangeStep}
                      />
                    </div>
                    <div styleName="store">
                      <CartStore
                        onlySelected
                        unselectable
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

                        totals={1000}
                      />
                    </div>
                  </div>
                </div>
              }
            </Col>
            <Col size={12} lg={4} xl={3}>
              <StickyBar>
                <CheckoutSidebar
                  step={step}
                  buyNowData={buyNowData}
                  onChangeStep={this.handleChangeStep}
                  isReadyToClick={this.checkReadyToCheckout()}
                  isLoadingCheckout={isLoadingCheckout}
                  onCheckout={this.handleCheckout}
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
