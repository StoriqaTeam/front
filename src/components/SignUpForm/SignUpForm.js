import React, { PureComponent } from 'react';
import { Button } from '../Button';
import GoogleIcon from '../../assets/svg/google-icon.svg';

import { SignUpFormInput } from '../SignUpFormInput';

class SignUpForm extends PureComponent {
  state = {
    usernameValid: false,
    emailValid: false,
    passwordValid: false,
    formValid: false,
  };
  /**
   * @desc Storiqa's anti-span policy
   * @type {String}
   */
  policy = 'By clicking this button, you agree to Storiqa’s Anti-spam Policy & Terms of Use.';
  /**
   * @desc handles onSubmit event
   */
  handleSubmit = (evt) => {
    evt.preventDefault();
  };
  /**
   * @desc handles onChange event by setting the validity of the desired input
   * @param {String} name
   * @param {any} value
   * @return {void}
   */
  handleChange = (name, value) => {
    this.setState({ [name]: value }, () => this.validateForm());
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
   * @desc handles onClick event
   */
  handleClick = () => {};
  /**
   * @desc handles handleGoogleClick event
   */
  handleGoogleClick = () => {};
  render() {
    return (
      <form className="signUpForm" onSubmit={this.handleSubmit}>
        <h1>Sign Up</h1>
        <div className="signUpFormGroup">
          <SignUpFormInput
            name="Username"
            type="text"
            onChange={e => this.handleChange('usernameValid', e)}
          />
        </div>
        <div className="signUpFormGroup">
          <SignUpFormInput
            name="Email"
            type="email"
            validate="email"
            onChange={e => this.handleChange('emailValid', e)}
          />
        </div>
        <div className="signUpFormGroup">
          <SignUpFormInput
            name="Password"
            type="password"
            validate="password"
            onChange={e => this.handleChange('passwordValid', e)}
          />
        </div>
        <div className="signUpFormGroup">
          <GoogleIcon className="signUpFormGoogleIcon" />
          <Button
            buttonClass="signUpFormGoogleButton"
            title="Sign up with google"
            onClick={this.handleGoogleClick}
          />
        </div>
        <div className="signUpFormSignUp">
          <Button
            type="submit"
            buttonClass="signUpFormButton"
            title="Sign Up"
            onClick={this.handleSubmit}
            disabled={!this.state.formValid}
          />
          <span className="signUpFormPolicy">{this.policy}</span>
        </div>
      </form>
    );
  }
}

export default SignUpForm;
