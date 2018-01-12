import React, { PureComponent } from 'react';

class SignUpForm extends PureComponent {
  /**
   * @desc handles onSubmit event
   */
  handleSubmit = () => {};

  render() {
    return (
      <form className="signUpForm" onSubmit={this.handleSubmit}>
        <h1>Sign Up</h1>
        <input type="text" className="signUpFormInput" placeholder="Username" />
        <input type="email" className="signUpFormInput" placeholder="Email" />
        <input type="password" className="signUpFormInput" placeholder="Password" />
        <button type="button">Sign Up</button>
      </form>
    );
  }
}

export default SignUpForm;
