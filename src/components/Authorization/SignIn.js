// @flow strict

import React, { Component } from 'react';
import { isNil, any, propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import './Authorization.scss';

type PropsType = {
  email: string,
  password: string,
  errors: ?{
    [string]: Array<string>,
  },
  formValid: boolean,
  onLoginClick: () => void,
  onRecoverPassword: () => void,
  onResendEmail: () => void,
  onChange: ({
    name: string,
    value: string,
    validity: boolean,
  }) => void,
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
      onRecoverPassword,
      onResendEmail,
    } = this.props;
    const { autocomplete } = this.state;
    const errorsArray = !isNil(errors) ? propOr([], 'email', errors) : [];
    let showResendEmail = false;
    if (!isNil(errorsArray)) {
      showResendEmail = any(i => i === 'Email not verified')(errorsArray);
    }
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
            errors={!isNil(errors) ? propOr(null, 'email', errors) : null}
            showResendEmail={showResendEmail}
            onResendEmail={onResendEmail}
            validate="email"
          />
        </div>
        <div styleName="inputBlock userPassword">
          <Input
            noPasswordHints
            label="Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            onChange={onChange}
            autocomplete={autocomplete}
            errors={!isNil(errors) ? propOr(null, 'password', errors) : null}
          />
        </div>
        <div styleName="forgotPassword">
          <span
            onClick={onRecoverPassword}
            onKeyPress={() => {}}
            role="button"
            tabIndex="-1"
          >
            Forgot Password
          </span>
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
