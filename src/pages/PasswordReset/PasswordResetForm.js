// @flow

import React, { Component } from 'react';
import { propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import './PasswordResetForm.scss';

type PropsType = {
  email: string,
  errors: {
    [string]: ?Array<string>,
  },
  formValid: boolean,
  onBack: () => any,
  onClick: () => any,
  onChange: () => any,
  onBlur: () => any,
};

type StateType = {
  autocomplete: boolean,
};

class PasswordResetForm extends Component<PropsType, StateType> {
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
      onBack,
    } = this.props;
    const { autocomplete } = this.state;
    return (
      <div styleName="container">
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
        <div styleName="buttons">
          <Button wireframe big onClick={onBack}>
            Back
          </Button>
          <Button onClick={onClick} big disabled={!formValid}>
            Send Email
          </Button>
        </div>
      </div>
    );
  }
}

export default PasswordResetForm;
