// @flow strict

import React from 'react';
// $FlowIgnoreMe
import axios from 'axios';
import PropTypes from 'prop-types';
import { head } from 'ramda';

import { formatPrice, currentCurrency, log } from 'utils';
import { CurrencyPrice } from 'components/common';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

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
    deliveryCost: number,
    totalCost: number,
    totalCount: number,
    couponsDiscounts: number,
  },
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
        return true;
      })
      .catch(error => {
        log.debug(error);
      });
  }

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
    } = this.props;
    const { priceUsd } = this.state;
    const {
      productsCostWithoutDiscounts,
      deliveryCost,
      totalCost,
      totalCount,
      couponsDiscounts,
    } = cart;

    let onClickFunction = onClick;

    if (step != null) {
      onClickFunction = step === 1 ? goToCheckout : onCheckout;
    }

    return (
      <div>
        <div styleName="paperWrapper">
          <div styleName="corner tl" />
          <div styleName="paper" />
          <div styleName="corner tr" />
        </div>
        <div styleName="container">
          <div styleName="title">{t.paymentMethod}</div>
          <div styleName="title">{t.subtotal}</div>
          <div styleName="totalsContainer">
            <Row>
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">{t.subtotal}</div>
                  <div styleName="value">
                    {productsCostWithoutDiscounts &&
                      `${formatPrice(
                        productsCostWithoutDiscounts || 0,
                      )} ${currentCurrency()}`}
                  </div>
                </div>
              </Col>
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">{t.delivery}</div>
                  <div styleName="value">
                    {deliveryCost &&
                      `${formatPrice(deliveryCost || 0)} ${currentCurrency()}`}
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
                      )} ${currentCurrency()}`}
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
                        `${formatPrice(totalCost || 0)} ${currentCurrency()}`}
                    </div>
                    {priceUsd != null && (
                      <div styleName="usdPrice">
                        <div styleName="slash">/</div>
                        <CurrencyPrice
                          withTilda
                          withSlash
                          reverse
                          fontSize={18}
                          dark
                          price={totalCost || 0}
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

export default CheckoutSidebar;
