import React, { PureComponent } from 'react';
import { Button } from '../Button';
import { ProgressBar } from '../ProgressBar';
import googleIcon from '../../assets/svg/google-icon.svg';
import eyeOpen from '../../assets/svg/eye-open.svg';

class SignUpForm extends PureComponent {
  state = {
    username: '',
    email: '',
    password: '',
    formErrors: { username: '', email: '', password: '' },
    passwordQuality: {
      percentage: 0,
      message: '',
      color: '',
      qualityClass: '',
    },
    usernameValid: false,
    emailValid: false,
    passwordValid: false,
    formValid: false,
    showPassword: false,
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
   * @desc handles onChange event by setting the state by input's name property
   * @param {SyntheticEvent} evt
   * @return {void}
   */
  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.setState({ [name]: value }, () => this.validateField(name, value));
  };
  /**
   * @param {String} fieldName
   * @param {any} value
   * @return {void}
   */
  validateField = (fieldName, value) => {
    const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
    const fieldValidationErrors = this.state.formErrors;
    let { usernameValid, emailValid, passwordValid } = this.state;
    switch (fieldName) {
      case 'username':
        usernameValid = value !== '';
        fieldValidationErrors.username = usernameValid ? '' : ' is invalid';
        break;
      case 'email':
        emailValid = value.match(emailRegex);
        fieldValidationErrors.email = emailValid ? '' : ' Invalid Email';
        break;
      case 'password':
        this.passwordQuality(value);
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid ? '' : ' Too simple';
        break;
      default:
        break;
    }
    this.setState({
      formErrors: fieldValidationErrors,
      emailValid,
      passwordValid,
    }, this.validateForm);
  };
  /**
   * @desc Validates the form based on its values
   * @return {void}
   */
  validateForm = () => {
    this.setState({ formValid: this.state.username && this.state.passwordValid });
  };
  /**
   * @desc applies the corresponding error class
   * @param {String} error
   * @return {String}
   */
  errorClass = error => (error.length === 0 ? 'valid-input' : 'has-error');
  /**
   * @desc handles onClick event
   */
  handleClick = () => {};
  /**
   * @desc handles handleGoogleClick event
   */
  handleGoogleClick = () => {};
  /**
   * @desc show password to the user
   * @return {void}
   */
  handleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  /**
   * @desc applies the qualiy based on the length.
   * @param {String} value
   * @return {void}
   */
  passwordQuality = (value) => {
    const quality = this.state.passwordQuality;
    if (value.length >= 6) {
      quality.percentage = 20;
      quality.message = 'Too simple';
      quality.qualityClass = 'simple';
    }
    if (value.length >= 8) {
      quality.percentage = 60;
      quality.message = 'Good';
      quality.qualityClass = 'good';
    }
    if (value.length >= 12) {
      quality.percentage = 100;
      quality.message = 'Excellent';
      quality.qualityClass = 'excellent';
    }
    this.setState({ passwordQuality: quality });
  };

  render() {
    // eslint-disable-next-line
    const { username, email, password, showPassword, formErrors } = this.state;
    const { percentage, message, qualityClass } = this.state.passwordQuality;
    return (
      <form className="signUpForm" onSubmit={this.handleSubmit}>
        <h1>Sign Up</h1>
        <div className="signUpFormGroup">
          <input type="text" className={`signUpFormInput ${this.errorClass(formErrors.username)}`} name="username" value={username} onChange={this.handleChange} />
          <label className="signUpFormLabel" htmlFor="username">Username</label>
        </div>
        <div className="signUpFormGroup">
          <input type="email" className={`signUpFormInput ${this.errorClass(formErrors.email)}`} name="email" value={email} onChange={this.handleChange} />
          <label className="signUpFormLabel" htmlFor="email">Email</label>
        </div>
        <div className="signUpFormGroup">
          <input type={showPassword ? 'text' : 'password'} className={`signUpFormInputPassword ${this.errorClass(formErrors.password)}`} name="password" value={password} onChange={this.handleChange} />
          <label className="signUpFormLabel" htmlFor="password">Password</label>
          <button className="signUpFormShowPassword" onClick={this.handleShowPassword}>
            <img src={eyeOpen} alt="show password" /> <span>Show</span>
          </button>
          <ProgressBar percentage={percentage} message={message} qualityClass={qualityClass} />
        </div>
        <div className="signUpFormGroup">
          <img className="signUpFormGoogleIcon" src={googleIcon} alt="google icon" />
          <Button buttonClass="signUpFormGoogleButton" title="Sign up with google" onClick={this.handleGoogleClick} />
        </div>
        <div className="signUpFormSignUp">
          <Button type="submit" buttonClass="signUpFormButton" title="Sign Up" onClick={this.handleSubmit} disabled={!this.state.formValid} />
          <span className="signUpFormPolicy">{this.policy}</span>
        </div>
      </form>
    );
  }
}

export default SignUpForm;
