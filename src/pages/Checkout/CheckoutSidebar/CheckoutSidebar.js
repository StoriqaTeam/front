// @flow strict

import React from 'react';
// $FlowIgnoreMe
import axios from 'axios';
import PropTypes from 'prop-types';
import { graphql } from 'react-relay';
import { head, pathOr } from 'ramda';

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
};

type StateType = {
  productsCostWithoutDiscounts: number,
  deliveryCost: number,
  totalCount: number,
  totalCost: number,
  couponsDiscounts: number,
  priceUsd: ?number,
};

const TOTAL_FRAGMENT = graphql`
  fragment CheckoutSidebarTotalLocalFragment on Cart {
    id
    productsCostWithoutDiscounts
    deliveryCost
    totalCount
    totalCost
    couponsDiscounts
  }
`;

class CheckoutSidebar extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      productsCostWithoutDiscounts: 0,
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

    const store = this.context.environment.getStore();
    const cartId = pathOr(
      null,
      ['cart', '__ref'],
      store.getSource().get('client:root'),
    );
    const queryNode = TOTAL_FRAGMENT.data();
    const snapshot = store.lookup({
      dataID: cartId,
      node: queryNode,
    });
    const { dispose } = store.subscribe(snapshot, s => {
      this.updateTotal(s.data);
    });
    this.updateTotal(snapshot.data);
    this.dispose = dispose;
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

  // $FlowIgnoreMe
  setRef(ref: ?Object) {
    this.ref = ref;
  }

  // $FlowIgnoreMe
  setWrapperRef(ref: ?Object) {
    this.wrapperRef = ref;
  }

  isMount = false;

  updateTotal = (data: {
    productsCostWithoutDiscounts: number,
    deliveryCost: number,
    totalCost: number,
    totalCount: number,
    couponsDiscounts: number,
  }) => {
    const {
      productsCostWithoutDiscounts,
      deliveryCost,
      totalCost,
      totalCount,
      couponsDiscounts,
    } = data;
    this.setState({
      productsCostWithoutDiscounts,
      deliveryCost,
      totalCost,
      totalCount,
      couponsDiscounts,
    });
  };

  // $FlowIgnoreMe
  dispose: Function;
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
    } = this.props;
    const {
      productsCostWithoutDiscounts,
      deliveryCost,
      totalCost,
      totalCount,
      couponsDiscounts,
      priceUsd,
    } = this.state;

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
              {couponsDiscounts !== 0 && (
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
                          withLambda
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
