// @flow

import React, { Component } from 'react';

type PropsType = {
  email: string,
  errors: {
    [string]: ?Array<string>,
  },
  formValid: boolean,
  onLoginClick: () => any,
  onChange: () => any,
  onBlur: () => any,
};

class SignIn extends Component<PropsType, {}> {
  handleClick = () => {};
  render() {
    const {
      email,
      errors,
      formValid,
      onLoginClick,
      onChange,
      onBlur,
    } = this.props;
    return <div>Recover</div>;
  }
}

export default SignIn;
