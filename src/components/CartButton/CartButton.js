// @flow

import React, { PureComponent } from 'react';
import { Link } from 'found';

import { Icon } from 'components/Icon';
import { Count } from 'components/Count';

import './CartButton.scss';

type PropsTypes = {
  amount: number,
  href: string,
};

class CartButton extends PureComponent<PropsTypes> {
  render() {
    const { amount, href } = this.props;

    return (
      <Link to={href || '/'} styleName="container">
        {amount &&
          <div styleName="amount">
            <Count amount={amount} type="blue" />
          </div>
        }
        <div styleName="icon">
          <Icon type="cart" size="16" />
        </div>
      </Link>
    );
  }
}

export default CartButton;
