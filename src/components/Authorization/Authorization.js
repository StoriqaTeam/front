// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty } from 'ramda';
import { withRouter, matchShape, routerShape } from 'found';
import Cookies from 'universal-cookie';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { SignUp, SignIn, Header, Separator } from 'components/Authorization';
import { Spiner } from 'components/Spiner';
import { log, socialStrings, fromRelayError } from 'utils';
import { CreateUserMutation, GetJWTByEmailMutation } from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';

import './Authorization.scss';

type PropsType = {
  isSignUp: ?boolean,
  alone: ?boolean,
  match: matchShape,
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  username: string,
  usernameValid: boolean,
  email: string,
  emailValid: boolean,
  password: string,
  passwordValid: boolean,
  formValid: boolean,
  errors: ?Array<string>,
  isLoad: boolean,
  isSignUp: ?boolean,
};

class Authorization extends Component<PropsType, StateType> {
  state: StateType = {
    username: '',
    usernameValid: false,
    email: '',
    emailValid: false,
    password: '',
    passwordValid: false,
    formValid: false,
    isLoad: false,
    errors: null,
    isSignUp: false,
  };

  componentWillMount() {
    this.setState({ isSignUp: this.props.isSignUp });
    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  handleRegistrationClick = () => {
    this.setState({ isLoad: true, errors: null });
    const { alone } = this.props;
    const { email, password } = this.state;

    CreateUserMutation.commit({
      email,
      password,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState({ isLoad: false });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          // $FlowIgnoreMe
          this.setState({ errors: validationErrors });
          return;
        }
        // $FlowIgnoreMe
        const errorStatus: ?string = pathOr(
          null,
          ['100', 'status'],
          relayErrors,
        );
        if (errorStatus) {
          this.props.showAlert({
            type: 'danger',
            text: errorStatus,
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Registration successful, please confirm your email and login.',
          link: { text: 'Got it!' },
        });
        if (alone) {
          window.location = '/';
        } else {
          window.location.reload();
        }
        log.debug({ response, errors });
      },
      onError: (error: Error) => {
        const relayErrors = fromRelayError(error);
        log.error({ error });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.setState({
            isLoad: false,
            // $FlowIgnoreMe
            errors: validationErrors,
          });
          return;
        }
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
      },
    });
  };

  handleLoginClick = () => {
    this.setState({ isLoad: true, errors: null });
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
        this.setState({ isLoad: false });
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
                this.props.router.replace(from);
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
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        this.setState({
          isLoad: false,
          // $FlowIgnoreMe
          errors: validationErrors,
        });
      },
      onError: (error: Error) => {
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
        this.setState({
          isLoad: false,
          // $FlowIgnoreMe
          errors: validationErrors,
        });
        log.error({ error });
      },
    });
  };

  /**
   * @desc handles onChange event by setting the validity of the desired input
   * @param {SyntheticEvent} evt
   * @param {String} evt.name
   * @param {any} evt.value
   * @param {Boolean} evt.validity
   * @return {void}
   */
  handleChange = (data: { name: string, value: any, validity: boolean }) => {
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
    const { usernameValid, emailValid, passwordValid, isSignUp } = this.state;

    if (isSignUp) {
      this.setState({
        formValid: usernameValid && emailValid && passwordValid,
      });
    } else {
      this.setState({ formValid: emailValid && passwordValid });
    }
  };

  handleToggle = () => {
    this.setState({
      isSignUp: !this.state.isSignUp,
      username: '',
      email: '',
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

  render() {
    const { alone } = this.props;
    const {
      username,
      email,
      password,
      formValid,
      isLoad,
      errors,
      isSignUp,
    } = this.state;

    return (
      <div styleName="container">
        <div styleName="wrap">
          {isLoad && (
            <div styleName="spiner">
              <Spiner size={32} />
            </div>
          )}
          <Header
            isSignUp={isSignUp}
            alone={alone}
            handleToggle={this.handleToggle}
          />
          {isSignUp ? (
            <SignUp
              username={username}
              email={email}
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
