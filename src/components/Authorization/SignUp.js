// @flow

import React, { Fragment, PureComponent } from 'react';
import { map, adjust, pipe, assoc } from 'ramda';

import { Button } from 'components/common/Button';
import { Input } from 'components/Authorization';

import { Policy } from './index';
import { makeInput } from './utils';

import './Authorization.scss';

type SignUpInputType = {
  label: string,
  name: string,
  type: string,
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
  onRegistrationClick: () => void,
  onChange: () => void,
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
    const inputs: Array<string> = [
      'First Name',
      'Last Name',
      'Email',
      'Password',
    ];
    const makeInputFn = map(makeInput(this.props));
    const setFocus = adjust(assoc('thisFocus', true), 0);
    return pipe(makeInputFn, setFocus)(inputs);
  };
  render() {
    const { formValid, onRegistrationClick } = this.props;
    const { isPrivacyChecked, isTermsChecked } = this.state;
    return (
      <div styleName="signUp">
        {this.makeInputs().map(input => (
          <div key={input.name} styleName="inputBlock">
            <Input {...input} model={this.props[input.name]} />
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
