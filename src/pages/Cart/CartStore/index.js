// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql, Relay } from 'react-relay';
import { filter, whereEq, toUpper, isEmpty, pathOr } from 'ramda';
import { Link } from 'found';
import uuidv4 from 'uuid/v4';

import { Input, Button } from 'components/common';
import { Rating } from 'components/common/Rating';
import { Icon } from 'components/Icon';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { Container, Row, Col } from 'layout';
import {
  formatPrice,
  getNameText,
  convertSrc,
  log,
  fromRelayError,
  checkCurrencyType,
} from 'utils';

import { SetCouponInCartMutation } from 'relay/mutations';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { MutationParamsType as SetCouponInCartMutationType } from 'relay/mutations/SetCouponInCartMutation';
import type { AllCurrenciesType } from 'types';

import CartProduct from '../CartProduct';

import type { CartStore_store as CartStoreType } from './__generated__/CartStore_store.graphql';

import './CartStore.scss';

import t from './i18n';

type StateType = {
  couponCodeValue: string,
  couponCodeButtonDisabled: boolean,
  isLoadingCouponButton: boolean,
};

type PropsType = {
  onlySelected: ?boolean,
  unselectable: ?boolean,
  store: CartStoreType,
  isOpenInfo: ?boolean,
  withDeliveryCompaniesSelect?: boolean,
  relay: Relay,
  showAlert: (input: AddAlertInputType) => void,
  currency: AllCurrenciesType,
};

/* eslint-disable react/no-array-index-key */
class CartStore extends Component<PropsType, StateType> {
  state = {
    couponCodeValue: '',
    couponCodeButtonDisabled: true,
    isLoadingCouponButton: false,
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
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['store', 'rawId'], this.props);
    const params: SetCouponInCartMutationType = {
      input: {
        clientMutationId: uuidv4(),
        couponCode: this.state.couponCodeValue,
        storeId,
      },
      environment: this.props.relay.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoadingCouponButton: false });
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }

        // $FlowIgnoreMe
        const status400Error = pathOr(null, ['400', 'status'], relayErrors);
        if (status400Error) {
          this.props.showAlert({
            type: 'danger',
            // $FlowIgnoreMe
            text: `${t.error} ${status400Error}`,
            link: { text: t.close },
          });
          return;
        }
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
          text: t.couponApplied,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoadingCouponButton: false }));
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
      },
    };
    SetCouponInCartMutation.commit(params);
  };

  render() {
    const {
      store,
      onlySelected,
      unselectable,
      isOpenInfo,
      withDeliveryCompaniesSelect,
      currency,
    } = this.props;

    const {
      couponCodeValue,
      couponCodeButtonDisabled,
      isLoadingCouponButton,
    } = this.state;
    const { products } = store;
    let filteredProducts = products;
    if (onlySelected) {
      filteredProducts = filter(whereEq({ selected: true }), [...products]);
    }
    if (filteredProducts.length === 0) {
      return null;
    }
    return (
      <div styleName="container">
        {filteredProducts.map((product, idx) => (
          <div key={idx} styleName="divider">
            <CartProduct
              product={product}
              onlySelected={onlySelected}
              unselectable={unselectable}
              isOpenInfo={isOpenInfo}
              withDeliveryCompaniesSelect={withDeliveryCompaniesSelect}
              currency={currency}
            />
          </div>
        ))}
        <div styleName="footer">
          <Container correct>
            <Row alignItems="center">
              <Col size={12} sm={3}>
                <div styleName="storeInfo">
                  <Link to={`/store/${store.rawId}`}>
                    {store.logo ? (
                      <img
                        src={convertSrc(store.logo, 'small')}
                        alt="store_picture"
                        styleName="image"
                      />
                    ) : (
                      <div styleName="noLogo">
                        <Icon type="camera" size={28} />
                      </div>
                    )}
                    <div styleName="store-description">
                      <div styleName="storeName">
                        {getNameText(store.name, 'EN')}
                      </div>
                      <Rating value={store.rating} />
                    </div>
                  </Link>
                </div>
              </Col>
              <Col size={12} sm={6}>
                <div styleName="coupon">
                  <div styleName="couponIcon">
                    <Icon type="coupon" size={28} />
                  </div>
                  <div styleName="couponInput">
                    <Input
                      id="couponInput"
                      inline
                      fullWidth
                      value={couponCodeValue}
                      onChange={this.handleChangeCoupon}
                    />
                  </div>
                  <div styleName="couponButton">
                    <Button
                      small
                      disabled={couponCodeButtonDisabled}
                      onClick={this.handleSetCoupon}
                      isLoading={isLoadingCouponButton}
                      dataTest="couponButton"
                    >
                      {t.applyCode}
                    </Button>
                  </div>
                </div>
              </Col>
              <Col size={12} sm={3}>
                <div styleName="storeTotal">
                  <div styleName="storeTotalWrapper">
                    <div styleName="label">{t.subtotal}</div>
                    {Boolean(store.couponsDiscount) && (
                      <div styleName="value">
                        <thin styleName="through">
                          {`${formatPrice(
                            store.totalCostWithoutDiscounts || 0,
                            checkCurrencyType(currency) === 'fiat'
                              ? 2
                              : undefined,
                          )} ${currency || ''}`}
                        </thin>
                      </div>
                    )}
                    <div styleName="value">
                      {`${formatPrice(
                        store.totalCost || 0,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )} ${currency || ''}`}
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(CartStore),
  graphql`
    fragment CartStore_store on CartStore {
      id
      rawId
      productsCost
      deliveryCost
      totalCost
      totalCount
      totalCostWithoutDiscounts
      couponsDiscount
      products {
        id
        rawId
        selected
        ...CartProduct_product
      }
      name {
        lang
        text
      }
      rating
      logo
    }
  `,
);
