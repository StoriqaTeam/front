// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, routerShape } from 'found';

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
import uuidv4 from 'uuid/v4';

import { Input } from 'components/common/Input';
import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';
import { PasswordHints } from 'components/PasswordHints';
import { withShowAlert } from 'components/Alerts/AlertContext';
import { Confirmation } from 'components/Confirmation';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import { log, fromRelayError } from 'utils';
import { renameKeys } from 'utils/ramda';

import { ChangePasswordMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/ChangePasswordMutation';

import '../../Profile.scss';

import t from './i18n';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  router: routerShape,
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
  showModal: boolean,
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
    showModal: false,
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
            t.passwordMustNotBeEmpty,
          ],
        ],
        newPassword: [
          [
            (value: string) => value && value.length > 0,
            t.passwordMustNotBeEmpty,
          ],
          [
            (value: string) => value.length === 0 || isValidNewPassword,
            t.notValidPassword,
          ],
          [
            (value: string) => value.length === 0 || value !== oldPassword,
            t.passwordHasNotChange,
          ],
        ],
        repeatNewPassword: [
          [
            (value: string) => value && value.length > 0,
            t.passwordMustNotBeEmpty,
          ],
          [
            (value: string) => value.length === 0 || value === newPassword,
            t.notTheSamePassword,
          ],
        ],
      },
      {
        oldPassword,
        newPassword,
        repeatNewPassword,
      },
    );

    if (formErrors) {
      this.setState({ formErrors, showModal: false });
      return;
    }

    this.setState(() => ({ isLoading: true }));

    const input = {
      clientMutationId: uuidv4(),
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
            showModal: false,
          });
          return;
        } else if (status) {
          this.props.showAlert({
            type: 'danger',
            text: `${t.error} "${status}"`,
            link: { text: t.close },
          });
          return;
        } else if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: t.somethingGoingWrong,
            link: { text: t.close },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: t.passwordSuccessfullyUpdated,
          link: { text: '' },
        });
        this.setState(
          () => ({
            showModal: false,
            newPasswordSee: false,
            repeatNewPasswordSee: false,
            form: {
              oldPassword: '',
              newPassword: '',
              repeatNewPassword: '',
            },
          }),
          () => {
            this.props.router.push('/logout');
          },
        );
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
            showModal: false,
          });
          return;
        }
        this.props.showAlert({
          type: 'danger',
          text: t.somethingGoingWrong,
          link: { text: t.close },
        });
        this.setState(() => ({
          showModal: false,
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
        dataTest={`${id}Input`}
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

  handleSaveModal = (): void => {
    this.setState({ showModal: true });
  };

  handleCloseModal = (): void => {
    this.setState({ showModal: false });
  };

  render() {
    const {
      isLoading,
      newPasswordSee,
      repeatNewPasswordSee,
      isValidNewPassword,
      newPasswordValidParams,
      newPasswordFocus,
      showModal,
    } = this.state;
    return (
      <div styleName="security">
        <Confirmation
          showModal={showModal}
          onClose={this.handleCloseModal}
          title={t.resetPassword}
          description={t.confirmationDescription}
          onCancel={this.handleCloseModal}
          onConfirm={this.handleSave}
          confirmText={t.confirmText}
          cancelText={t.cancelText}
        />
        <div styleName="subtitle">
          <strong>{t.securitySettings}</strong>
        </div>
        <div styleName="passwordInputs">
          <div styleName="passwordInput">
            {this.renderInput({
              id: 'oldPassword',
              label: t.labelCurrentPassword,
            })}
          </div>
          <div styleName="passwordInput">
            {this.renderInput({
              id: 'newPassword',
              label: t.labelNewPassword,
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
              label: t.labelRepeatPassword,
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
        <Button
          big
          disabled={!isValidNewPassword}
          onClick={this.handleSaveModal}
          isLoading={isLoading}
          dataTest="saveSecuritySettingsButton"
        >
          {t.save}
        </Button>
      </div>
    );
  }
}

Security.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(withRouter(Security));
