// @flow

import React, { PureComponent } from 'react';

import { Button } from 'components/Button';
import { Input } from 'components/Authorization';

import './Authorization.scss';

type PropsType = {
  username: string,
  email: string,
  password: string,
  errors: ?Array<string>,
  formValid: boolean,
  handleRegistrationClick: Function,
  handleChange: Function,
}

class SignUp extends PureComponent<PropsType> {
  render() {
    const {
      username,
      email,
      password,
      errors,
      formValid,
      handleRegistrationClick,
      handleChange,
    } = this.props;

    return (
      <div styleName="signUp">
        <div styleName="inputBlock">
          <Input
            label="Username"
            name="username"
            type="text"
            model={username}
            onChange={handleChange}
          />
        </div>
        <div styleName="inputBlock">
          <Input
            label="Email"
            name="email"
            type="email"
            model={email}
            validate="email"
            onChange={handleChange}
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
            errors={errors}
          />
        </div>
        {formValid &&
          <div styleName="signUpGroup">
            <div styleName="signUpButton">
              <Button onClick={handleRegistrationClick}>
                <span>Sign Up</span>
              </Button>
            </div>
            <div styleName="policy">
              By clicking this button, you agree to Storiqa’s <a href="/" styleName="link">Anti-spam Policy</a> & <a href="/" styleName="link">Terms of Use</a>.
            </div>
          </div>
        }
      </div>
    );
  }
}

export default SignUp;
