// @flow

import React, { PureComponent } from 'react';
import { routerShape, withRouter } from 'found';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

import './CartEmpty.scss';

type PropsType = {
  router: routerShape,
};

class CartEmpty extends PureComponent<PropsType> {
  onClick = () => {
    this.props.router.push('/');
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="wrap">
          <div styleName="icon">
            <Icon type="emptyCart" size={120} />
          </div>
          <div styleName="text">
            Currently your is empty.<br />Go to market and place some goods in
            your cart.
          </div>
          <div styleName="button">
            <Button big wireframe onClick={this.onClick}>
              Go to market
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CartEmpty);
