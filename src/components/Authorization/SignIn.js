// @flow strict

import React, { Component } from 'react';
import { map, adjust, assoc, pipe, isNil, any } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import { makeInput } from './utils';
import './Authorization.scss';

import type { SignUpInputType, InputOnChangeType, ErrorsType } from './types';

type PropsType = {
  email: string,
  password: string,
  errors: ?ErrorsType,
  formValid: boolean,
  onLoginClick: () => void,
  onRecoverPassword: () => void,
  onResendEmail: () => void,
  onChange: InputOnChangeType,
};

type StateType = {
  autocomplete: boolean,
};

class SignIn extends Component<PropsType, StateType> {
  state: StateType = {
    autocomplete: false,
  };
  setResendEmail = (input: SignUpInputType): SignUpInputType => {
    const { onResendEmail } = this.props;
    const errorsArray = input.errors;
    let showResendEmail = false;
    if (!isNil(errorsArray)) {
      showResendEmail = any(i => i === 'Email not verified')(errorsArray);
    }
    return { ...input, onResendEmail, showResendEmail };
  };
  handleCheckboxChange = (): void => {
    this.setState({ autocomplete: !this.state.autocomplete });
  };
  makeInputs = (): Array<SignUpInputType> => {
    const inputs: Array<string> = ['Email', 'Password'];
    const makeInputFn = map(makeInput(this.props));
    const setFocus = adjust(assoc('thisFocus', true), 0);
    const setResendEmail = adjust(this.setResendEmail, 0);
    const setNoHints = adjust(assoc('noPasswordHints', true), 1);
    return pipe(makeInputFn, setFocus, setResendEmail, setNoHints)(inputs);
  };
  render() {
    const { formValid, onLoginClick, onRecoverPassword } = this.props;
    return (
      <div styleName="signIn">
        {this.makeInputs().map(input => (
          <div key={input.name} styleName="inputBlock">
            <Input {...input} model={this.props[input.name]} />
          </div>
        ))}
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
