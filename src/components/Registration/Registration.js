// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components/Icon';
import { Form } from 'components/Form';
import { FormHeader } from 'components/FormHeader';
import { FormInput } from 'components/FormInput';
import { Button } from 'components/Button';
import { Separator } from 'components/Separator';

import { log } from 'utils';
import { CreateUserMutation } from 'relay/mutations';

import './Registration.scss';

type StateType = {
  username: string,
  usernameValid: boolean,
  email: string,
  emailValid: boolean,
  password: string,
  passwordValid: boolean,
  formValid: boolean
}

class Registration extends PureComponent<{}, StateType> {
  state: StateType = {
    username: '',
    usernameValid: false,
    email: '',
    emailValid: false,
    password: '',
    passwordValid: false,
    formValid: false,
  };

  handleRegistrationClick = () => {
    const { email, password } = this.state;

    CreateUserMutation.commit({
      email,
      password,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => log.debug({ response, errors }),
      onError: (error: Error) => log.error({ error }),
    });
  };

  /**
   * @desc Storiqa's anti-span policy
   * @type {String}
   */
  policy = (
    <div styleName="policy">
      By clicking this button, you agree to Storiqa’s <a href="/" styleName="link">Anti-spam Policy</a> & <a href="/" styleName="link">Terms of Use</a>.
    </div>
  );

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
    const { usernameValid, emailValid, passwordValid } = this.state;
    this.setState({ formValid: usernameValid && emailValid && passwordValid });
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
      email,
      password,
      formValid,
    } = this.state;

    const singUp = (
      <div styleName="signUpGroup">
        <div styleName="signUpButton">
          <Button
            type="submit"
          >
            <span>Sign Up</span>
          </Button>
        </div>
        { this.policy }
      </div>
    );

    return (
      <Form onSubmit={this.handleRegistrationClick}>
        <FormHeader
          title="Sign Up"
          linkTitle="Sign In"
        />
        <div styleName="inputBlock">
          <FormInput
            label="Username"
            name="username"
            type="text"
            model={username}
            onChange={this.handleChange}
          />
        </div>
        <div styleName="inputBlock">
          <FormInput
            label="Email"
            name="email"
            type="email"
            model={email}
            validate="email"
            onChange={this.handleChange}
          />
        </div>
        <div styleName="inputBlock">
          <FormInput
            label="Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            onChange={this.handleChange}
          />
        </div>
        {formValid && singUp}
        <div className="separatorBlock">
          <Separator text="or" />
        </div>
        <div styleName="firstButtonBlock">
          <Button
            iconic
            href={this.facebookLoginString()}
          >
            <Icon type="facebook" />
            <span>Sign Up with Facebook</span>
          </Button>
        </div>
        <div>
          <Button
            iconic
            href={this.googleLoginString()}
          >
            <Icon type="google" />
            <span>Sign Up with Google</span>
          </Button>
        </div>
      </Form>
    );
  }
}

Registration.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default Registration;
