// @flow strict

import React, { Component } from 'react';
import { propOr, isNil } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import '../Authorization.scss';

import type { InputOnChangeType, ErrorsType } from '../types';

import t from './i18n';

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
            label={t.labelNewPassword}
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
            label={t.labelRepeatPassword}
            name="passwordRepeat"
            type="password"
            model={passwordRepeat}
            validate="password"
            onChange={onPasswordRepeat}
            autocomplete={autocomplete}
            errors={password === passwordRepeat ? null : [t.errorNotMatch]}
          />
        </div>
        <div styleName="recoverPasswordButtons">
          <Button onClick={onClick} big disabled={!formValid}>
            {t.submitNewPassword}
          </Button>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
