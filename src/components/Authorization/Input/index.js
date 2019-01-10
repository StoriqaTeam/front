// @flow strict

import React, { PureComponent } from 'react';
import punycode from 'punycode';

import classNames from 'classnames';

import { PasswordHints } from 'components/PasswordHints';
import { CapsLockMessage } from 'components/CapsLockMessage';
import { Icon } from 'components/Icon';

import { log } from 'utils';

import './Input.scss';

import { validateField, isCapsLock } from '../utils';

import t from './i18n';

type PropsType = {
  label: string,
  placeholder: ?string,
  className: string,
  name: string,
  model: string,
  type: ?string,
  validate: string,
  errorMessage: string,
  onChange: ({
    name: string,
    value: string,
    validity: boolean,
  }) => void,
  focus: boolean,
  detectCapsLock: boolean,
  autocomplete: boolean,
  errors: ?Array<string>,
  thisFocus: boolean,
  showResendEmail: boolean,
  onResendEmail: () => void,
  noPasswordHints: boolean,
};

type StateType = {
  labelFloat: string,
  showPassword: boolean,
  showPasswordButton: boolean,
  showHints: boolean,
  formError: string,
  passwordQuality: {
    lowerCase: boolean,
    upperCase: boolean,
    digit: boolean,
    length: boolean,
  },
  isCapsLockOn: boolean,
  validity: boolean,
  isFocus: boolean,
  isFocusShow: boolean,
};

class Input extends PureComponent<PropsType, StateType> {
  static defaultProps = {
    onChange: () => {},
    onResendEmail: () => {},
    label: '',
    placeholder: '',
    type: 'text',
    validate: 'text',
    autocomplete: false,
    errorMessage: '',
    className: 'root',
    focus: false,
    detectCapsLock: false,
    isFocus: false,
    isFocusShow: false,
    noPasswordHints: false,
    showResendEmail: false,
    thisFocus: false,
  };
  state = {
    labelFloat: '',
    showPassword: false,
    showPasswordButton: false,
    showHints: false,
    formError: '',
    passwordQuality: {
      lowerCase: false,
      upperCase: false,
      digit: false,
      length: false,
    },
    isCapsLockOn: false,
    validity: false,
    isFocus: false,
    isFocusShow: false,
  };

  componentDidMount() {
    const { input } = this;
    if (input && this.props.thisFocus) {
      input.focus();
    }
  }

  onMouseDown = (): void => this.setState({ isFocusShow: true });

  onMouseUp = (): void => this.setState({ isFocusShow: false });

  onMouseOut = (): void => this.setState({ isFocusShow: false });

  /**
   * @desc Handles the onChange event by setting the model's value
   * @param {SyntheticEvent} evt
   * @return {void}
   */
  handleChange = (evt: { target: { name: string, value: string } }): void => {
    const { name } = evt.target;
    let { value } = evt.target;
    if (name === 'email') {
      value = punycode.toUnicode(value).replace(/[^\w-/@/.]/g, '');
    }
    this.validate(name, value);

    this.setState({
      showPasswordButton: name === 'password' && value.length > 0,
    });
  };
  /**
   * @desc Handles the onKeyPress event
   * @param {KeyboardEvent} evt
   * @return {void}
   */
  handleKeyPress = (evt: KeyboardEvent): void => {
    if (this.props.detectCapsLock) {
      this.setState({
        isCapsLockOn: isCapsLock(evt),
      });
      log.info('isCapsLock(evt)', isCapsLock(evt));
    }
  };

  /**
   * @desc make the label floats if the model isn't empty
   * and toggles 'showPasswordButton'
   * @return {void}
   */
  handleFocus = (evt: { target: { name: string, value: string } }): void => {
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
    this.setState({ isFocus: true });
  };

  /**
   * @desc Puts back the label to its original position if the model is empty
   * @return {void}
   */
  handleBlur = (): void => {
    const { model, name } = this.props;

    if (model === '') {
      this.setState({
        labelFloat: '',
      });
    }

    if (name === 'password') {
      this.setState(prevState => ({
        showHints: prevState.showHints ? prevState.isFocusShow : false,
      }));
    }
    this.setState({ isFocus: false });
  };

  /**
   * @param {String} inputName - input's name
   * @param {string} inputValue - input's value
   * @return {void}
   */
  validate = (inputName: string, inputValue: string): void => {
    const { validate, errorMessage, onChange } = this.props;
    const { name, value, validity, formError, passwordQuality } = validateField(
      inputName,
      inputValue,
      validate,
      errorMessage,
    );
    this.setState(
      {
        formError,
        passwordQuality,
        validity,
        showHints: inputName === 'password' && !validity,
      },
      onChange({
        name,
        value,
        validity,
      }),
    );
  };

  /**
   * @desc show password to the user
   * @return {void}
   */
  handleShowPassword = (): void => {
    if (this.input) {
      this.input.focus();
    }
    this.setState({ showPassword: !this.state.showPassword });
  };

  /**
   * @desc this is where we're going to put HTMLInput ref
   * @type {{}}
   */
  input = {};

  errorClass = (error: string): string =>
    error.length === 0 ? '' : 'invalidInput';

  render() {
    const {
      autocomplete,
      label,
      model,
      name,
      placeholder,
      type,
      detectCapsLock,
      errors,
      showResendEmail,
      onResendEmail,
      noPasswordHints,
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
      isFocus,
      isFocusShow,
    } = this.state;
    return (
      <span>
        <div
          styleName={classNames('input', {
            isFocus: isFocus || isFocusShow,
            isError: (errors || formError) && !isFocus && !isFocusShow,
            validity,
          })}
        >
          {label && (
            <label
              styleName={`label ${labelFloat ||
                (model && model.length > 0 && 'labelFloat') ||
                ''}`}
              htmlFor={name}
            >
              {label}
            </label>
          )}
          <input
            type={showPassword ? 'text' : type}
            name={name}
            value={model}
            ref={node => {
              this.input = node;
            }}
            autoComplete={autocomplete ? 'on' : 'off'}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            placeholder={placeholder}
            data-test={name}
          />
          <hr />
        </div>
        {formError &&
          !isFocus &&
          !isFocusShow && <span styleName="message">{formError}</span>}

        {detectCapsLock && isCapsLockOn && <CapsLockMessage />}
        {showPasswordButton && (
          <div
            styleName={classNames('icon', { openIcon: showPassword })}
            onClick={this.handleShowPassword}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseOut={this.onMouseOut}
            onBlur={() => {}}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            <Icon type="eye" size={28} />
          </div>
        )}
        {!noPasswordHints &&
          showHints && <PasswordHints {...passwordQuality} />}
        {errors &&
          errors.length > 0 && (
            <div styleName="errors">
              {errors.map((item, idx) => (
                <div key={/* eslint-disable */ idx /* eslint-enable */}>
                  {item}
                </div>
              ))}
              {showResendEmail ? (
                <span
                  tabIndex="-1"
                  onKeyPress={() => {}}
                  styleName="resendEmail"
                  role="button"
                  onClick={onResendEmail}
                >
                  {t.resendVerificationEmail}
                </span>
              ) : null}
            </div>
          )}
      </span>
    );
  }
}

export default Input;
