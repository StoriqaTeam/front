import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ProgressBar } from '../ProgressBar';
import eyeOpen from '../../assets/svg/eye-open.svg';


class SignUpFormInput extends PureComponent {
  static defaultProps = {
    onChange: () => {},
    type: 'text',
    name: 'signUpFormInput',
    validate: 'text',
  };
  state = {
    model: '',
    labelFloat: '',
    validModel: false,
    showPassword: false,
    showPasswordButton: false,
    passwordQuality: {
      percentage: 0,
      message: '',
      color: '',
      qualityClass: '',
    },
  };
  handleChange = (evt) => {
    const { value } = evt.target;
    this.setState({ model: value }, () => {
      this.validateField(value);
    });
  };
  handleFocus = () => {
    const { model, showPasswordButton } = this.state;
    if (model === '') {
      this.setState({
        labelFloat: 'signUpFormInputLabelFloat',
        showPasswordButton: !showPasswordButton,
      });
    }
  };
  handleBlur = () => {
    const { model, showPasswordButton } = this.state;
    if (model === '') {
      this.setState({
        labelFloat: '',
        showPasswordButton: !showPasswordButton,
      });
    }
  };
  /**
   * @desc Strong email regular expression
   * @type {RegExp}
   */
  emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  /**
   * @param {any} value
   * @return {void}
   */
  validateField = (value) => {
    // const fieldValidationErrors = this.state.formErrors;
    // eslint-disable-next-line
    let { validModel } = this.state;
    const { validate } = this.props;
    switch (validate) {
      case 'text':
        validModel = value !== '';
        break;
      case 'email':
        validModel = value.match(this.emailRegex);
        break;
      case 'password':
        validModel = value.length >= 3;
        this.passwordQuality(value);
        break;
      default:
        break;
    }
    this.props.onChange(validModel);
  };
  /**
   * @desc show password to the user
   * @return {void}
   */
  handleShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  /**
   * @desc applies the passwrod quality based on the length.
   * @param {String} value
   * @return {void}
   */
  passwordQuality = (value) => {
    const quality = this.state.passwordQuality;
    if (value.length >= 3) {
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
    if (value.length === 0) {
      quality.percentage = 0;
      quality.message = '';
      quality.qualityClass = '';
    }
    this.setState({ passwordQuality: quality });
  };
  render() {
    const { name, type } = this.props;
    const { labelFloat, showPassword, showPasswordButton } = this.state;
    // check only when the input is password to make it work when 'showPasswordButton' is enabled
    const isPassword = type === 'password' ? 'password' : type;
    const passwordButton = (
      <button className="signUpFormShowPassword" onClick={this.handleShowPassword}>
        <img src={eyeOpen} alt="show password" /> <span>Show</span>
      </button>
    );
    const progressBar = (
      <ProgressBar
        percentage={this.state.passwordQuality.percentage}
        message={this.state.passwordQuality.message}
        qualityClass={this.state.passwordQuality.qualityClass}
      />
    );
    // ONLY when type is password and showPasswordButton so the user can see the password is typing
    const showPasswordContent = (showPasswordButton && type === 'password') ? passwordButton : null;
    // ONLY when type is password, so the user can see the progress bar
    const progressBarContent = type === 'password' ? progressBar : null;
    return (
      <span>
        <input
          type={showPassword ? 'text' : isPassword}
          className="signUpFormInput"
          name={name}
          value={this.state.model}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
        />
        <label className={`signUpFormLabel ${labelFloat}`} htmlFor={name}>{name}</label>
        { showPasswordContent }
        { progressBarContent }
      </span>
    );
  }
}

SignUpFormInput.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  validate: PropTypes.string,
  onChange: PropTypes.func,
};

export default SignUpFormInput;
