// @flow

import React, { PureComponent } from 'react';
import { routerShape, withRouter } from 'found';
import { pathOr } from 'ramda';
import type { Environment } from 'relay-runtime';

import { removeCookie } from 'utils';

import Logo from 'components/Icon/svg/logo.svg';

import './LogoutPage.scss';

type PropsType = {
  environment: Environment,
  router: routerShape,
};

class LogoutPage extends PureComponent<PropsType> {
  componentDidMount() {
    if (!process.env.BROWSER) {
      return;
    }
    removeCookie('__jwt');

    const store = this.props.environment.getStore();
    const meId = pathOr(
      null,
      ['me', '__ref'],
      store.getSource().get('client:root'),
    );
    const cartId = pathOr(
      null,
      ['cart', '__ref'],
      store.getSource().get('client:root'),
    );
    if (meId) {
      store.getSource().delete(meId);
    }
    if (cartId) {
      store.getSource().delete(cartId);
    }

    this.props.router.replace('/');
  }

  render() {
    return (
      <div>
        <div styleName="container">
          <div styleName="logo">
            <Logo />
          </div>
          <span styleName="text">
            Loading...<br />Please wait.
          </span>
          <span styleName="description">- Storiqa team</span>
          <div styleName="spinner">
            <div styleName="double-bounce1" />
            <div styleName="double-bounce2" />
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(LogoutPage);
