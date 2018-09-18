// @flow

import React, { Fragment, PureComponent } from 'react';
import { propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import { Policy } from './index';

import './Authorization.scss';

type PropsType = {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  errors: {
    [string]: ?Array<string>,
  },
  formValid: boolean,
  onRegistrationClick: Function,
  onChange: Function,
};

type StateType = {
  isPrivacyChecked: boolean,
  isTermsChecked: boolean,
};

class SignUp extends PureComponent<PropsType, StateType> {
  state = {
    isPrivacyChecked: false,
    isTermsChecked: false,
  };
  handleCheck = (privacy: string): void => {
    this.setState((prevState: StateType) => ({
      [privacy]: !prevState[privacy],
    }));
  };
  render() {
    const {
      email,
      firstName,
      lastName,
      password,
      errors,
      formValid,
      onRegistrationClick,
      onChange,
    } = this.props;

    const { isPrivacyChecked, isTermsChecked } = this.state;

    return (
      <div styleName="signUp">
        <div styleName="inputBlock">
          <Input
            label="First name"
            name="firstName"
            type="text"
            model={firstName}
            onChange={onChange}
            errors={propOr(null, 'firstName', errors)}
          />
        </div>
        <div styleName="inputBlock">
          <Input
            label="Last name"
            name="lastName"
            type="text"
            model={lastName}
            onChange={onChange}
            errors={propOr(null, 'lastName', errors)}
          />
        </div>
        <div styleName="inputBlock">
          <Input
            thisFocus
            label="Email"
            name="email"
            type="email"
            model={email}
            validate="email"
            onChange={onChange}
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
            onChange={onChange}
            errors={propOr(null, 'password', errors)}
          />
        </div>
        {formValid && (
          <Fragment>
            <Policy
              isPrivacyChecked={isPrivacyChecked}
              isTermsChecked={isTermsChecked}
              onCheck={this.handleCheck}
            />
            <div styleName="signUpGroup">
              <Button
                onClick={onRegistrationClick}
                type="button"
                dataTest="signUpButton"
                disabled={!(isPrivacyChecked && isTermsChecked)}
                fullWidth
              >
                <span>Sign Up</span>
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default SignUp;
