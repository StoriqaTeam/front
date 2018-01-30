// @flow

import React, { PureComponent } from 'react';

import { PasswordHints } from 'components/PasswordHints';
import { Tooltip } from 'components/Tooltip';
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
  focus: boolean,
  detectCapsLock: boolean,
  showHints: boolean,
};

type StateType = {
  label: string,
  showPassword: boolean,
  showPasswordButton: boolean,
  formError: string,
  passwordQuality: {
    percentage: number,
    message: string,
    qualityClass: string,
  },
  isCapsLockOn: boolean,
}

class FormInput extends PureComponent<PropsType, StateType> {
  static defaultProps = {
    onChange: () => {},
    label: '',
    placeholder: '',
    type: 'text',
    validate: 'text',
    autocomplete: 'on',
    errorMessage: '',
    className: 'root',
    focus: false,
    detectCapsLock: false,
    showHints: false,
  };
  state: StateType = {
    labelFloat: null,
    showPassword: false,
    showPasswordButton: false,
    formError: '',
    passwordQuality: {
      percentage: 0,
      message: '',
      qualityClass: '',
    },
    isCapsLockOn: false,
  };
  //
  componentDidMount() {
    this.focus();
  }

  /**
   * @desc this is where we're going to put HTMLInput ref
   * @type {{}}
   */
  input = {};

  /**
   * @desc Handles the onChange event by setting the model's value
   * @param {SyntheticEvent<HTMLInputElement>} evt
   * @return {void}
   */
  handleChange = (evt: SyntheticEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    this.validate(name, value);
  };
  /**
   * @desc Handles the onKeyPress event
   * @param {SyntheticEvent<HTMLInputElement>} evt
   * @return {void}
   */
  handleKeyPress = (evt: SyntheticEvent<HTMLInputElement>) => {
    // eslint-disable-next-line
    if (this.props.detectCapsLock) {
      this.setState({
        isCapsLockOn: utils.isCapsLockOn(evt),
      });
      // eslint-disable-next-line
      console.log('utils.isCapsLockOn(evt)', utils.isCapsLockOn(evt));
    }
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
   * @return {void}
   */
  focus = () => {
    if (this.props.focus) {
      this.input.focus();
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
  validate = (inputName: string, inputValue: any) => {
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
  errorClass = (error: string) => (error.length === 0 ? '' : 'invalidInput');
  render() {
    const {
      autocomplete,
      label,
      model,
      name,
      placeholder,
      type,
      className,
      detectCapsLock,
      showHints,
    } = this.props;

    const {
      labelFloat,
      showPassword,
      showPasswordButton,
      formError,
      passwordQuality,
      isCapsLockOn,
    } = this.state;
    // check only when the input is password to make it work when 'showPasswordButton' is enabled
    const isPassword = type === 'password' ? 'password' : type;
    const inputLabel = (
      <label
        styleName={`label ${labelFloat || ''}`}
        htmlFor={name}
      >
        { label }
      </label>
    );
    const capsLockMessage = (
      <div styleName="tooltip">
        <Tooltip text="CAPS LOCK is on" />
      </div>
    );
    const passwordButton = (
      <button styleName="showPassword" onClick={this.handleShowPassword}>
        <EyeOpenIcon /> <small>Show</small>
      </button>
    );
    const passwordHints = (
      <PasswordHints {...passwordQuality} />
    );
    const inputLabelContent = (label) ? inputLabel : null;
    // Only when 'detectCapsLock', 'isCapsLockOn' are true
    const capsLockMessageContent = (detectCapsLock && isCapsLockOn) ? capsLockMessage : null;
    //
    const showPasswordButtonAndHints = (showHints && showPasswordButton && type === 'password');
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
          ref={(node) => { this.input = node; }}
          autoComplete={autocomplete}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyPress}
          placeholder={placeholder}
        />
        { inputLabelContent }
        <span styleName="message">
          { formError }
        </span>
        { capsLockMessageContent }
        { showPasswordContent }
        { passwordHintsContent }
      </span>
    );
  }
}

export default FormInput;
