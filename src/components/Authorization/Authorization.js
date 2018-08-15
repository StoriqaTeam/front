// @flow

import React, { Component } from 'react';

import { AppContext } from 'components/App';

import { AuthorizationForm } from './index';

class Authorization extends Component<{}> {
  handleClick = () => {};
  render() {
    return (
      <AppContext.Consumer>
        {({ environment, handleLogin }) => (
          <AuthorizationForm
            environment={environment}
            handleLogin={handleLogin}
          />
        )}
      </AppContext.Consumer>
    );
  }
}

export default Authorization;
