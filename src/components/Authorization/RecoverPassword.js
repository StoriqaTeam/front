// @flow

import React, { Component, Fragment } from 'react';
import { propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import './Authorization.scss';

type PropsType = {
  email: string,
  errors: {
    [string]: ?Array<string>,
  },
  formValid: boolean,
  onClick: () => any,
  onChange: () => any,
  onBlur: () => any,
};

type StateType = {
  autocomplete: boolean,
};

class RecoverPassword extends Component<PropsType, StateType> {
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
            errors={propOr(null, 'email', errors)}
            onBlur={onBlur}
            validate="email"
          />
        </div>
        <div styleName="recoverPasswordButtons">
          <Button wireframe big>
            Back
          </Button>
          <Button
            onClick={onClick}
            big
          >
            Send Email
          </Button>
        </div>
      </div>
    );
  }
}

export default RecoverPassword;
