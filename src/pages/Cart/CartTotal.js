// @flow

import React, { Component } from 'react';
import { Button } from 'components/common/Button';
import { pipe, values, reduce } from 'ramda';
import { Checkbox } from 'components/common/Checkbox';
import { formatPrice } from 'utils';

import CartProductAttribute from './CartProductAttribute';

import './CartTotal.scss';

const STICKY_THRESHOLD_REM = 90;

type Totals = {
  [storeId: string]: {
    productsCost: number,
    deliveryCost: number,
    totalCount: number,
  },
};

type PropsType = {
  storesRef: ?Object,
  totals: Totals,
};

type StateType = {
  currentClass: 'sticky' | 'top' | 'bottom',
};

const STICKY_PADDING_TOP_REM = 2;
const STICKY_PADDING_BOTTOM_REM = 2;

class CartTotal extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.handleScroll = this.handleScrollEvent.bind(this);
  }

  state = {
    currentClass: 'top',
  };

  componentDidMount() {
    if (!window) return;
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    if (!window) return;
    window.removeEventListener('scroll', this.handleScroll);
  }

  setRef(ref: ?Object) {
    this.ref = ref;
  }

  ref: ?{ className: string };
  scrolling: boolean;
  handleScroll: () => void;
  scrolling = false;

  updateStickiness() {
    if (!window) return;
    if (!this.ref || !this.props.storesRef) return;
    const rem = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    );
    const offset = window.pageYOffset;
    // $FlowIgnoreMe
    const rect = this.ref.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    const {
      top: viewTop,
      bottom: viewBottom,
      // $FlowIgnoreMe
    } = this.props.storesRef.getBoundingClientRect();
    if (viewBottom - viewTop < STICKY_THRESHOLD_REM * rem) {
      if (this.state.currentClass !== 'top') {
        this.setState({ currentClass: 'top' });
      }
      return;
    }
    const top = viewTop + (offset - STICKY_PADDING_TOP_REM * rem);
    const bottom =
      viewBottom +
      (offset - (STICKY_PADDING_TOP_REM + STICKY_PADDING_BOTTOM_REM) * rem);
    let currentClass = 'top';
    if (offset >= top) {
      currentClass = 'sticky';
    }
    if (offset + height >= bottom) {
      currentClass = 'bottom';
    }
    // $FlowIgnoreMe
    if (this.ref.className !== currentClass) {
      // $FlowIgnoreMe
      this.ref.className = currentClass;
    }
  }

  handleScrollEvent() {
    if (!this.scrolling) {
      window.requestAnimationFrame(() => {
        this.updateStickiness();
        this.scrolling = false;
      });
      this.scrolling = true;
    }
  }

  render() {
    const totals = pipe(
      values,
      reduce(
        (acc, elem) => ({
          productsCost: acc.productsCost + elem.productsCost,
          deliveryCost: acc.deliveryCost + elem.deliveryCost,
          totalCount: acc.totalCount + elem.totalCount,
        }),
        { productsCost: 0, deliveryCost: 0, totalCount: 0 },
      ),
    )(this.props.totals);
    const { productsCost, deliveryCost, totalCount } = totals;
    return (
      <div className="top" ref={ref => this.setRef(ref)}>
        <div styleName="container">
          <div styleName="cart-total-title">Total</div>
          <div styleName="payments-container">
            <div styleName="value">Payment methods</div>
            {/* <div styleName="payments-group">
              <div styleName="title">My cards</div>
              <div styleName="payment-option">
                <Checkbox isChecked={false} />
                <div styleName="payment-option-value">5504 84** **** 3452</div>
                <div styleName="payment-option-icon">
                  <img
                    // eslint-disable-next-line
                    src={require('./png/master.png')}
                    alt="master card"
                  />
                </div>
              </div>

              <div styleName="payment-option">
                <Checkbox isChecked={false} />
                <div styleName="payment-option-value">5504 84** **** 5824</div>
                <div styleName="payment-option-icon">
                  <img
                    // eslint-disable-next-line
                    src={require('./png/visa.png')}
                    alt="visa"
                  />
                </div>
              </div>
            </div> */}

            <div styleName="payments-group">
              <div styleName="title">Crypto payments</div>
              <div styleName="payment-option">
                <Checkbox isChecked />
                <div styleName="payment-option-value">STQ</div>
                <div styleName="payment-option-icon">
                  <img
                    // eslint-disable-next-line
                    src={require('./png/stq.png')}
                    alt="stq"
                  />
                </div>
              </div>

              <div styleName="payment-option">
                <Checkbox isChecked={false} />
                <div styleName="payment-option-value">BTC</div>
                <div styleName="payment-option-icon">
                  <img
                    // eslint-disable-next-line
                    src={require('./png/btc.png')}
                    alt="btc"
                  />
                </div>
              </div>

              <div styleName="payment-option">
                <Checkbox isChecked={false} />
                <div styleName="payment-option-value">ETH</div>
                <div styleName="payment-option-icon">
                  <img
                    // eslint-disable-next-line
                    src={require('./png/eth.png')}
                    alt="eth"
                  />
                </div>
              </div>
            </div>
          </div>
          <div styleName="totals-container">
            <CartProductAttribute
              title="Products cost"
              value={`${formatPrice(productsCost || 0)} STQ`}
            />
            <CartProductAttribute
              title="Delivery cost"
              value={`${formatPrice(deliveryCost || 0)} STQ`}
            />
            <CartProductAttribute
              title={
                <div>
                  <span>Total</span>
                  <span style={{ color: '#8fb62c' }}>
                    {` (${totalCount} items)`}
                  </span>
                </div>
              }
              value={`${formatPrice(productsCost + deliveryCost || 0)} STQ`}
            />
          </div>
          <div styleName="checkout">
            <Button disabled={!totalCount} big>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CartTotal;
