// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
      <Link
        to={href || '/'}
        styleName="container"
        data-test="header-cart-button"
      >
        {Boolean(amount) &&
          amount > 0 && (
            <div styleName="amount">
              <Count
                amount={amount}
                type="blue"
                dataTestId="header-cart-count"
              />
            </div>
          )}
        <div>
          <Icon type="cart" size={32} />
        </div>
      </Link>
    );
  }
}

CartButton.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default CartButton;
