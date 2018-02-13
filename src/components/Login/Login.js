// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter, routerShape } from 'found';
import { pathOr } from 'ramda';
import Cookies from 'universal-cookie';

import { Icon } from 'components/Icon';
import { Button } from 'components/Button';
import { Header, Input, Separator } from 'components/Registration';
import { Checkbox } from 'components/Checkbox';
import { Spiner } from 'components/Spiner';

import { log } from 'utils';
import { GetJWTByEmailMutation } from 'relay/mutations';

import './Login.scss';

type PropsType = {
  router: routerShape,
};

type StateType = {
  username: string,
  usernameValid: boolean,
  password: string,
  passwordValid: boolean,
  formValid: boolean,
  autocomplete: boolean,
  errors: ?Array<string>,
};

class Login extends Component<PropsType, StateType> {
  state: StateType = {
    username: '',
    usernameValid: false,
    password: '',
    passwordValid: false,
    formValid: false,
    autocomplete: false,
    isLoad: false,
    errors: null,
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

  handleChange = (data: { name: string, value: any, validity: boolean }) => {
    const { name, value, validity } = data;
    this.setState({ [name]: value, [`${name}Valid`]: validity }, () => this.validateForm());
  };

  validateForm = () => {
    const { usernameValid, passwordValid } = this.state;
    this.setState({ formValid: usernameValid && passwordValid });
  };

  handleCheckboxChange = () => {
    this.setState({ autocomplete: !this.state.autocomplete });
  };

  facebookLoginString = () => {
    // $FlowIgnore
    const appId = `${process.env.REACT_APP_OAUTH_FACEBOOK_APP_ID}`;
    // $FlowIgnore
    const redirectUri = `${process.env.REACT_APP_OAUTH_FACEBOOK_REDIRECT_URI}`;
    return `https://www.facebook.com/v2.11/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=email,public_profile&response_type=token`;
  };

  googleLoginString = () => {
    // $FlowIgnore
    const appId = `${process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID}`;
    // $FlowIgnore
    const redirectUri = `${process.env.REACT_APP_OAUTH_GOOGLE_REDIRECT_URI}`;
    // $FlowIgnore
    const scopes = `${process.env.REACT_APP_OAUTH_GOOGLE_SCOPES}`;
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`;
  };

  render() {
    const {
      username,
      password,
      formValid,
      autocomplete,
      isLoad,
      errors,
    } = this.state;

    const signIn = (
      <div styleName="signInGroup">
        <div styleName="signInButton">
          <Button onClick={this.handleLoginClick} type="button">
            <span>Sign In</span>
          </Button>
        </div>
        <div styleName="signInCheckbox">
          <Checkbox
            id="login"
            label="Remember Me"
            isChecked={autocomplete}
            handleCheckboxChange={this.handleCheckboxChange}
          />
        </div>
      </div>
    );

    return (
      <form styleName="container">
        {isLoad && (
          <div styleName="spiner">
            <Spiner size={32} />
          </div>
        )}
        <Header
          title="Sign In"
          linkTitle="Sign Up"
          link="/registration"
        />
        <div styleName="inputBlock">
          <Input
            label="Username"
            name="username"
            type="text"
            model={username}
            onChange={this.handleChange}
            autocomplete={autocomplete}
          />
        </div>
        <div styleName="inputBlock">
          <Input
            label="Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            onChange={this.handleChange}
            autocomplete={autocomplete}
            errors={errors}
          />
        </div>
        {formValid && signIn}
        <div className="separatorBlock">
          <Separator text="or" />
        </div>
        <div styleName="firstButtonBlock">
          <Button
            iconic
            href={this.facebookLoginString()}
          >
            <Icon type="facebook" />
            <span>Sign In with Facebook</span>
          </Button>
        </div>
        <div>
          <Button
            iconic
            href={this.googleLoginString()}
          >
            <Icon type="google" />
            <span>Sign In with Google</span>
          </Button>
        </div>
      </form>
    );
  }
}

Login.contextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
};

export default withRouter(Login);
