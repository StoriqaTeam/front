// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { PasswordHints } from 'components/PasswordHints';
import { CapsLockMessage } from 'components/CapsLockMessage';
import { ShowPassword } from 'components/ShowPassword';

import { log } from 'utils';

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
  onChange: Function,
  focus: boolean,
  detectCapsLock: boolean,
};

type StateType = {
  labelFloat: string | null,
  showPassword: boolean,
  showPasswordButton: boolean,
  showHints: boolean,
  formError: string,
  passwordQuality: {
    percentage: number,
    message: string,
    qualityClass: string,
  },
  isCapsLockOn: boolean,
  validity: ?boolean,
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
  };
  state: StateType = {
    labelFloat: null,
    showPassword: false,
    showPasswordButton: false,
    showHints: false,
    formError: '',
    passwordQuality: {
      percentage: 0,
      message: '',
      qualityClass: '',
    },
    isCapsLockOn: false,
    validity: null,
  };

  componentDidMount() {
    const { input } = this;

    if (input && input.name === 'username') {
      input.focus();
    }
  }

  /**
   * @desc this is where we're going to put HTMLInput ref
   * @type {{}}
   */
  input = {};

  /**
   * @desc Handles the onChange event by setting the model's value
   * @param {SyntheticEvent} evt
   * @return {void}
   */
  handleChange = (evt: { target: { name: string, value: string } }) => {
    const { name, value } = evt.target;
    this.validate(name, value);

    this.setState({
      showPasswordButton: name === 'password' && value.length > 0,
    });
  };
  /**
   * @desc Handles the onKeyPress event
   * @param {SyntheticEvent} evt
   * @return {void}
   */
  handleKeyPress = (evt: {}) => {
    if (this.props.detectCapsLock) {
      this.setState({
        isCapsLockOn: utils.isCapsLockOn(evt),
      });
      log.info('utils.isCapsLockOn(evt)', utils.isCapsLockOn(evt));
    }
  };

  /**
   * @desc make the label floats if the model isn't empty
   * and toggles 'showPasswordButton'
   * @return {void}
   */
  handleFocus = (evt: { target: { name: string, value: string } }) => {
    const { name, value } = evt.target;
    const { model } = this.props;
    const { validity } = this.state;
    this.validate(name, value);

    if (model === '') {
      this.setState({
        labelFloat: 'labelFloat',
      });
    }

    if (name === 'password' && !validity) {
      this.setState({
        showHints: true,
      });
    }
  };

  /**
   * @return {void}
   */
  focus = () => {
    if (this.input && this.props.focus) {
      this.input.focus();
    }
  };

  /**
   * @desc Puts back the label to its original position if the model is empty
   * @return {void}
   */
  handleBlur = () => {
    const { model, name } = this.props;

    if (model === '') {
      this.setState({
        labelFloat: null,
      });
    }

    if (name === 'password') {
      this.setState({
        showHints: false,
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

    this.setState({
      formError,
      passwordQuality,
      validity,
      showHints: inputName === 'password' && !validity,
    }, this.props.onChange({
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
    if (this.input) {
      this.input.focus();
    }

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
    } = this.props;

    const {
      labelFloat,
      showPassword,
      showPasswordButton,
      showHints,
      formError,
      passwordQuality,
      isCapsLockOn,
      validity,
    } = this.state;
    const inputLabel = (
      <label
        styleName={`label ${labelFloat || ''}`}
        htmlFor={name}
      >
        { label }
      </label>
    );
    const passwordButton = (
      <ShowPassword
        show={showPassword}
        onClick={this.handleShowPassword}
      />
    );
    const passwordHints = (
      <PasswordHints {...passwordQuality} />
    );
    const inputLabelContent = (label) ? inputLabel : null;
    // Only when 'detectCapsLock', 'isCapsLockOn' are true
    const capsLockMessageContent = (detectCapsLock && isCapsLockOn) ? CapsLockMessage : null;
    // ONLY when type is password and showPasswordButton so the user can see the password is typing
    const showPasswordContent = showPasswordButton ? passwordButton : null;
    // ONLY when type is password, so the user can see the password hints
    const passwordHintsContent = showHints ? passwordHints : null;
    return (
      <span>
        <input
          type={showPassword ? 'text' : type}
          styleName={classNames(className, {
            invalidInput: formError.length !== 0,
            validInput: validity,
          })}
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
