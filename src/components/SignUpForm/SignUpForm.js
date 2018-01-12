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

  render() {
    return (
      <form className="signUpForm" onSubmit={this.handleSubmit}>
        <h1>Sign Up</h1>
        <input type="text" className="signUpFormInput" placeholder="Username" />
        <input type="email" className="signUpFormInput" placeholder="Email" />
        <input type="password" className="signUpFormInput" placeholder="Password" />
        <div className="signUpFormSignUp">
          <Button title="Sign Up" onClick={this.handleClick} />
          <span className="signUpFormPolicy">{this.policy}</span>
        </div>
      </form>
    );
  }
}

export default SignUpForm;
