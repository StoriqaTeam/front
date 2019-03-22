// @flow strict

import React, { Component, Fragment } from 'react';
import type { Node } from 'react';
import { pathOr } from 'ramda';
import { withRouter, matchShape, routerShape } from 'found';
import type { Environment } from 'relay-runtime';
// $FlowIgnoreMe
import uuidv4 from 'uuid/v4';

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
import {
  log,
  fromRelayError,
  errorsHandler,
  removeCookie,
  setCookie,
  getCookie,
  jwt as JWT,
} from 'utils';

// TODO: while mutations are fixed
import {
  // $FlowIgnoreMe
  CreateUserMutation,
  // $FlowIgnoreMe
  ApplyPasswordResetMutation,
  // $FlowIgnoreMe
  ResendEmailVerificationLinkMutation,
} from 'relay/mutations';

import { withShowAlert } from 'components/Alerts/AlertContext';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { CreateUserMutationResponse } from 'relay/mutations/__generated__/CreateUserMutation.graphql';
import type { ApplyPasswordResetMutationResponse } from 'relay/mutations/__generated__/ApplyPasswordResetMutation.graphql';
import type { ResendEmailVerificationLinkMutationResponse } from 'relay/mutations/__generated__/ResendEmailVerificationLinkMutation.graphql';
import type { ResponseErrorType } from 'utils/fromRelayError';
import type { GetJWTByEmailMutationResponse } from './mutations/__generated__/GetJWTByEmailMutation.graphql';
import type { ErrorsType } from './types';

import {
  getJWTByEmailMutation,
  requestPasswordResetMutation,
} from './mutations';

import { setPathForRedirectAfterLogin, getAdditionalData } from './utils';

import './Authorization.scss';

import t from './i18n';

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
  noPopup?: boolean,
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
  isPrivacyChecked: boolean,
  isTermsChecked: boolean,
};

