// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'found';
import { path } from 'ramda';

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
    const store = this.context.environment.getStore();
    const root = store.getSource().get('client:root');
    if (!path(['me', '__ref'], root)) {
      return null;
    }
    return (
      <Link to={href || '/'} styleName="container">
        {amount && (
          <div styleName="amount">
            <Count amount={amount} type="blue" />
          </div>
        )}
        <div styleName="icon">
          <Icon type="cart" size="16" />
        </div>
      </Link>
    );
  }
}

CartButton.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default CartButton;
