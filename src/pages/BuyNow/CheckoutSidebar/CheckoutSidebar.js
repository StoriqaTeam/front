// @flow strict

import React, { PureComponent } from 'react';

import { ContextDecorator } from 'components/App';
import { formatPrice, getExchangePrice, checkCurrencyType } from 'utils';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import type { AllCurrenciesType, DirectoriesType } from 'types';
import type { CalculateBuyNowType } from '../BuyNow';

import './CheckoutSidebar.scss';

type PropsType = {
  step: number,
  goToCheckout: () => void,
  isLoadingCheckout: boolean,
  buyNowData: CalculateBuyNowType,
  onCheckout: () => void,
  shippingId: ?number,
  currency: AllCurrenciesType,
  directories: DirectoriesType,
};

class CheckoutSidebar extends PureComponent<PropsType> {
  render() {
    const {
      step,
      goToCheckout,
      isLoadingCheckout,
      buyNowData,
      onCheckout,
      shippingId,
      currency,
      directories,
    } = this.props;
    const { currencyExchange } = directories;

    const exchangePrice = getExchangePrice({
      price: buyNowData.totalCost,
      currency,
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
          <div styleName="title">Subtotal</div>
          <div styleName="totalsContainer">
            <Row>
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">Subtotal</div>
                  <div styleName="value">
                    {`${formatPrice(
                      buyNowData.subtotal || 0,
                      checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                    )} ${currency}`}
                  </div>
                </div>
              </Col>
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">Delivery</div>
                  <div styleName="value">
                    {`${formatPrice(
                      buyNowData.deliveryCost || 0,
                      checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                    )} ${currency}`}
                  </div>
                </div>
              </Col>
              {buyNowData.couponsDiscounts !== 0 && (
                <Col size={12} sm={4} lg={12}>
                  <div styleName="attributeContainer">
                    <div styleName="label">Coupons discount</div>
                    <div styleName="value">
                      {`−${formatPrice(
                        buyNowData.couponsDiscounts || 0,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )} ${currency}`}
                    </div>
                  </div>
                </Col>
              )}
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">
                    Total{' '}
                    <span styleName="subLabel">
                      ({buyNowData.totalCount || 0} items)
                    </span>
                  </div>
                  <div styleName="totalCost">
                    <div styleName="value bold">
                      {`${formatPrice(
                        buyNowData.totalCost || 0,
                        checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                      )} ${currency}`}
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
              disabled={
                isLoadingCheckout ||
                (step === 2 && (buyNowData.totalCost === 0 || !shippingId))
              }
              isLoading={isLoadingCheckout}
              big
              onClick={step === 1 ? goToCheckout : onCheckout}
              dataTest="checkoutNext"
            >
              {step === 1 ? 'Next' : 'Checkout'}
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

export default ContextDecorator(CheckoutSidebar);
