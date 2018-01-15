import React, { PureComponent } from 'react';
import { Button } from '../Button';
import googleIcon from '../../assets/svg/google-icon.svg';

class SignUpForm extends PureComponent {
  /**
   * @desc Storiqa's anti-span policy
   * @type {String}
   */
  policy = 'By clicking this button, you agree to Storiqa’s Anti-spam Policy & Terms of Use.';
  /**
   * @desc handles onSubmit event
   */
  handleSubmit = () => {};
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
          <input type="text" id="username" className="signUpFormInput" name="username" />
          <label className="signUpFormLabel" htmlFor="username">Username</label>
        </div>
        <div className="signUpFormGroup">
          <input type="email" id="email" className="signUpFormInput" name="email" />
          <label className="signUpFormLabel" htmlFor="email">Email</label>
        </div>
        <div className="signUpFormGroup">
          <input type="password" id="password" className="signUpFormInput" name="password" />
          <label className="signUpFormLabel" htmlFor="password">Password</label>
        </div>
        <div className="signUpFormGroup">
          <img className="signUpFormGoogleIcon" src={googleIcon} alt="google icon" />
          <Button buttonClass="signUpFormGoogleButton" title="Sign up with google" onClick={this.handleGoogleClick} />
        </div>
        <div className="signUpFormSignUp">
          <Button buttonClass="signUpFormButton" title="Sign Up" onClick={this.handleClick} />
          <span className="signUpFormPolicy">{this.policy}</span>
        </div>
      </form>
    );
  }
}

export default SignUpForm;
