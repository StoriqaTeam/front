// @flow

import React, { Component } from 'react';
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
} from 'components/Authorization';
import { log, fromRelayError, errorsHandler } from 'utils';
import { CreateUserMutation, GetJWTByEmailMutation } from 'relay/mutations';
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
  firstName: string,
  lastName: string,
  email: string,
  emailValid: boolean,
  firstNameValid: boolean,
  lastNameValid: boolean,
  password: string,
  passwordValid: boolean,
  formValid: boolean,
  errors: ?{
    [code: string]: Array<string>,
  },
  isLoading: boolean,
  isSignUp: ?boolean,
  headerTabs: Array<{ id: string, name: string }>,
  modalTitle: string,
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
      firstName: '',
      lastName: '',
      email: '',
      emailValid: false,
      firstNameValid: false,
      lastNameValid: false,
      password: '',
      passwordValid: false,
      formValid: false,
      isLoading: false,
      errors: null,
      isSignUp: this.props.isSignUp,
      headerTabs: headerTabsItems,
      modalTitle: headerTabsItems[0].name,
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
    } = this.state;

    if (isSignUp) {
      this.setState({
        formValid:
          firstNameValid && lastNameValid && emailValid && passwordValid,
      });
    } else {
      this.setState({ formValid: emailValid && passwordValid });
    }
  };

  handleClick = modalTitle => {
    this.setState({
      isSignUp: !this.state.isSignUp,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      errors: null,
      modalTitle,
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

  handleRecoverPassword = (): void => {};

  render() {
    const { alone } = this.props;
    const {
      email,
      firstName,
      lastName,
      password,
      formValid,
      isLoading,
      errors,
      isSignUp,
      headerTabs,
      modalTitle,
    } = this.state;
    return (
      <PopUpWrapper
        title={modalTitle}
        onClose={() => {}}
        render={() => (
          <div styleName="container">
            <div styleName="wrap">
              {isLoading && (
                <div styleName="spinner">
                  <Spinner />
                </div>
              )}
              <AuthorizationHeader
                tabs={headerTabs}
                isSignUp={isSignUp}
                alone={alone}
                onClick={this.handleClick}
              />
              {isSignUp ? (
                <SignUp
                  email={email}
                  firstName={firstName}
                  lastName={lastName}
                  password={password}
                  errors={errors}
                  formValid={formValid}
                  handleRegistrationClick={this.handleRegistrationClick}
                  handleChange={this.handleChange}
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
              )}
              <div className="separatorBlock">
                <Separator text="or" />
              </div>
              <AuthorizationSocial />
            </div>
          </div>
        )}
      />
    );
  }
}

export default withShowAlert(withRouter(Authorization));
