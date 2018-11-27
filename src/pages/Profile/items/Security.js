// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  assocPath,
  pathOr,
  propOr,
  omit,
  values,
  all,
  equals,
  isEmpty,
} from 'ramda';
import classNames from 'classnames';
import { validate } from '@storiqa/shared';

import { Input } from 'components/common/Input';
import { SpinnerButton } from 'components/common/SpinnerButton';
import { Icon } from 'components/Icon';
import { PasswordHints } from 'components/PasswordHints';
import { withShowAlert } from 'components/Alerts/AlertContext';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import { log, fromRelayError } from 'utils';
import { renameKeys } from 'utils/ramda';

import { ChangePasswordMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/ChangePasswordMutation';

import '../Profile.scss';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
};

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
class Security extends Component<PropsType, StateType> {
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
          [
            (value: string) => value !== oldPassword,
            'Password has not changed',
          ],
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
      this.setState({ formErrors });
      return;
    }

    this.setState(() => ({ isLoading: true }));

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
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        // $FlowIgnoreMe
        const status: string = pathOr('', ['100', 'status'], relayErrors);
        this.setState(() => ({ isLoading: false }));
        if (!isEmpty(validationErrors)) {
          this.setState({
            formErrors: renameKeys(
              {
                password: 'oldPassword',
                new_password: 'newPassword',
              },
              validationErrors,
            ),
          });
          return;
        } else if (status) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${status}"`,
            link: { text: 'Close.' },
          });
          return;
        } else if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Password successfully updated!',
          link: { text: '' },
        });
        this.setState(() => ({
          newPasswordSee: false,
          repeatNewPasswordSee: false,
        }));
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        this.setState(() => ({ isLoading: false }));
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({
            formErrors: renameKeys(
              {
                password: 'oldPassword',
                new_password: 'newPassword',
              },
              validationErrors,
            ),
          });
          return;
        }
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
        this.setState(() => ({
          newPasswordSee: false,
          repeatNewPasswordSee: false,
        }));
      },
    };
    ChangePasswordMutation.commit(params);
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

  handleFocus = (e: SyntheticInputEvent<HTMLInputElement>) => {
    if (e.target.name === 'newPassword') {
      this.setState({
        newPasswordFocus: true,
      });
    }
  };

  handleBlur = (e: SyntheticInputEvent<HTMLInputElement>) => {
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
      <div styleName="security">
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
              <Icon type="eye" size={28} />
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
              <Icon type="eye" size={28} />
            </div>
          </div>
        </div>
        <SpinnerButton onClick={this.handleSave} isLoading={isLoading}>
          Save
        </SpinnerButton>
      </div>
    );
  }
}

Security.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(Security);
