// @flow

import React, { Component } from 'react';
import { propOr } from 'ramda';

import { Button } from 'components/Button';
import { Input } from 'components/Authorization';
import { Checkbox } from 'components/Checkbox';

import './Authorization.scss';

type PropsType = {
  username: string,
  password: string,
  errors: ?Array<string>,
  formValid: boolean,
  handleLoginClick: Function,
  handleChange: Function,
}

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
      username,
      password,
      errors,
      formValid,
      handleLoginClick,
      handleChange,
    } = this.props;
    const { autocomplete } = this.state;

    return (
      <div styleName="signIn">
        <div styleName="inputBlock">
          <Input
            label="Username"
            name="username"
            type="text"
            model={username}
            onChange={handleChange}
            autocomplete={autocomplete}
            errors={propOr(null, 'email', errors)}
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
              <Button onClick={handleLoginClick} type="button">
                <span>Sign In</span>
              </Button>
            </div>
            <div styleName="signInCheckbox">
              <Checkbox
                id="login"
                label="Remember Me"
                isChecked={autocomplete}
                handleCheckboxChange={this.handleCheckboxChange}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default SignIn;
