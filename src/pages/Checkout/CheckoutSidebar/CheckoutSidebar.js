// @flow

import React from 'react';
import { pathOr, map } from 'ramda';

import { formatPrice } from 'utils';
import { Button } from 'components/common/Button';

import { calcTotal } from '../utils';

import './CheckoutSidebar.scss';

class CheckoutSidebar extends React.Component<PropsType> {
  state = {
    step: 1,
  };

  // getCartTotalCount = (stores) => {
  //   const { cart } = this.props;
  //   const stores = map(i => i.node, pathOr([], ['stores', 'edges'], cart));
  //   return calcCartTotalCout(stores);
  // }

  // getCartTotalCost =(stores) => {
  //   const { cart } = this.props;
  // }

  render() {
    const { cart } = this.props;
    const stores = map(i => i.node, pathOr([], ['stores', 'edges'], cart));
    return (
      <div className="">
        <div styleName="container">
          <div styleName="title">Subtotal</div>
          <div styleName="totalsContainer">
            <div styleName="attributeContainer">
              <div styleName="label">Subtotal</div>
              <div styleName="value">
                {`${formatPrice(calcTotal(stores, 'productsCost') || 0)} STQ`}
              </div>
            </div>
            <div styleName="attributeContainer">
              <div styleName="label">Delivery</div>
              <div styleName="value">
                {`${formatPrice(calcTotal(stores, 'deliveryCost') || 0)} STQ`}
              </div>
            </div>
            <div styleName="attributeContainer">
              <div styleName="label">
                Total{' '}
                <span styleName="subLabel">
                  ({calcTotal(stores, 'totalCount')} items)
                </span>
              </div>
              <div styleName="value">
                {`${formatPrice(calcTotal(stores, 'totalCost') || 0)} STQ`}
              </div>
            </div>
          </div>
          <div styleName="checkout">
            <Button id="cartTotalCheckout" disabled={!100} big>
              Checkout
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default CheckoutSidebar;