const headerTabsItems = [
  {
    id: '0',
    name: t.signUp,
  },
  {
    id: '1',
    name: t.signIn,
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

    const { noPopup } = props;
    const isRegistered = getCookie('registered');
    const selected = this.props.isSignUp ? 0 : 1;
    const indexByRegistered = isRegistered !== 'true' && noPopup ? 0 : selected;

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
      modalTitle: this.setModalTitle(indexByRegistered),
      password: '',
      passwordValid: false,
      passwordRepeat: '',
      selected: indexByRegistered,
      isPrivacyChecked: false,
      isTermsChecked: false,
    };
    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentDidMount() {
    const {
      match: {
        location: { search },
      },
    } = this.props;
    if (/\?from=/i.test(search)) {
      const from = search.replace(/\?from=/gi, '');
      if (from && from !== '') {
        setPathForRedirectAfterLogin(from);
      }
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  setModalTitle = (index: 1 | 0): string => {
    const { isResetPassword } = this.props;
    if (isResetPassword) {
      return t.recoverPassword;
    }
    return headerTabsItems[index].name;
  };

  handlePrivacyCheck = (privacy: string): void => {
    this.setState(
      (prevState: StateType) => ({
        [privacy]: !prevState[privacy],
      }),
      () => {
        this.validateForm();
      },
    );
  };

  handleAlertOnClick = (): void => {
    window.location = '/';
  };

  handleRegistrationClick = (): void => {
    this.setState({ isLoading: true, errors: null });
    const { email, password, firstName, lastName } = this.state;
    const input = {
      clientMutationId: uuidv4(),
      email,
      firstName: firstName || null,
      lastName: lastName || null,
      password,
      additionalData: getAdditionalData(),
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
          text: t.registrationSuccessful,
          link: { text: '' },
          onClick: this.handleAlertOnClick,
        });
        removeCookie('REFERAL');
        removeCookie('REFERER');
        removeCookie('UTM_MARKS');
        setCookie('registered', true);
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
        location: { search },
      },
      environment,
      showAlert,
    } = this.props;
    const from = search.replace(/\?from=/gi, '');
    const { email, password } = this.state;
    getJWTByEmailMutation({
      environment,
      variables: {
        input: {
          email,
          password,
          clientMutationId: uuidv4(),
        },
      },
    })
      .then((response: GetJWTByEmailMutationResponse) => {
        this.setState({ isLoading: false });
        log.debug({ response });
        // $FlowIgnoreMe
        const jwtStr = pathOr(
          null,
          ['getJWTByEmail', 'token'],
          Object.freeze(response),
        );
        if (jwtStr) {
          const date = new Date();
          const today = date;
          const expirationDate = date;
          expirationDate.setDate(today.getDate() + 14);
          JWT.setJWT(jwtStr);
          setCookie('registered', true);
          if (this.props.handleLogin) {
            this.props.handleLogin();
            if (from && from !== '') {
              window.location.replace(from);
            } else {
              window.location = '/';
            }
          }
        }
        return response;
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
      isPrivacyChecked,
      isTermsChecked,
    } = this.state;
    if (isSignUp) {
      this.setState({
        formValid:
          firstNameValid &&
          lastNameValid &&
          emailValid &&
          passwordValid &&
          isPrivacyChecked &&
          isTermsChecked,
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
    this.setState({ isLoading: true });
    const { environment, showAlert } = this.props;
    const { email } = this.state;
    requestPasswordResetMutation({
      environment,
      variables: {
        input: { clientMutationId: uuidv4(), email },
      },
    })
      .then((): void => {
        const { onCloseModal } = this.props;
        this.props.showAlert({
          type: 'success',
          text: t.pleaseVerifyYourEmail,
          link: { text: '' },
          onClick: this.handleAlertOnClick,
        });
        if (onCloseModal) {
          onCloseModal();
        }
        return undefined;
      })
      .finally(() => {
        this.setState({ isLoading: false });
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
    this.setState({ isLoading: true });
    const {
      environment,
      match: {
        params: { token },
      },
    } = this.props;
    const { password } = this.state;
    const params = {
      input: { clientMutationId: uuidv4(), password, token },
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
          text: t.passwordResetSuccessfully,
          link: { text: '' },
          onClick: this.handleAlertOnClick,
        });
        // $FlowIgnoreMe
        const jwtStr = pathOr(
          null,
          ['applyPasswordReset', 'token'],
          Object.freeze(response),
        );
        if (jwtStr) {
          const date = new Date();
          const today = date;
          const expirationDate = date;
          expirationDate.setDate(today.getDate() + 14);
          // $FlowIgnoreMe
          JWT.setJWT(jwtStr);
          if (this.props.handleLogin) {
            this.props.handleLogin();
            window.location = '/';
          }
        }
      },
      onError: (error: Error): void => {
        const relayErrors = fromRelayError(error);
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(relayErrors, this.props.showAlert, () =>
            this.setState({
              isLoading: false,
              errors: { email: [t.emailNotFound] },
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
      input: { clientMutationId: uuidv4(), email },
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
          text: t.verificationEmailSentSuccessfully,
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
      modalTitle: t.resetPassword,
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

  handleSocialClick = () => {
    this.setState({ isLoading: true });
  };

  renderRegistration = (): Node => {
    const {
      email,
      firstName,
      lastName,
      password,
      formValid,
      errors,
      selected,
      isPrivacyChecked,
      isTermsChecked,
    } = this.state;
    return selected === 0 ? (
      <SignUp
        email={email}
        firstName={firstName}
        lastName={lastName}
        password={password}
        errors={errors}
        formValid={formValid}
        onRegistrationClick={this.handleRegistrationClick}
        onChange={this.handleChange}
        onPrivacyCheck={this.handlePrivacyCheck}
        isPrivacyChecked={isPrivacyChecked}
        isTermsChecked={isTermsChecked}
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
    const text = t.pleaseTypeNewPassword;
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
                  <AuthorizationSocial
                    handleSocialClick={this.handleSocialClick}
                  />
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
