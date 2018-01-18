import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { ProgressBar } from '../ProgressBar';
import EyeOpenIcon from '../../assets/svg/eye-open.svg';

class SignUpFormInput extends PureComponent {
  static defaultProps = {
    onChange: () => {},
    label: '',
    type: 'text',
    model: '',
    name: 'signUpFormInput',
    validate: 'text',
  };
  state = {
    labelFloat: '',
    validModel: false,
    showPassword: false,
    showPasswordButton: false,
    formError: '',
    passwordQuality: {
      percentage: 0,
      message: '',
      color: '',
      qualityClass: '',
    },
  };
  /**
   * @desc Handles the onChange event by setting the model's value
   * @param {SyntheticEvent} evt
   * @return {void}
   */
  handleChange = (evt) => {
    const { name, value } = evt.target;
    this.validateField(name, value);
  };
  /**
   * @desc make the label floats if the model isn't empty
   * and toggles 'showPasswordButton'
   * @return {void}
   */
  handleFocus = () => {
    const { showPasswordButton } = this.state;
    const { model } = this.props;
    if (model === '') {
      this.setState({
        labelFloat: 'signUpFormInputLabelFloat',
        showPasswordButton: !showPasswordButton,
      });
    }
  };
  /**
   * @desc Puts back the label to its original position if the model is empty
   * @return {void}
   */
  handleBlur = () => {
    const { showPasswordButton } = this.state;
    const { model } = this.props;
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
   * @param {String} name - input's name
   * @param {any} value - input's value
   * @return {void}
   */
  validateField = (name, value) => {
    // eslint-disable-next-line
    let { validModel, formError } = this.state;
    const { validate } = this.props;
    switch (validate) {
      case 'text':
        validModel = value !== '';
        break;
      case 'email':
        validModel = value.match(this.emailRegex);
        formError = validModel ? '' : ' Invalid Email';
        // fallback
        formError = value === '' ? '' : formError;
        break;
      case 'password':
        validModel = value.length >= 3;
        this.passwordQuality(value);
        break;
      default:
        break;
    }
    this.setState({ formError }, this.props.onChange({
      name,
      value,
      validity: validModel,
    }));
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
    // Fallback
    if (value.length === 0) {
      quality.percentage = 0;
      quality.message = '';
      quality.qualityClass = '';
    }
    this.setState({ passwordQuality: quality });
  };
  /**
   * @desc applies the corresponding error class
   * @param {String} error
   * @return {String}
   */
  errorClass = error => (error.length === 0 ? '' : 'invalidInput');
  render() {
    const {
      name,
      type,
      label,
      model,
    } = this.props;
    const {
      labelFloat,
      showPassword,
      showPasswordButton,
      formError,
    } = this.state;
    // check only when the input is password to make it work when 'showPasswordButton' is enabled
    const isPassword = type === 'password' ? 'password' : type;
    const passwordButton = (
      <button className="signUpFormInputShowPassword" onClick={this.handleShowPassword}>
        <EyeOpenIcon /> <small>Show</small>
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
    // eslint-disable-next-line
    const showPasswordContent = (showPasswordButton && type === 'password') ? passwordButton : null;
    // ONLY when type is password, so the user can see the progress bar
    const progressBarContent = type === 'password' ? progressBar : null;
    //
    return (
      <span>
        <input
          type={showPassword ? 'text' : isPassword}
          className={`signUpFormInput ${this.errorClass(formError)}`}
          name={name}
          value={model}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
        />
        <label className={`signUpFormLabel ${labelFloat}`} htmlFor={name}>{ label }</label>
        <span className="signUpFormInputMessage">{ formError }</span>
        { showPasswordContent }
        { progressBarContent }
      </span>
    );
  }
}

SignUpFormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  model: PropTypes.string,
  type: PropTypes.string,
  validate: PropTypes.string,
  onChange: PropTypes.func,
};

export default SignUpFormInput;
