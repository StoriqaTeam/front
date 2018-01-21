import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'components/ProgressBar';
import EyeOpenIcon from 'assets/svg/eye-open.svg';

import utils from './utils';

class SignUpFormInput extends PureComponent {
  static defaultProps = {
    onChange: () => {},
    label: '',
    placeholder: '',
    type: 'text',
    validate: 'text',
    autocomplete: 'on',
    errorMessage: '',
  };
  state = {
    labelFloat: '',
    showPassword: false,
    showPasswordButton: false,
    formError: '',
    passwordQuality: {
      percentage: 0,
      message: '',
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
    this.validate(name, value);
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
   * @param {String} inputName - input's name
   * @param {any} inputValue - input's value
   * @return {void}
   */
  validate = (inputName, inputValue) => {
    const { validate, errorMessage } = this.props;
    const {
      name,
      value,
      validity,
      formError,
      passwordQuality,
    } = utils.validateField(inputName, inputValue, validate, errorMessage);
    this.setState({ formError, passwordQuality }, this.props.onChange({
      name,
      value,
      validity,
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
   * @desc applies the corresponding error class
   * @param {String} error
   * @return {String}
   */
  errorClass = error => (error.length === 0 ? '' : 'invalidInput');
  render() {
    const {
      autocomplete,
      label,
      model,
      name,
      placeholder,
      type,
    } = this.props;
    const {
      labelFloat,
      showPassword,
      showPasswordButton,
      formError,
    } = this.state;
    // check only when the input is password to make it work when 'showPasswordButton' is enabled
    const isPassword = type === 'password' ? 'password' : type;
    const inputLabel = (
      <label
        className={`signUpFormLabel ${labelFloat}`}
        htmlFor={name}
      >
        { label }
      </label>
    );
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
    const inputLabelContent = (label) ? inputLabel : null;
    // ONLY when type is password and showPasswordButton so the user can see the password is typing
    // eslint-disable-next-line
    const showPasswordContent = (showPasswordButton && type === 'password') ? passwordButton : null;
    // ONLY when type is password, so the user can see the progress bar
    const progressBarContent = type === 'password' ? progressBar : null;
    return (
      <span>
        <input
          type={showPassword ? 'text' : isPassword}
          className={`signUpFormInput ${this.errorClass(formError)}`}
          name={name}
          value={model}
          autoComplete={autocomplete}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          placeholder={placeholder}
        />
        { inputLabelContent }
        <span className="signUpFormInputMessage">
          { formError }
        </span>
        { showPasswordContent }
        { progressBarContent }
      </span>
    );
  }
}

SignUpFormInput.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  model: PropTypes.string.isRequired,
  type: PropTypes.string,
  validate: PropTypes.string,
  autocomplete: PropTypes.string,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
};

export default SignUpFormInput;
