// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AuthorizationForm } from './index';

class Authorization extends Component<{}> {
  handleClick = () => {};
  render() {
    return <AuthorizationForm />;
  }
}

Authorization.contextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
};

export default Authorization;
