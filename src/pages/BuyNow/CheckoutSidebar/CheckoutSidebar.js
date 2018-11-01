// @flow

import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { head, pathOr } from 'ramda';

import { formatPrice, currentCurrency, log } from 'utils';
import { CurrencyPrice } from 'components/common';
import { Button } from 'components/common/Button';
import { Row, Col } from 'layout';

import type { CalculateBuyNow } from '../BuyNow';

import './CheckoutSidebar.scss';

type PropsType = {
  step: number,
  onChangeStep: (step: number) => void,
  isReadyToClick: Function,
  isLoadingCheckout: boolean,
  buyNowData: CalculateBuyNow,
  onCheckout: () => void,
};

type StateType = {
  productsCost: number,
  deliveryCost: number,
  totalCount: number,
  totalCost: number,
  couponsDiscounts: number,
  priceUsd: ?number,
};

// const TOTAL_FRAGMENT = graphql`
//   fragment CheckoutSidebarTotalLocalFragment on Cart {
//     id
//     productsCost
//     deliveryCost
//     totalCount
//     totalCost
//     couponsDiscounts
//   }
// `;

class CheckoutSidebar extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      productsCost: 0,
      deliveryCost: 0,
      totalCount: 0,
      totalCost: 0,
      couponsDiscounts: 0,
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

    // const store = this.context.environment.getStore();
    // const cartId = pathOr(
    //   null,
    //   ['cart', '__ref'],
    //   store.getSource().get('client:root'),
    // );
    // const queryNode = TOTAL_FRAGMENT.data();
    // const snapshot = store.lookup({
    //   dataID: cartId,
    //   node: queryNode,
    // });
    // const { dispose } = store.subscribe(snapshot, s => {
    //   this.updateTotal(s.data);
    // });
    // this.updateTotal(snapshot.data);
    // this.dispose = dispose;
  }

  componentWillUnmount() {
    if (this.dispose) {
      this.dispose();
    }
    this.isMount = false;
    if (this.dispose) {
      this.dispose();
    }
  }

  setRef(ref: ?Object) {
    this.ref = ref;
  }

  setWrapperRef(ref: ?Object) {
    this.wrapperRef = ref;
  }

  isMount = false;

  updateTotal = (data: {
    productsCost: number,
    deliveryCost: number,
    totalCost: number,
    totalCount: number,
    couponsDiscounts: number,
  }) => {
    const {
      productsCost,
      deliveryCost,
      totalCost,
      totalCount,
      couponsDiscounts,
    } = data;
    this.setState({
      productsCost,
      deliveryCost,
      totalCost,
      totalCount,
      couponsDiscounts,
    });
  };

  dispose: Function;
  ref: ?{ className: string };
  wrapperRef: any;
  scrolling: boolean;
  handleScroll: () => void;
  scrolling = false;

  render() {
    const {
      step,
      onChangeStep,
      isReadyToClick,
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
                    {`${formatPrice(buyNowData.totalCost || 0)} ${currentCurrency()}`}
                  </div>
                </div>
              </Col>
              <Col size={12} sm={4} lg={12}>
                <div styleName="attributeContainer">
                  <div styleName="label">Delivery</div>
                  <div styleName="value">
                    {`${formatPrice(buyNowData.deliveryCost || 0)} ${currentCurrency()}`}
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
                      {`${formatPrice(buyNowData.totalCost || 0)} ${currentCurrency()}`}
                    </div>
                    {priceUsd && (
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
              disabled={isLoadingCheckout || !isReadyToClick}
              isLoading={isLoadingCheckout}
              big
              onClick={step === 1 ? () => {onChangeStep(2)} : onCheckout}
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

CheckoutSidebar.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default CheckoutSidebar;
