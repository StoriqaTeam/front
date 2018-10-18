// @flow strict

import React, { Component } from 'react';
import { isNil, propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import '../Authorization.scss';

import type { InputOnChangeType, ErrorsType } from '../types';

import t from './i18n';

type PropsType = {
  email: string,
  errors: ?ErrorsType,
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
            label={t.labelEmail}
            name="email"
            type="email"
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
            {t.back}
          </Button>
          <Button
            onClick={onClick}
            big
            disabled={!formValid}
            dataTest="recoverPasswordButtonSendEmail"
          >
            {t.sendEmail}
          </Button>
        </div>
      </div>
    );
  }
}

export default RecoverPassword;
