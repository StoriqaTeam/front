// @flow strict

import React from 'react';
import PropTypes from 'prop-types';

import { formatPrice, getExchangePrice, checkCurrencyType } from 'utils';
import { ContextDecorator } from 'components/App';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import type { DirectoriesType, AllCurrenciesType } from 'types';

import './CheckoutSidebar.scss';

import t from './i18n';

type PropsType = {
  onClick: () => void,
  onCheckout: () => void,
  isReadyToClick: () => boolean,
  buttonText: string,
  checkoutInProcess: boolean,
  goToCheckout: () => void,
  step?: number,
  cart: {
    productsCostWithoutDiscounts: number,
    productsCost: number,
    deliveryCost: number,
    totalCost: number,
    totalCount: number,
    couponsDiscounts: number,
  },
  directories: DirectoriesType,
  currency: AllCurrenciesType,
};

class CheckoutSidebar extends React.PureComponent<PropsType> {
  // $FlowIgnoreMe
  setRef(ref: ?Object) {
    this.ref = ref;
  }

  // $FlowIgnoreMe
  setWrapperRef(ref: ?Object) {
    this.wrapperRef = ref;
  }

  isMount = false;
  ref: ?{ className: string };
  // $FlowIgnoreMe
  wrapperRef: any;
  scrolling: boolean;
  handleScroll: () => void;
  scrolling = false;

  render() {
    const {
      onClick,
      onCheckout,
      isReadyToClick,
      buttonText,
      checkoutInProcess,
      goToCheckout,
      step,
      cart,
      currency,
    } = this.props;
    const {
      productsCost,
      deliveryCost,
      totalCost,
      totalCount,
      couponsDiscounts,
    } = cart;
    let onClickFunction = onClick;

    if (step != null) {
      onClickFunction = step === 1 ? goToCheckout : onCheckout;
    }

    const { currencyExchange } = this.props.directories;

    const currentCurrency = currency;

    const exchangePrice =
      currentCurrency === ''
        ? ''
        : getExchangePrice({
            price: totalCost,
            currency: currentCurrency,
            currencyExchange,
            withSymbol: true,
          });

    return (
      <div>
        <div styleName="paperWrapper">
          <div styleName="corner tl" />
          <div styleName="paper" />
          <div styleName="corner tr" />
        </div>
        <div styleName="container">
          <div styleName="title">{t.subtotal}</div>
          <div styleName="totalsContainer">
            <Row>
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">{t.subtotal}</div>
                  <div styleName="value">
                    {productsCost &&
                      `${formatPrice(
                        productsCost || 0,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )} ${currency || ''}`}
                  </div>
                </div>
              </Col>
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">{t.delivery}</div>
                  <div styleName="value">
                    {deliveryCost &&
                      `${formatPrice(
                        deliveryCost || 0,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )} ${currency || ''}`}
                  </div>
                </div>
              </Col>
              {Boolean(couponsDiscounts) && (
                <Col size={12} sm={4} lg={12}>
                  <div styleName="attributeContainer">
                    <div styleName="label">{t.couponsDiscount}</div>
                    <div styleName="value">
                      {`−${formatPrice(
                        couponsDiscounts || 0,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )} ${currency || ''}`}
                    </div>
                  </div>
                </Col>
              )}
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">
                    {t.total}{' '}
                    <span styleName="subLabel">
                      ({totalCount && totalCount} {t.items})
                    </span>
                  </div>
                  <div styleName="totalCost">
                    <div styleName="value bold">
                      {totalCost &&
                        `${formatPrice(
                          totalCost || 0,
                          checkCurrencyType(currency) === 'fiat'
                            ? 2
                            : undefined,
                        )} ${currency || ''}`}
                    </div>
                    {exchangePrice != null && (
                      <div styleName="exchangePrice">{exchangePrice}</div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div styleName="checkout">
            <Button
              id="cartTotalCheckout"
              disabled={checkoutInProcess || !isReadyToClick}
              isLoading={checkoutInProcess}
              big
              onClick={onClickFunction}
              dataTest="checkoutNext"
            >
              {buttonText}
            </Button>
          </div>
        </div>
        <div styleName="paperWrapper">
          <div styleName="corner bl" />
          <div styleName="paper bottom" />
          <div styleName="corner br" />
        </div>
      </div>
    );
  }
}

CheckoutSidebar.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default ContextDecorator(CheckoutSidebar);
