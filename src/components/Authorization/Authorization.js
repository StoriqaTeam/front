// @flow strict
import React, { Component, Fragment } from 'react';
import type { Node } from 'react';
import { pathOr } from 'ramda';
import { withRouter, matchShape, routerShape } from 'found';
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
  ResetPassword,
} from 'components/Authorization';
import { log, fromRelayError, errorsHandler, setCookie } from 'utils';
// TODO: while mutations are fixed
import {
  // $FlowIgnoreMe
  CreateUserMutation,
  // $FlowIgnoreMe
  ApplyPasswordResetMutation,
  // $FlowIgnoreMe
  ResendEmailVerificationLinkMutation,
} from 'relay/mutations';

import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { CreateUserMutationResponse } from 'relay/mutations/__generated__/CreateUserMutation.graphql';
import type { ApplyPasswordResetMutationResponse } from 'relay/mutations/__generated__/ApplyPasswordResetMutation.graphql';
import type { ResendEmailVerificationLinkMutationResponse } from 'relay/mutations/__generated__/ResendEmailVerificationLinkMutation.graphql';
import type { ResponseErrorType } from 'utils/fromRelayError';
import { setPathForRedirectAfterLogin } from './utils';

import type { GetJWTByEmailMutationResponse } from './mutations/__generated__/GetJWTByEmailMutation.graphql';
import {
  getJWTByEmailMutation,
  requestPasswordResetMutation,
} from './mutations';

import './Authorization.scss';

import type { ErrorsType } from './types';

type PropsType = {
  environment: Environment,
  handleLogin: () => void,
  isSignUp: boolean,
  match: matchShape,
  showAlert: (input: AddAlertInputType) => void,
  onCloseModal?: () => void,
  isResetPassword: boolean,
  router: routerShape,
  isLogin: boolean,
};

