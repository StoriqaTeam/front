// @flow

import React, { Fragment, PureComponent } from 'react';
import { propOr } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import { Policy } from './index';

import './Authorization.scss';

type SignUpInputType = {
  label: string,
  name: string,
  type: string,
  model: string,
  validate?: string,
  thisFocus?: boolean,
  onChange: () => void,
  errors: ?Array<string>,
};

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
  makeInputs = (): Array<SignUpInputType> => {
    const { errors, onChange } = this.props;
    return [
      {
        thisFocus: true,
        label: 'First Name',
        name: 'firstName',
        type: 'text',
        model: this.props.firstName,
        onChange,
        errors: propOr(null, 'firstName', errors),
      },
      {
        label: 'Last Name',
        name: 'lastName',
        type: 'text',
        model: this.props.lastName,
        onChange,
        errors: propOr(null, 'lastName', errors),
      },
      {
        label: 'Email',
        name: 'email',
        type: 'email',
        model: this.props.email,
        validate: 'email',
        onChange,
        errors: propOr(null, 'email', errors),
      },
      {
        label: 'Password',
        name: 'password',
        type: 'password',
        model: this.props.password,
        validate: 'password',
        onChange,
        errors: propOr(null, 'password', errors),
      },
    ];
  };
  render() {
    const { formValid, onRegistrationClick } = this.props;
    const { isPrivacyChecked, isTermsChecked } = this.state;
    return (
      <div styleName="signUp">
        {this.makeInputs().map(input => (
          <div styleName="inputBlock">
            <Input key={input.name} {...input} />
          </div>
        ))}
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
