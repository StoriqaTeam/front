// @flow strict

import React, { Component } from 'react';
import { isNil, propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import './Authorization.scss';

import type { InputOnChangeType } from './types';

type PropsType = {
  email: string,
  errors: ?{
    [string]: Array<string>,
  },
  formValid: boolean,
  onBack: () => void,
  onClick: () => void,
  onBlur: () => void,
  onChange: InputOnChangeType,
};

type StateType = {
  autocomplete: boolean,
};

class RecoverPassword extends Component<PropsType, StateType> {
  static defaultProps = {
    onBlur: () => {},
  };
  state: StateType = {
    autocomplete: false,
  };
  handleClick = () => {};
  render() {
    const {
      email,
      errors,
      formValid,
      onClick,
      onChange,
      onBack,
      onBlur,
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
            errors={!isNil(errors) ? propOr(null, 'email', errors) : null}
            onBlur={onBlur}
            validate="email"
          />
        </div>
        <div styleName="recoverPasswordButtons">
          <Button
            wireframe
            big
            onClick={onBack}
            dataTest="recoverPasswordButtonBack"
          >
            Back
          </Button>
          <Button
            onClick={onClick}
            big
            disabled={!formValid}
            dataTest="recoverPasswordButtonSendEmail"
          >
            Send Email
          </Button>
        </div>
      </div>
    );
  }
}

export default RecoverPassword;
