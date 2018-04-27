// @flow

import React, { Component } from 'react';
import { propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import './Authorization.scss';

type PropsType = {
  email: string,
  password: string,
  errors: ?Array<string>,
  formVaflid: boolean,
  handleLoginClick: Function,
  handleChange: Function,
  handleBlur: Function,
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
      handleLoginClick,
      handleChange,
      handleBlur,
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
            onChange={handleChange}
            autocomplete={autocomplete}
            errors={propOr(null, 'email', errors)}
            onBlur={handleBlur}
            validate="email"
          />
        </div>
        <div styleName="inputBlock">
          <Input
            label="Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            onChange={handleChange}
            autocomplete={autocomplete}
            errors={propOr(null, 'password', errors)}
          />
        </div>
        {formValid && (
          <div styleName="signInGroup">
            <div styleName="signInButton">
              <Button
                onClick={handleLoginClick}
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
