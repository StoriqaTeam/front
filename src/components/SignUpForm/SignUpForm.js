import React, { PureComponent } from 'react';
import GoogleIcon from 'assets/svg/google-icon.svg';

import { FormInput } from 'components/FormInput';
import { Button } from 'components/Button';

class SignUpForm extends PureComponent {
  state = {
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
  policy = 'By clicking this button, you agree to Storiqa’s Anti-spam Policy & Terms of Use.';
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
   * @desc handles handleGoogleClick event
   */
  handleGoogleClick = () => {};

  render() {
    const { username, email, password } = this.state;
    return (
      <form className="signUpForm" noValidate onSubmit={this.handleSubmit}>
        <h1>Sign Up</h1>
        <div className="signUpFormGroup">
          <FormInput
            label="Username"
            name="username"
            type="text"
            model={username}
            onChange={this.handleChange}
          />
        </div>
        <div className="signUpFormGroup">
          <FormInput
            label="Email"
            name="email"
            type="email"
            model={email}
            validate="email"
            onChange={this.handleChange}
          />
        </div>
        <div className="signUpFormGroup">
          <FormInput
            label="Password"
            name="password"
            type="password"
            model={password}
            validate="password"
            onChange={this.handleChange}
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