type StateType = {
  email: string,
  emailValid: boolean,
  errors: ?ErrorsType,
  firstName: string,
  firstNameValid: boolean,
  formValid: boolean,
  lastName: string,
  lastNameValid: boolean,
  password: string,
  passwordValid: boolean,
  passwordRepeat: string,
  headerTabs: Array<{ id: string, name: string }>,
  isLoading: boolean,
  isRecoverPassword: boolean,
  isSignUp: boolean,
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
  static defaultProps = {
    isResetPassword: false,
    isLogin: false,
    isSignUp: false,
  };
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
      modalTitle: this.setModalTitle(),
      password: '',
      passwordValid: false,
      passwordRepeat: '',
      selected: this.props.isSignUp && !this.props.isLogin ? 0 : 1,
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

  setModalTitle = (): string => {
    const { isSignUp, isResetPassword } = this.props;
    if (isResetPassword) {
      return 'Recover Password';
    }
    return headerTabsItems[isSignUp ? 0 : 1].name;
  };

  handleAlertOnClick = (): void => {
    window.location = '/';
  };

  handleRegistrationClick = (): void => {
    this.setState({ isLoading: true, errors: null });
    const { email, password, firstName, lastName } = this.state;

    const input = {
      clientMutationId: '',
      email,
      firstName: firstName || null,
      lastName: lastName || null,
      password,
    };

    const params = {
      input,
      environment: this.props.environment,
      onCompleted: (
        response: ?CreateUserMutationResponse,
        errors: ?Array<ResponseErrorType>,
      ) => {
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

  handleLoginClick = (): void => {
    this.setState({ isLoading: true, errors: null });
    const {
      match: {
        location: {
          query: { from },
        },
      },
      environment,
      showAlert,
    } = this.props;
    const { email, password } = this.state;
    getJWTByEmailMutation({
      environment,
      variables: {
        input: {
          email,
          password,
          clientMutationId: '',
        },
      },
    })
      .then((response: GetJWTByEmailMutationResponse) => {
        this.setState({ isLoading: false });
        log.debug({ response });
        // $FlowIgnoreMe
        const jwt = pathOr(
          null,
          ['getJWTByEmail', 'token'],
          Object.freeze(response),
        );
        if (jwt) {
          const date = new Date();
          const today = date;
          const expirationDate = date;
          expirationDate.setDate(today.getDate() + 1);
          setCookie('__jwt', { value: jwt }, expirationDate);
          if (this.props.handleLogin) {
            this.props.handleLogin();
            if (from && from !== '') {
              window.location.replace(from);
            } else {
              window.location = '/';
            }
          }
        }
      })
      .catch((errs: ResponseErrorType): void => {
        const relayErrors = fromRelayError({ source: { errors: [errs] } });
        if (relayErrors) {
          errorsHandler(relayErrors, showAlert, errMessages =>
            this.setState({
              isLoading: false,
              errors: errMessages || null,
            }),
          );
        }
      });
  };

  handleChange = (data: {
    name: string,
    value: string,
    validity: boolean,
  }): void => {
    const { name, value, validity } = data;
    this.setState({ [name]: value, [`${name}Valid`]: validity }, () =>
      this.validateForm(),
    );
  };

  validateForm = (): void => {
    const { isResetPassword, isLogin } = this.props;
    const {
      firstNameValid,
      lastNameValid,
      emailValid,
      passwordValid,
      isSignUp,
      isRecoverPassword,
      password,
      passwordRepeat,
    } = this.state;
    if (isSignUp) {
      this.setState({
        formValid:
          firstNameValid && lastNameValid && emailValid && passwordValid,
      });
    } else if ((isSignUp === false && isRecoverPassword === false) || isLogin) {
      this.setState({ formValid: emailValid && passwordValid });
    }
    if (isRecoverPassword) {
      this.setState({ formValid: emailValid });
    }
    if (isResetPassword) {
      this.setState({
        formValid: passwordValid && password === passwordRepeat,
      });
    }
  };

  handleClick = (modalTitle, selected): void => {
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

  handleKeydown = (e: KeyboardEvent): void => {
    const { formValid, isSignUp } = this.state;
    if (e.keyCode === 13 && formValid) {
      if (isSignUp) {
        this.handleRegistrationClick();
      } else {
        this.handleLoginClick();
      }
    }
  };

  recoverPassword = (): void => {
    const { environment, showAlert } = this.props;
    const { email } = this.state;
    requestPasswordResetMutation({
      environment,
      variables: {
        input: { clientMutationId: '', email },
      },
    })
      .then((): void => {
        const { onCloseModal } = this.props;
        this.props.showAlert({
          type: 'success',
          text: 'Please verify your email',
          link: { text: '' },
          onClick: this.handleAlertOnClick,
        });
        if (onCloseModal) {
          onCloseModal();
        }
      })
      .catch((errs: ResponseErrorType): void => {
        const relayErrors = fromRelayError({ source: { errors: [errs] } });
        if (relayErrors) {
          errorsHandler(relayErrors, showAlert, errMessages =>
            this.setState({
              isLoading: false,
              errors: errMessages || null,
            }),
          );
        }
      });
  };

  resetPassword = (): void => {
    const {
      environment,
      match: {
        params: { token },
      },
      router: { push },
    } = this.props;
    const { password } = this.state;
    const params = {
      input: { clientMutationId: '', password, token },
      environment,
      onCompleted: (
        response: ?ApplyPasswordResetMutationResponse,
        errors: ?Array<ResponseErrorType>,
      ) => {
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
          text: 'Password Reset Successfully',
          link: { text: '' },
          onClick: this.handleAlertOnClick,
        });
        push('/login');
      },
      onError: (error: Error): void => {
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
    ApplyPasswordResetMutation.commit(params);
  };

  handleResendEmail = (): void => {
    const { environment } = this.props;
    const { email } = this.state;
    const params = {
      input: { clientMutationId: '', email },
      environment,
      onCompleted: (
        response: ResendEmailVerificationLinkMutationResponse,
        errors: ?Array<ResponseErrorType>,
      ) => {
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
          text: 'Verification Email Sent Successfully',
          link: { text: '' },
          onClick: this.handleAlertOnClick,
        });
      },
      onError: (error: Error): void => {
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
    ResendEmailVerificationLinkMutation.commit(params);
  };

  handleRecoverPassword = (): void => {
    this.setState({
      modalTitle: 'Reset Password',
      isRecoverPassword: true,
      email: '',
      password: '',
      errors: null,
    });
  };

  handleBack = (): void => {
    const {
      isResetPassword,
      router: { push },
    } = this.props;
    if (isResetPassword) {
      push('/');
    }
    this.setState({
      email: '',
      errors: null,
      modalTitle: headerTabsItems[1].name,
      isSignUp: false,
      isRecoverPassword: false,
    });
  };

  passwordRecovery = (): Node => {
    const { isResetPassword } = this.props;
    const { password, passwordRepeat, email, formValid, errors } = this.state;
    if (isResetPassword) {
      return (
        <ResetPassword
          password={password}
          passwordRepeat={passwordRepeat}
          errors={errors}
          formValid={formValid}
          onBack={this.handleBack}
          onClick={this.resetPassword}
          onChange={this.handleChange}
          onPasswordRepeat={this.handleChange}
        />
      );
    }
    return (
      <RecoverPassword
        email={email}
        errors={errors}
        formValid={formValid}
        onBack={this.handleBack}
        onClick={this.recoverPassword}
        onChange={this.handleChange}
      />
    );
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
        onResendEmail={this.handleResendEmail}
      />
    );
  };

  render() {
    const { onCloseModal, isResetPassword, isLogin } = this.props;
    const text = 'Please Type new password';
    const description = isResetPassword ? text : '';
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
        description={description}
        onClose={onCloseModal}
        render={() => (
          <div styleName="container">
            <div styleName="wrap">
              {isLoading && (
                <div styleName="spinner">
                  <Spinner />
                </div>
              )}
              {isRecoverPassword || isResetPassword ? null : (
                <AuthorizationHeader
                  fullWidth={isLogin}
                  isSignUp={isSignUp}
                  onClick={this.handleClick}
                  selected={selected}
                  tabs={headerTabs}
                />
              )}
              {isRecoverPassword || isResetPassword
                ? this.passwordRecovery()
                : this.renderRegistration()}
              {isRecoverPassword || isResetPassword ? null : (
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
