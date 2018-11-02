// @flow strict

import React from 'react';
// $FlowIgnore
import axios from 'axios';
import { head } from 'ramda';

import { formatPrice, currentCurrency, log } from 'utils';
import { CurrencyPrice } from 'components/common';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import type { CalculateBuyNowType } from '../BuyNow';

import './CheckoutSidebar.scss';

type PropsType = {
  step: number,
  goToCheckout: () => void,
  isLoadingCheckout: boolean,
  buyNowData: CalculateBuyNowType,
  onCheckout: () => void,
};

type StateType = {
  priceUsd: ?number,
};

class CheckoutSidebar extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      priceUsd: null,
    };
  }

  componentDidMount() {
    this.isMount = true;
    axios
      .get('https://api.coinmarketcap.com/v1/ticker/storiqa/')
      .then(({ data }) => {
        const dataObj = head(data);
        if (dataObj && this.isMount) {
          this.setState({ priceUsd: Number(dataObj.price_usd) });
        }
      })
      .catch(error => {
        log.debug(error);
      });
  }

  componentWillUnmount() {
    this.isMount = false;
  }

  isMount = false;

  render() {
    const {
      step,
      goToCheckout,
      isLoadingCheckout,
      buyNowData,
      onCheckout,
    } = this.props;
    const { priceUsd } = this.state;
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
                      buyNowData.totalCost || 0,
                    )} ${currentCurrency()}`}
                  </div>
                </div>
              </Col>
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">Delivery</div>
                  <div styleName="value">
                    {`${formatPrice(
                      buyNowData.deliveryCost || 0,
                    )} ${currentCurrency()}`}
                  </div>
                </div>
              </Col>
              {buyNowData.couponsDiscounts !== 0 && (
                <Col size={12} sm={4} lg={12}>
                  <div styleName="attributeContainer">
                    <div styleName="label">Coupons discount</div>
                    <div styleName="value">
                      {`${formatPrice(
                        buyNowData.couponsDiscounts || 0,
                      )} ${currentCurrency()}`}
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
                      )} ${currentCurrency()}`}
                    </div>
                    {priceUsd != null && (
                      <div styleName="usdPrice">
                        <div styleName="slash">/</div>
                        <CurrencyPrice
                          withLambda
                          reverse
                          fontSize={18}
                          dark
                          price={buyNowData.totalCost || 0}
                          currencyPrice={priceUsd}
                          currencyCode="$"
                          toFixedValue={2}
                        />
                      </div>
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
                isLoadingCheckout || (step === 2 && buyNowData.totalCost === 0)
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

export default CheckoutSidebar;
