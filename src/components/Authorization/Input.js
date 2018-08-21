// @flow

// TODO: do refactoring after tests

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import { PasswordHints } from 'components/PasswordHints';
import { CapsLockMessage } from 'components/CapsLockMessage';
import { Icon } from 'components/Icon';

import { log } from 'utils';

import './Input.scss';
import utils from './utils';

type PropsType = {
  label: ?string,
  placeholder: ?string,
  className: string,
  name: string,
  model: string,
  type: ?string,
  validate: ?string,
  errorMessage: ?string,
  onChange: Function,
  focus: boolean,
  detectCapsLock: boolean,
  autocomplete: ?boolean,
  errors: ?Array<string>,
  thisFocus: ?boolean,
  showResendEmail: ?boolean,
  onResendEmail: () => any,
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
    isFocus: false,
    isFocusShow: false,
  };

  componentDidMount() {
    const { input } = this;

    if (input && this.props.thisFocus) {
      input.focus();
    }
  }

  onMouseDown = () => {
    this.setState({ isFocusShow: true });
  };

  onMouseUp = () => {
    this.setState({ isFocusShow: false });
  };

  onMouseOut = () => {
    this.setState({ isFocusShow: false });
  };

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
    this.setState({ isFocus: true });
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
      this.setState(prevState => ({
        showHints: prevState.showHints ? prevState.isFocusShow : false,
      }));
    }
    this.setState({ isFocus: false });
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

    this.setState(
      {
        formError,
        passwordQuality,
        validity,
        showHints: inputName === 'password' && !validity,
      },
      this.props.onChange({
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
  handleShowPassword = () => {
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

  errorClass = (error: string) => (error.length === 0 ? '' : 'invalidInput');

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
            <Icon type="eye" size="28" />
          </div>
        )}
        {showHints && <PasswordHints {...passwordQuality} />}
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
                  Resend verification Email
                </span>
              ) : null}
            </div>
          )}
      </span>
    );
  }
}

export default Input;
