// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pathOr } from 'ramda';
import { withRouter, routerShape } from 'found';
import Cookies from 'universal-cookie';

import { Icon } from 'components/Icon';
import { Button } from 'components/Button';
import { SignUp, SignIn, Header, Separator } from 'components/Authorization';
import { Spiner } from 'components/Spiner';

import { log, socialStrings } from 'utils';

import { CreateUserMutation, GetJWTByEmailMutation } from 'relay/mutations';

import './Authorization.scss';

type PropsType = {
  router: routerShape,
  isSignUp: ?boolean,
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
}

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
  }

  handleRegistrationClick = () => {
    this.setState({ isLoad: true });
    const { email, password } = this.state;

    CreateUserMutation.commit({
      email,
      password,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        this.setState({ isLoad: false });
        window.location.reload();
        log.debug({ response, errors });
      },
      onError: (error: Error) => {
        this.setState({
          isLoad: false,
          errors: pathOr(null, ['source', 'errors'], error),
        });
        log.error({ error });
      },
    });
  };

  handleLoginClick = () => {
    this.setState({ isLoad: true });
    const { username, password } = this.state;
    GetJWTByEmailMutation.commit({
      email: username,
      password,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        this.setState({ isLoad: false });
        log.debug({ response, errors });
        const jwt = pathOr(null, ['getJWTByEmail', 'token'], response);
        if (jwt) {
          const cookies = new Cookies();
          cookies.set('__jwt', { value: jwt });
          if (this.context.handleLogin) {
            this.context.handleLogin();
            this.props.router.replace('/');
          }
        }
      },
      onError: (error: Error) => {
        this.setState({
          isLoad: false,
          errors: pathOr(null, ['source', 'errors'], error),
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
    this.setState({ [name]: value, [`${name}Valid`]: validity }, () => this.validateForm());
  };

  /**
   * @desc Validates the form based on its values
   * @return {void}
   */
  validateForm = () => {
    const {
      usernameValid,
      emailValid,
      passwordValid,
      isSignUp,
    } = this.state;

    if (isSignUp) {
      this.setState({ formValid: usernameValid && emailValid && passwordValid });
    } else {
      this.setState({ formValid: usernameValid && passwordValid });
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

  render() {
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
        {isLoad && (
          <div styleName="spiner">
            <Spiner size={32} />
          </div>
        )}
        <Header
          isSignUp={isSignUp}
          handleToggle={this.handleToggle}
        />
        {isSignUp ?
          <SignUp
            username={username}
            email={email}
            password={password}
            errors={errors}
            formValid={formValid}
            handleRegistrationClick={this.handleRegistrationClick}
            handleChange={this.handleChange}
          /> :
          <SignIn
            username={username}
            password={password}
            errors={errors}
            formValid={formValid}
            handleLoginClick={this.handleLoginClick}
            handleChange={this.handleChange}
          />
        }
        <div className="separatorBlock">
          <Separator text="or" />
        </div>
        <div styleName="firstButtonBlock">
          <Button
            iconic
            href={socialStrings.facebookLoginString()}
          >
            <Icon type="facebook" />
            <span>Sign Up with Facebook</span>
          </Button>
        </div>
        <div>
          <Button
            iconic
            href={socialStrings.googleLoginString()}
          >
            <Icon type="google" />
            <span>Sign Up with Google</span>
          </Button>
        </div>
      </div>
    );
  }
}

Authorization.contextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
};

export default withRouter(Authorization);
