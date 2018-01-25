// @flow

import React, { PureComponent } from 'react';

import { PasswordHints } from 'components/PasswordHints';
import EyeOpenIcon from 'assets/svg/eye-open.svg';

import './FormInput.scss';
import utils from './utils';

type PropsType = {
  label: ?string,
  placeholder: ?string,
  className: string,
  name: string,
  model: string,
  type: ?string,
  validate: ?string,
  autocomplete: ?string,
  errorMessage: ?string,
  onChange: ?Function,
};

class FormInput extends PureComponent<PropsType> {
  state = { // TODO: Jero, pls add type for state too. StateType.
    labelFloat: null,
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
        labelFloat: 'labelFloat',
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
        labelFloat: null,
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
      className,
    } = this.props;

    const {
      labelFloat,
      showPassword,
      showPasswordButton,
      formError,
      passwordQuality,
    } = this.state;
    // check only when the input is password to make it work when 'showPasswordButton' is enabled
    const isPassword = type === 'password' ? 'password' : type;
    const inputLabel = (
      <label
        styleName={`label ${labelFloat || ''}`}
        htmlFor={name}
      >
        {label}
      </label>
    );
    const passwordButton = (
      <button styleName="showPassword" onClick={this.handleShowPassword}>
        <EyeOpenIcon /> <small>Show</small>
      </button>
    );
    const passwordHints = (
      <PasswordHints strenght={passwordQuality} />
    );
    const inputLabelContent = (label) ? inputLabel : null;
    //
    const showPasswordButtonAndHints = (showPasswordButton && type === 'password');
    // ONLY when type is password and showPasswordButton so the user can see the password is typing
    const showPasswordContent = showPasswordButtonAndHints ? passwordButton : null;
    // ONLY when type is password, so the user can see the password hints
    const passwordHintsContent = showPasswordButtonAndHints ? passwordHints : null;
    return (
      <span>
        <input
          type={showPassword ? 'text' : isPassword}
          styleName={`${className || ''} ${this.errorClass(formError)}`}
          name={name}
          value={model}
          autoComplete={autocomplete}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          placeholder={placeholder}
        />
        {inputLabelContent}
        <span styleName="message">
          {formError}
        </span>
        {showPasswordContent}
        {passwordHintsContent}
      </span>
    );
  }
}

FormInput.defaultProps = {
  onChange: () => {},
  label: '',
  placeholder: '',
  type: 'text',
  validate: 'text',
  autocomplete: 'on',
  errorMessage: '',
  className: 'root',
};

export default FormInput;
