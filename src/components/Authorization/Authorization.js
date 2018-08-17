// @flow

import React, { Component, Fragment } from 'react';
import type { Node } from 'react';
import { pathOr } from 'ramda';
import { withRouter, matchShape } from 'found';
import Cookies from 'universal-cookie';
import type { Environment } from 'relay-runtime';

import { PopUpWrapper } from 'components/PopUpWrapper';
import { Spinner } from 'components/common/Spinner';
import {
  SignUp,
  SignIn,
  AuthorizationHeader,
  Separator,
  AuthorizationSocial,
  RecoverPassword,
} from 'components/Authorization';
import { log, fromRelayError, errorsHandler } from 'utils';
import {
  CreateUserMutation,
  GetJWTByEmailMutation,
  RequestPasswordResetMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType } from 'relay/mutations/CreateUserMutation';

import { setPathForRedirectAfterLogin } from './utils';

import './Authorization.scss';

type PropsType = {
  environment: Environment,
  handleLogin: () => void,
  isSignUp: ?boolean,
  alone: ?boolean,
  match: matchShape,
  showAlert: (input: AddAlertInputType) => void,
  onCloseModal?: () => void,
};

type StateType = {
  email: string,
  emailValid: boolean,
  errors: ?{
    [code: string]: Array<string>,
  },
  firstName: string,
  firstNameValid: boolean,
  formValid: boolean,
  lastName: string,
  lastNameValid: boolean,
  password: string,
  passwordValid: boolean,
  headerTabs: Array<{ id: string, name: string }>,
  isLoading: boolean,
  isRecoverPassword: boolean,
  isSignUp: ?boolean,
  modalTitle: string,
  selected: number,
};

const headerTabsItems = [
  {
    id: '0',
    name: 'Sign Up',
  },
  {
    id: '1',
    name: 'Sign In',
  },
];

