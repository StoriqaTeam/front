// @flow strict

import React, { PureComponent } from 'react';
import { routerShape, withRouter } from 'found';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

import './CartEmpty.scss';

import t from './i18n';

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
            {t.currentlyCartIsEmpty}<br />{t.goToMarketAndPlaceSomeGoods}
          </div>
          <div styleName="button">
            <Button big wireframe onClick={this.onClick}>
              {t.goToMarket}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CartEmpty);
