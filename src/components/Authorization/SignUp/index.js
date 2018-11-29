// @flow strict

import React, { Fragment, PureComponent } from 'react';
import { map, adjust, pipe, assoc } from 'ramda';

import { Button } from 'components/common/Button';
import { Input, Policy } from 'components/Authorization';

import { makeInput } from '../utils';

import '../Authorization.scss';

import t from './i18n';

import type {
  SignUpInputType,
  InputOnChangeType,
  ErrorsType,
  InputConfig,
} from '../types';

type PropsType = {
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  errors: ?ErrorsType,
  formValid: boolean,
  onRegistrationClick: () => void,
  onChange: InputOnChangeType,
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
    const inputs: Array<InputConfig> = [
      {
        label: t.labelFirstName,
        type: 'text',
      },
      {
        label: t.labelLastName,
        type: 'text',
      },
      {
        label: t.labelEmail,
        type: 'email',
      },
      {
        label: t.labelPassword,
        type: 'password',
      },
    ];
    const makeInputFn = map(makeInput(this.props));
    const setFocus = adjust(assoc('thisFocus', true), 0);
    return pipe(makeInputFn, setFocus)(inputs);
  };

  render() {
    const { onRegistrationClick, formValid } = this.props;
    const { isPrivacyChecked, isTermsChecked } = this.state;
    return (
      <div styleName="signUp">
        {this.makeInputs().map(input => (
          <div key={input.name} styleName="inputBlock">
            <Input {...input} model={this.props[input.name]} />
          </div>
        ))}
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
              disabled={!(formValid && (isPrivacyChecked && isTermsChecked))}
              fullWidth
            >
              <span>{t.signUp}</span>
            </Button>
          </div>
        </Fragment>
      </div>
    );
  }
}

export default SignUp;
