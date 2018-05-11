// @flow

import React, { PureComponent } from 'react';

import { Icon } from 'components/Icon';
import { Count } from 'components/Count';

import './CartButton.scss';

type PropsTypes = {
  amount: number,
  href: number,
};

class CartButton extends PureComponent<PropsTypes> {
  render() {
    const { amount, href } = this.props;

    return (
      <a href={href} styleName="container" data-test="cartLink">
        {amount && (
          <div styleName="amount">
            <Count amount={32} type="blue" />
          </div>
        )}
        <div styleName="icon">
          <Icon type="cart" size="16" />
        </div>
      </a>
    );
  }
}

export default CartButton;
