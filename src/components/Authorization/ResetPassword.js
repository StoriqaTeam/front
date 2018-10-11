// @flow strict

import React, { Component } from 'react';
import { propOr, isNil } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import './Authorization.scss';

import type { InputOnChangeType, ErrorsType } from './types';

type PropsType = {
  password: string,
  passwordRepeat: string,
  errors: ?ErrorsType,
  formValid: boolean,
  onClick: () => void,
  onPasswordRepeat: InputOnChangeType,
  onChange: InputOnChangeType,
};

type StateType = {
  autocomplete: boolean,
};

class ResetPassword extends Component<PropsType, StateType> {
  state: StateType = {
    autocomplete: false,
  };
  render() {
    const {
      password,
      passwordRepeat,
      errors,
      formValid,
      onClick,
      onChange,
      onPasswordRepeat,
    } = this.props;
    const { autocomplete } = this.state;

    return (
      <div styleName="signIn">
        <div styleName="inputBlock">
          <Input
            label="New Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            onChange={onChange}
            autocomplete={autocomplete}
            errors={!isNil(errors) ? propOr(null, 'password', errors) : null}
          />
        </div>
        <div styleName="inputBlock">
          <Input
            label="New Password again"
            name="passwordRepeat"
            type="password"
            model={passwordRepeat}
            validate="password"
            onChange={onPasswordRepeat}
            autocomplete={autocomplete}
            errors={password === passwordRepeat ? null : ['Not Match']}
          />
        </div>
        <div styleName="recoverPasswordButtons">
          <Button onClick={onClick} big disabled={!formValid}>
            Submit New Password
          </Button>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
