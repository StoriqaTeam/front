// @flow

import React, { Component } from 'react';
import { propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import './Authorization.scss';

type PropsType = {
  email: string,
  password: string,
  errors: {
    [string]: ?Array<string>,
  },
  formValid: boolean,
  onLoginClick: () => void,
  onChange: () => void,
  onBlur: () => void,
  onRecoverPassword: () => void,
};

type StateType = {
  autocomplete: boolean,
};

class SignIn extends Component<PropsType, StateType> {
  state: StateType = {
    autocomplete: false,
  };

  handleCheckboxChange = () => {
    this.setState({ autocomplete: !this.state.autocomplete });
  };

  render() {
    const {
      email,
      password,
      errors,
      formValid,
      onLoginClick,
      onChange,
      onBlur,
      onRecoverPassword,
    } = this.props;
    const { autocomplete } = this.state;

    return (
      <div styleName="signIn">
        <div styleName="inputBlock">
          <Input
            thisFocus
            label="Email"
            name="email"
            type="text"
            model={email}
            onChange={onChange}
            autocomplete={autocomplete}
            errors={propOr(null, 'email', errors)}
            onBlur={onBlur}
            validate="email"
          />
        </div>
        <div styleName="inputBlock userPassword">
          <Input
            label="Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            onChange={onChange}
            autocomplete={autocomplete}
            errors={propOr(null, 'password', errors)}
          />
        </div>
        <div
          onClick={onRecoverPassword}
          onKeyPress={() => {}}
          role="button"
          styleName="forgotPassword"
          tabIndex="-1"
        >
          Forgot Password
        </div>
        {formValid && (
          <div styleName="signInGroup">
            <div styleName="signInButton">
              <Button
                onClick={onLoginClick}
                type="button"
                dataTest="signInButton"
              >
                <span>Sign In</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SignIn;
