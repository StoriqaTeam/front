// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import { routerShape, withRouter } from 'found';
import { pathOr } from 'ramda';

import Logo from 'components/Icon/svg/logo.svg';

import './index.scss';

type PropsType = {
  router: routerShape,
};

class Logout extends PureComponent<PropsType> {
  componentDidMount() {
    if (!process.env.BROWSER) {
      return;
    }
    const cookies = new Cookies();
    cookies.remove('__jwt');

    const store = this.context.environment.getStore();
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

Logout.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withRouter(Logout);
