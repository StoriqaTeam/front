// @flow

import React, { PureComponent } from 'react';
import { withRouter, routerShape } from 'found';

import { Button } from 'components/common/Button';

import Logo from './svg/logo.svg';

import './styles.scss';

type PropsType = {
  router: routerShape,
};

class Error404 extends PureComponent<PropsType> {
  handleBack = () => {
    this.props.router.go(-1);
  };

  handleToMainPage = () => {
    this.props.router.replace('/');
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
            {'Oops! Seems that the page you searching doesn\'t exist.'}<br />
            Try to start again from main page or use search tool.
          </div>
          <div styleName="button">
            <Button
              big
              type="button"
              onClick={this.handleToMainPage}
            >
              Start from main page
            </Button>
            <div // eslint-disable-line
              styleName="linkBack"
              onClick={this.handleBack}
            >
              Back
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Error404);
