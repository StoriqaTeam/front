// @flow

import React, { Component } from 'react';

import { routerShape, withRouter } from 'found';

import { AppContext } from 'components/App';
import { Authorization } from 'components/Authorization';

import './PasswordReset.scss';

type PropsType = {
  router: routerShape,
};

class PasswordReset extends Component<PropsType> {
  handleCloseModal = () => {
    const {
      router: { push },
    } = this.props;
    push('/');
  };
  render() {
    return (
      <AppContext.Consumer>
        {({ environment, handleLogin }) => (
          <div styleName="container">
            <div styleName="wrapper">
              <Authorization
                isResetPassword
                environment={environment}
                handleLogin={handleLogin}
                onCloseModal={this.handleCloseModal}
              />
            </div>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default withRouter(PasswordReset);
