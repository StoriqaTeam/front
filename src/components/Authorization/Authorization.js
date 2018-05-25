// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty } from 'ramda';
import { withRouter, matchShape, routerShape } from 'found';
import Cookies from 'universal-cookie';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { Spinner } from 'components/common/Spinner';
import { SignUp, SignIn, Header, Separator } from 'components/Authorization';
import { log, socialStrings, fromRelayError } from 'utils';
import { CreateUserMutation, GetJWTByEmailMutation } from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { MutationParamsType } from 'relay/mutations/CreateUserMutation';

import './Authorization.scss';

type PropsType = {
  isSignUp: ?boolean,
  alone: ?boolean,
  match: matchShape,
  router: routerShape,
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
  errors: ?Array<string>,
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
    const { email, password } = this.state;

    /** Uncomment, when backend will appear */
    // const { email, password, firstName, lastName } = this.state;

    const input = {
      clientMutationId: '',
      email,
      // firstName,
      // lastName,
      password,
    };

    // $FlowIgnoreMe
    const params: MutationParamsType = {
      input,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          // $FlowIgnoreMe
          this.setState({
            errors: validationErrors,
            isLoading: false,
          });
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
          this.setState({ isLoading: false });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Registration successful, please confirm your email and login.',
          link: { text: 'Ok!' },
          onClick: this.handleAlertOnClick,
        });
        const { onCloseModal } = this.props;
        if (onCloseModal) {
          onCloseModal();
        }
        this.setState({ isLoading: false });
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
            isLoading: false,
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
        this.setState({ isLoading: false });
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
          isLoading: false,
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
          isLoading: false,
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
