// @flow

import React, { Component } from 'react';
import { propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import './Authorization.scss';

type PropsType = {
  password: string,
  errors: {
    [string]: ?Array<string>,
  },
  formValid: boolean,
  onBack: () => any,
  onClick: () => any,
  onChange: () => any,
};

type StateType = {
  autocomplete: boolean,
};

class ResetPassword extends Component<PropsType, StateType> {
  state: StateType = {
    autocomplete: false,
  };
  handleClick = () => {};
  render() {
    const {
      password,
      errors,
      formValid,
      onClick,
      onChange,
      onBack,
    } = this.props;
    const { autocomplete } = this.state;
    return (
      <div styleName="signIn">
        <div styleName="inputBlock">
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
        <div styleName="recoverPasswordButtons">
          <Button wireframe big onClick={onBack}>
            Back
          </Button>
          <Button onClick={onClick} big disabled={!formValid}>
            Reset
          </Button>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
