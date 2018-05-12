// @flow

import React, { Component } from 'react';
import cn from 'classnames';
import { Button } from 'components/common/Button';
import { pipe, values, reduce } from 'ramda';
import { Checkbox } from 'components/common/Checkbox';

import master from './png/master.png';
import visa from './png/visa.png';
import btc from './png/btc.png';
import eth from './png/eth.png';
import stq from './png/stq.png';
import CartProductAttribute from './CartProductAttribute';

import './CartTotal.scss';

const STICKY_THRESHOLD_REM = 90;

type Totals = { [storeId: string]: { productsCost: number, deliveryCost: number, totalCount: number }}

type PropsType = {
  storesRef: ?Object;
  totals: Totals;
};

type StateType = {
  currentClass: 'sticky' | 'top' | 'bottom',
};

const STICKY_PADDING_TOP_REM = 2;
const STICKY_PADDING_BOTTOM_REM = 2;

class CartTotal extends Component<PropsType, StateType> {
  state = {
    currentClass: 'top',
  };

  componentDidMount() {
    if (!window) return;
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  componentWillUnmount() {
    if (!window) return;
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  setRef(ref: ?Object) {
    this.ref = ref;
  }

  ref: ?Object;

  handleScroll() {
    if (!window) return;
    if (!this.ref || !this.props.storesRef) return;
    const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const offset = window.pageYOffset;
    // $FlowIgnoreMe
    const rect = this.ref.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    // $FlowIgnoreMe
    const { top: viewTop, bottom: viewBottom } = this.props.storesRef.getBoundingClientRect();
    if ((viewBottom - viewTop) < STICKY_THRESHOLD_REM * rem) {
      if (this.state.currentClass !== 'top') {
        this.setState({ currentClass: 'top' });
      }
      return;
    }
    const top = viewTop + (offset - (STICKY_PADDING_TOP_REM * rem));
    const bottom = viewBottom +
      (offset - ((STICKY_PADDING_TOP_REM + STICKY_PADDING_BOTTOM_REM) * rem));
    let currentClass = 'top';
    if (offset >= top) { currentClass = 'sticky'; }
    if (offset + height >= bottom) { currentClass = 'bottom'; }
    if (this.ref.className !== currentClass) { this.ref.className = currentClass };
  }

  render() {
    const totals = pipe(
      values,
      reduce((acc, elem) => ({
        productsCost: acc.productsCost + elem.productsCost,
        deliveryCost: acc.deliveryCost + elem.deliveryCost,
        totalCount: acc.totalCount + elem.totalCount,
      }), { productsCost: 0, deliveryCost: 0, totalCount: 0 }),
    )(this.props.totals);
    const { productsCost, deliveryCost, totalCount } = totals;
    return (
      <div className="top" ref={ref => this.setRef(ref)}>
        <div styleName="container">
          <div styleName="cart-total-title">
            Total
          </div>
          <div styleName="payments-container">
            <div styleName="value">
              Payment methods
            </div>
            <div styleName="payments-group">
              <div styleName="title">
                My cards
              </div>
              <div styleName="payment-option">
                <Checkbox isChecked={false} />
                <div styleName="payment-option-value">
                  5504 84** **** 3452
                </div>
                <div styleName="payment-option-icon">
                  <img src={master} alt="master card" />
                </div>
              </div>
              
              <div styleName="payment-option">
                <Checkbox isChecked={false} />
                <div styleName="payment-option-value">
                  5504 84** **** 5824
                </div>
                <div styleName="payment-option-icon">
                  <img src={visa} alt="visa" />
                </div>
              </div>
            </div>

            <div styleName="payments-group">
              <div styleName="title">
                Crypto payments
              </div>
              <div styleName="payment-option">
                <Checkbox isChecked />
                <div styleName="payment-option-value">
                  STQ
                </div>
                <div styleName="payment-option-icon">
                  <img src={stq} alt="stq" />
                </div>
              </div>
              
              <div styleName="payment-option">
                <Checkbox isChecked={false} />
                <div styleName="payment-option-value">
                  BTC
                </div>
                <div styleName="payment-option-icon">
                  <img src={btc} alt="btc" />
                </div>
              </div>

              <div styleName="payment-option">
                <Checkbox isChecked={false} />
                <div styleName="payment-option-value">
                  ETH
                </div>
                <div styleName="payment-option-icon">
                  <img src={eth} alt="eth" />
                </div>
              </div>
            </div>
          </div>
          <div styleName="totals-container">
            <CartProductAttribute title="Products cost" value={`${productsCost} STQ`} />
            <CartProductAttribute title="Delivery cost" value={`${deliveryCost} STQ`} />
            <CartProductAttribute 
              title={<div><span>Total</span><span style={{color: '#8fb62c'}}>{` (${totalCount} items)`}</span></div>} 
              value={`${productsCost + deliveryCost} STQ`}
            />
          </div>
          <div styleName="checkout">
            <Button disabled big>Checkout</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CartTotal;
