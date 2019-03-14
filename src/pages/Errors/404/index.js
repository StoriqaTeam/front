// @flow strict

import React, { PureComponent } from 'react';
import { withRouter, routerShape } from 'found';

import { Button } from 'components/common/Button';

import Logo from '../svg/logo.svg';

import '../styles.scss';

import t from './i18n';

type PropsType = {
  router: routerShape,
};

class Error404 extends PureComponent<PropsType> {
  handleBack = () => {
    this.props.router.go(-1);
  };

  handleToMainPage = () => {
    window.location = '/';
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="logoWrapper">
          <div styleName="logo">
            <Logo />
          </div>
        </div>
        <div styleName="messageWrapper">
          <div styleName="code404Wrapper">
            <span styleName="code404">404</span>
          </div>
          <div styleName="text">
            {t.oopsItSeemsThatThePageDoesntExist}
            <br />
            {t.tryToStartAgain}
          </div>
          <div styleName="button">
            <Button
              big
              type="button"
              onClick={this.handleToMainPage}
              dataTest="404Button"
            >
              {t.startFromMainPage}
            </Button>
            <div // eslint-disable-line
              styleName="linkBack"
              onClick={this.handleBack}
            >
              {t.back}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Error404);
