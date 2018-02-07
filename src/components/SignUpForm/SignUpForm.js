// @flow

import React, { PureComponent } from 'react';

import { Icon } from 'components/Icon';
import { Form } from 'components/Form';
import { FormHeader } from 'components/FormHeader';
import { FormInput } from 'components/FormInput';
import { Button } from 'components/Button';
import { Separator } from 'components/Separator';

import { log } from 'utils';

import './SignUpForm.scss';

type StateType = {
  username: string,
  usernameValid: boolean,
  email: string,
  emailValid: boolean,
  password: string,
  passwordValid: boolean,
  formValid: boolean
}

class SignUpForm extends PureComponent<{}, StateType> {
  state: StateType = {
    username: '',
    usernameValid: false,
    email: '',
    emailValid: false,
    password: '',
    passwordValid: false,
    formValid: false,
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
   * @desc handles onSubmit event
   */
  handleSubmit = () => {
    log.info('submited');
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
    const { usernameValid, emailValid, passwordValid } = this.state;
    this.setState({ formValid: usernameValid && emailValid && passwordValid });
  };
  /**
   * @desc handles handleProviderAuth event
   */
  handleProviderAuth = () => {};

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
            onClick={this.handleSubmit}
          >
            <span>Sign Up</span>
          </Button>
        </div>
        { this.policy }
      </div>
    );

    return (
      <Form
        wrapperClass="auth"
        onSubmit={this.handleSubmit}
      >
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
            onClick={this.handleProviderAuth}
          >
            <Icon type="facebook" />
            <span>Sign Up with Facebook</span>
          </Button>
        </div>
        <div>
          <Button
            iconic
            onClick={this.handleProviderAuth}
          >
            <Icon type="google" />
            <span>Sign Up with Google</span>
          </Button>
        </div>
      </Form>
    );
  }
}

export default SignUpForm;
