import React, { PureComponent } from 'react';

import { Icon } from 'components/Icon';

import './CartButton.scss';

type PropsTypes = {
  amount: number,
  href: number,
};

class CartButton extends PureComponent<PropsTypes> {
  render() {
    const { amount, href } = this.props;

    return (
      <a href={href} styleName="container">
        {amount && <div styleName="amount">{amount}</div>}
        <div styleName="icon">
          <Icon type="cart" size="16" />
        </div>
      </a>
    );
  }
}

export default CartButton;
