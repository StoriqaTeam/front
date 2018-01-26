// @flow

import React, { PureComponent } from 'react';

import GoogleIcon from 'assets/svg/google-icon.svg';
import FacebookIcon from 'assets/svg/facebook-icon.svg';

import { FormInput } from 'components/FormInput';
import { Button } from 'components/Button';
import { Separator } from 'components/Separator';
import './SignUpForm.scss';

type StateType = {
  username: string,
  usernameValid: boolean,
  email: string,
  emailValid: boolean,
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
    <span>
      <span style={{ color: '#939393' }}>By clicking this button, you agree to Storiqa’s </span>
      <span style={{ color: '#505050' }}>Anti-spam Policy & Terms of Use.</span>
    </span>
  );
  /**
   * @desc handles onSubmit event
   */
  handleSubmit = (evt) => {
    evt.preventDefault();
  };
  /**
   * @desc handles onChange event by setting the validity of the desired input
   * @param {SyntheticEvent} evt
   * @param {String} evt.name
   * @param {any} evt.value
   * @param {Boolean} evt.validity
   * @return {void}
   */
  handleChange = ({ name, value, validity }) => {
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
      <div styleName="signUpFormSignUp">
        <Button
          type="submit"
          buttonClass="signUpFormButton"
          title="Sign Up"
          onClick={this.handleSubmit}
        />
        <span styleName="signUpFormPolicy">{ this.policy }</span>
      </div>
    );
    // Show only when the form is valid
    const singUpContent = formValid ? singUp : null;
    return (
      <form styleName="signUpForm" noValidate onSubmit={this.handleSubmit}>
        <header styleName="signUpFormHeader">
          <h1>Sign Up</h1>
          <a>Sign In</a>
        </header>
        <div styleName="signUpFormGroup">
          <FormInput
            label="Username"
            name="username"
            type="text"
            model={username}
            onChange={this.handleChange}
          />
        </div>
        <div styleName="signUpFormGroup">
          <FormInput
            label="Email"
            name="email"
            type="email"
            model={email}
            validate="email"
            onChange={this.handleChange}
          />
        </div>
        <div styleName="signUpFormGroup">
          <FormInput
            label="Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            onChange={this.handleChange}
          />
        </div>
        { singUpContent }
        <Separator text="or" />
        <div styleName="signUpFormAuthProvider">
          <GoogleIcon styleName="signUpFormButtonIcon" />
          <Button
            buttonClass=""
            title="Sign up with Google"
            onClick={this.handleProviderAuth}
          />
        </div>
        <div styleName="signUpFormAuthProvider">
          <FacebookIcon styleName="signUpFormButtonIcon" />
          <Button
            buttonClass=""
            title="Sign up with Facebook"
            onClick={this.handleProviderAuth}
          />
        </div>
      </form>
    );
  }
}

export default SignUpForm;