class Authorization extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailValid: false,
      errors: null,
      firstName: '',
      firstNameValid: false,
      formValid: false,
      headerTabs: headerTabsItems,
      isLoading: false,
      isRecoverPassword: false,
      isSignUp: this.props.isSignUp,
      lastName: '',
      lastNameValid: false,
      modalTitle: headerTabsItems[this.props.isSignUp ? 0 : 1].name,
      password: '',
      passwordValid: false,
      selected: this.props.isSignUp ? 0 : 1,
    };
    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentDidMount() {
    const {
      match: {
        location: {
          query: { from },
        },
      },
    } = this.props;
    if (from && from !== '') {
      setPathForRedirectAfterLogin(from);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  handleAlertOnClick = () => {
    if (this.props.alone) {
      window.location = '/';
    }
  };

  handleRegistrationClick = () => {
    this.setState({ isLoading: true, errors: null });
    const { email, password, firstName, lastName } = this.state;

    const input = {
      clientMutationId: '',
      email,
      firstName: firstName || null,
      lastName: lastName || null,
      password,
    };

    // $FlowIgnoreMe
    const params: MutationParamsType = {
      input,
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        this.setState({ isLoading: false });
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(relayErrors, this.props.showAlert, messages =>
            this.setState({
              isLoading: false,
              errors: messages || null,
            }),
          );
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Registration successful, please confirm your email and login.',
          link: { text: '' },
          onClick: this.handleAlertOnClick,
        });
        const { onCloseModal } = this.props;
        if (onCloseModal) {
          onCloseModal();
        }
      },
      onError: (error: Error) => {
        log.error({ error });
        this.setState({ isLoading: false });
        const relayErrors = fromRelayError(error);
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(relayErrors, this.props.showAlert, messages =>
            this.setState({
              isLoading: false,
              errors: messages || null,
            }),
          );
        }
      },
    };
    CreateUserMutation.commit(params);
  };

  handleLoginClick = () => {
    this.setState({ isLoading: true, errors: null });
    const {
      alone,
      match: {
        location: {
          query: { from },
        },
      },
    } = this.props;
    const { email, password } = this.state;
    GetJWTByEmailMutation.commit({
      email,
      password,
      environment: this.props.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoading: false });
        log.debug({ response, errors });
        const jwt = pathOr(null, ['getJWTByEmail', 'token'], response);
        if (jwt) {
          const cookies = new Cookies();
          const today = new Date();
          const expirationDate = new Date();
          expirationDate.setDate(today.getDate() + 1);
          cookies.set(
            '__jwt',
            { value: jwt },
            {
              path: '/',
              expires: expirationDate,
            },
          );
          if (this.props.handleLogin) {
            this.props.handleLogin();
            if (alone) {
              if (from && from !== '') {
                window.location.replace(from);
              } else {
                window.location = '/';
              }
            } else {
              window.location.reload();
            }
          }
          return;
        }
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(relayErrors, this.props.showAlert, messages =>
            this.setState({
              isLoading: false,
              errors: messages || null,
            }),
          );
        }
      },
      onError: (error: Error) => {
        const relayErrors = fromRelayError(error);
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(relayErrors, this.props.showAlert, messages =>
            this.setState({
              isLoading: false,
              errors: messages || null,
            }),
          );
        }
      },
    });
  };

  handleChange = (data: {
    name: string,
    value: any,
    validity: boolean,
  }): void => {
    const { name, value, validity } = data;
    this.setState({ [name]: value, [`${name}Valid`]: validity }, () =>
      this.validateForm(),
    );
  };

  validateForm = () => {
    const {
      firstNameValid,
      lastNameValid,
      emailValid,
      passwordValid,
      isSignUp,
      isRecoverPassword,
    } = this.state;

    if (isSignUp) {
      this.setState({
        formValid:
          firstNameValid && lastNameValid && emailValid && passwordValid,
      });
    } else if (isSignUp === false && isRecoverPassword === false) {
      this.setState({ formValid: emailValid && passwordValid });
    }
    if (isRecoverPassword) {
      this.setState({ formValid: emailValid });
    }
  };

  handleClick = (modalTitle, selected) => {
    this.setState({
      isSignUp: !this.state.isSignUp,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      errors: null,
      modalTitle,
      selected,
    });
  };

  handleKeydown = (e: any) => {
    const { formValid, isSignUp } = this.state;
    if (e.keyCode === 13 && formValid) {
      if (isSignUp) {
        this.handleRegistrationClick();
      } else {
        this.handleLoginClick();
      }
    }
  };

  recoverPassword = () => {
    const { environment } = this.props;
    const { email } = this.state;
    const params = {
      input: { clientMutationId: '', email },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        this.setState({ isLoading: false });
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(relayErrors, this.props.showAlert, () =>
            this.setState({
              isLoading: false,
              errors: { email: ['Email Not Found'] },
            }),
          );
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Please verify your email',
          link: { text: '' },
          onClick: this.handleAlertOnClick,
        });
        const { onCloseModal } = this.props;
        if (onCloseModal) {
          onCloseModal();
        }
      },
      onError: (error: Error) => {
        const relayErrors = fromRelayError(error);
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(relayErrors, this.props.showAlert, () =>
            this.setState({
              isLoading: false,
              errors: { email: ['Email Not Found'] },
            }),
          );
        }
      },
    };
    RequestPasswordResetMutation.commit(params);
  };

  handleRecoverPassword = (): void => {
    this.setState({
      modalTitle: 'Forgot Password',
      isRecoverPassword: true,
    });
  };

  handleBack = () => {
    this.setState({
      email: '',
      errors: null,
      modalTitle: headerTabsItems[1].name,
      isSignUp: false,
      isRecoverPassword: false,
    });
  };

  renderRegistration = (): Node => {
    const {
      email,
      firstName,
      lastName,
      password,
      formValid,
      errors,
      isSignUp,
    } = this.state;
    return isSignUp ? (
      <SignUp
        email={email}
        firstName={firstName}
        lastName={lastName}
        password={password}
        errors={errors}
        formValid={formValid}
        onRegistrationClick={this.handleRegistrationClick}
        onChange={this.handleChange}
      />
    ) : (
      <SignIn
        email={email}
        password={password}
        errors={errors}
        formValid={formValid}
        onLoginClick={this.handleLoginClick}
        onChange={this.handleChange}
        onRecoverPassword={this.handleRecoverPassword}
      />
    );
  };

  renderRecoverPassword = (): Node => {
    const { email, formValid, errors } = this.state;
    return (
      <RecoverPassword
        email={email}
        errors={errors}
        formValid={formValid}
        onBack={this.handleBack}
        onClick={this.recoverPassword}
        onChange={this.handleChange}
        onRecoverPassword={this.handleRecoverPassword}
      />
    );
  };

  render() {
    const { alone, onCloseModal } = this.props;
    const {
      isLoading,
      isSignUp,
      headerTabs,
      modalTitle,
      selected,
      isRecoverPassword,
    } = this.state;
    return (
      <PopUpWrapper
        title={modalTitle}
        onClose={onCloseModal}
        render={() => (
          <div styleName="container">
            <div styleName="wrap">
              {isLoading && (
                <div styleName="spinner">
                  <Spinner />
                </div>
              )}
              {isRecoverPassword ? null : (
                <AuthorizationHeader
                  alone={alone}
                  isSignUp={isSignUp}
                  onClick={this.handleClick}
                  selected={selected}
                  tabs={headerTabs}
                />
              )}
              {isRecoverPassword
                ? this.renderRecoverPassword()
                : this.renderRegistration()}
              {isRecoverPassword ? null : (
                <Fragment>
                  <div className="separatorBlock">
                    <Separator text="or" />
                  </div>
                  <AuthorizationSocial />
                </Fragment>
              )}
            </div>
          </div>
        )}
      />
    );
  }
}

export default withShowAlert(withRouter(Authorization));
