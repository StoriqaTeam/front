import React, { PureComponent } from 'react';
import { Button } from '../Button';

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
        <input type="text" className="signUpFormInput" placeholder="Username" />
        <input type="email" className="signUpFormInput" placeholder="Email" />
        <input type="password" className="signUpFormInput" placeholder="Password" />
        <Button buttonClass="SignUpFormGoogleButton" title="Sign up with google" onClick={this.handleGoogleClick} />
        <div className="signUpFormSignUp">
          <Button buttonClass="SignUpFormButton" title="Sign Up" onClick={this.handleClick} />
          <span className="signUpFormPolicy">{this.policy}</span>
        </div>
      </form>
    );
  }
}

export default SignUpForm;
