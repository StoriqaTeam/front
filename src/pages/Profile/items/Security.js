// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { assocPath, pathOr, propOr, omit, values, all, equals } from 'ramda';
import classNames from 'classnames';
import { validate } from '@storiqa/shared';

import { Input } from 'components/common/Input';
import { SpinnerButton } from 'components/common/SpinnerButton';
import { Icon } from 'components/Icon';
import { PasswordHints } from 'components/PasswordHints';

import { log, fromRelayError } from 'utils';
import { renameKeys } from 'utils/ramda';

import { ChangePassword } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/ChangePassword';

import '../Profile.scss';

type StateType = {
  form: {
    oldPassword: string,
    newPassword: string,
    repeatNewPassword: string,
  },
  formErrors: ?{
    [string]: ?any,
  },
  isLoading: boolean,
  newPasswordSee: boolean,
  repeatNewPasswordSee: boolean,
  isValidNewPassword: boolean,
  newPasswordValidParams: {
    lowerCase: boolean,
    upperCase: boolean,
    digit: boolean,
    length: boolean,
  },
  newPasswordFocus: boolean,
};

// eslint-disable-next-line
class Security extends Component<{}, StateType> {
  state: StateType = {
    form: {
      oldPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
    formErrors: null,
    isLoading: false,
    newPasswordSee: false,
    repeatNewPasswordSee: false,
    isValidNewPassword: false,
    newPasswordValidParams: {
      lowerCase: false,
      upperCase: false,
      digit: false,
      length: false,
    },
    newPasswordFocus: false,
  };

  handleSave = () => {
    this.setState(() => ({ isLoading: true }));
    const { environment } = this.context;
    const { form, isValidNewPassword } = this.state;
    const { oldPassword, newPassword, repeatNewPassword } = form;

    const { errors: formErrors } = validate(
      {
        oldPassword: [
          [
            (value: string) => value && value.length > 0,
            'Password must not be empty',
          ],
        ],
        newPassword: [
          [
            (value: string) => value && value.length > 0,
            'Password must not be empty',
          ],
          [() => isValidNewPassword, 'Not valid password'],
        ],
        repeatNewPassword: [
          [
            (value: string) => value && value.length > 0,
            'Password must not be empty',
          ],
          [(value: string) => value === newPassword, 'Not the same password'],
        ],
      },
      {
        oldPassword,
        newPassword,
        repeatNewPassword,
      },
    );

    if (formErrors) {
      this.setState({
        formErrors,
        isLoading: false,
      });
      return;
    }

    const input = {
      clientMutationId: '',
      oldPassword,
      newPassword,
    };

    const params: MutationParamsType = {
      input,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        if (validationErrors) {
          this.setState({
            formErrors: renameKeys(
              {
                password: 'oldPassword',
                new_password: 'newPassword',
              },
              validationErrors,
            ),
          });
        }
        this.setState(() => ({ isLoading: false }));
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        // eslint-disable-next-line
        alert('Something going wrong :(');
        this.setState(() => ({ isLoading: false }));
      },
    };
    ChangePassword.commit(params);
  };

  toggleSeePassword = (typePaasword: string) => {
    const seeParam = `${typePaasword}See`;
    this.setState(prevState => ({ [seeParam]: !prevState[seeParam] }));
  };

  handleInputChange = (id: string) => (e: any) => {
    const { formErrors } = this.state;
    if (formErrors && id) {
      this.setState({ formErrors: omit([id], formErrors) });
    }
    const { value } = e.target;
    this.setState(
      (prevState: StateType) =>
        assocPath(['form', id], value.replace(/\s\s/, ' '), prevState),
      () => {
        if (id === 'newPassword') {
          this.newPasswordValidate();
        }
      },
    );
  };

  newPasswordValidate = () => {
    const { newPassword } = this.state.form;
    const newPasswordValidParams = {
      lowerCase: /(?=.*?[a-z])/.test(newPassword),
      upperCase: /(?=.*?[A-Z])/.test(newPassword),
      digit: /(?=.*?[0-9])/.test(newPassword),
      length: newPassword.length >= 8,
    };

    this.setState({
      isValidNewPassword: all(equals(true))(values(newPasswordValidParams)),
      newPasswordValidParams,
    });
  };

  /* eslint-disable */
  renderInput = ({ id, label }: { id: string, label: string }) => {
    /* eslint-enable */
    const { formErrors, form } = this.state;
    // $FlowIgnoreMe
    const value = propOr('', id, form);
    const seeValue = this.state[`${id}See`];
    return (
      <Input
        fullWidth
        id={id}
        value={value}
        label={label}
        onChange={this.handleInputChange(id)}
        errors={formErrors && id ? formErrors[id] : null}
        type={seeValue ? 'text' : 'password'}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
      />
    );
  };

  handleFocus = (e: { target: { name: string } }) => {
    if (e.target.name === 'newPassword') {
      this.setState({
        newPasswordFocus: true,
      });
    }
  };

  handleBlur = (e: { target: { name: string } }) => {
    if (e.target.name === 'newPassword') {
      this.setState({
        newPasswordFocus: false,
      });
    }
  };

  render() {
    const {
      isLoading,
      newPasswordSee,
      repeatNewPasswordSee,
      isValidNewPassword,
      newPasswordValidParams,
      newPasswordFocus,
    } = this.state;
    return (
      <Fragment>
        <div styleName="subtitle">
          <strong>Security settings</strong>
        </div>
        <div styleName="passwordInputs">
          <div styleName="passwordInput">
            {this.renderInput({
              id: 'oldPassword',
              label: 'Current password',
            })}
          </div>
          <div styleName="passwordInput">
            {this.renderInput({
              id: 'newPassword',
              label: 'New password',
            })}
            <div
              styleName={classNames('icon', { openIcon: newPasswordSee })}
              onClick={() => {
                this.toggleSeePassword('newPassword');
              }}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              <Icon type="eye" size="24" />
            </div>
            <div>
              {!isValidNewPassword &&
                newPasswordFocus && (
                  <PasswordHints {...newPasswordValidParams} />
                )}
            </div>
          </div>
          <div styleName="passwordInput">
            {this.renderInput({
              id: 'repeatNewPassword',
              label: 'Repeat new password',
            })}
            <div
              styleName={classNames('icon', { openIcon: repeatNewPasswordSee })}
              onClick={() => {
                this.toggleSeePassword('repeatNewPassword');
              }}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              <Icon type="eye" size="24" />
            </div>
          </div>
        </div>
        <SpinnerButton onClick={this.handleSave} isLoading={isLoading}>
          Save
        </SpinnerButton>
      </Fragment>
    );
  }
}

Security.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default Security;
