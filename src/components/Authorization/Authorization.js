// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { withRouter, matchShape } from 'found';
import Cookies from 'universal-cookie';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { Spinner } from 'components/common/Spinner';
import { SignUp, SignIn, Header, Separator } from 'components/Authorization';
import { log, socialStrings, fromRelayError, errorsHandler } from 'utils';
import { CreateUserMutation, GetJWTByEmailMutation } from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType } from 'relay/mutations/CreateUserMutation';

import { setPathForRedirectAfterLogin } from './utils';

import './Authorization.scss';

type PropsType = {
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
};

class Authorization extends Component<PropsType, StateType> {
  state: StateType = {
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
    isSignUp: false,
  };

  componentWillMount() {
    this.setState({ isSignUp: this.props.isSignUp });
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
      environment: this.context.environment,
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
      environment: this.context.environment,
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
          if (this.context.handleLogin) {
            this.context.handleLogin();
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

  handleChange = (data: { name: string, value: any, validity: boolean }): void => {
    const { name, value, validity } = data;
    this.setState({ [name]: value, [`${name}Valid`]: validity }, () =>
      this.validateForm(),
    );
  };

  /**
   * @desc Validates the form based on its values
   * @return {void}
   */
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

  handleToggle = () => {
    this.setState({
      isSignUp: !this.state.isSignUp,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      errors: null,
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

  handleRecoverPassword = (): void => {

  };

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
    } = this.state;

    return (
      <div styleName="container">
        <div styleName="wrap">
          {isLoading && (
            <div styleName="spinner">
              <Spinner />
            </div>
          )}
          <Header
            isSignUp={isSignUp}
            alone={alone}
            handleToggle={this.handleToggle}
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
              handleLoginClick={this.handleLoginClick}
              handleChange={this.handleChange}
              onRecoverPassword={this.handleRecoverPassword}
            />
          )}
          <div className="separatorBlock">
            <Separator text="or" />
          </div>
          <div styleName="firstButtonBlock">
            <Button
              iconic
              href={socialStrings.facebookLoginString()}
              dataTest="authFacebookButton"
            >
              <Icon type="facebook" />
              <span>Sign in with Facebook</span>
            </Button>
          </div>
          <div>
            <Button
              iconic
              href={socialStrings.googleLoginString()}
              dataTest="authGoogleButton"
            >
              <Icon type="google" />
              <span>Sign In with Google</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

Authorization.contextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
};

export default withShowAlert(withRouter(Authorization));
