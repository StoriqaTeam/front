// @flow strict

import moment from 'moment';
import { assoc, propOr, pipe ,isNil } from 'ramda';

import { setCookie, removeCookie, getCookie } from 'utils';

type SignUpInputType = {
  label: string,
  name: string,
  type: string,
  model: string,
  validate?: string,
  thisFocus?: boolean,
  onChange: () => void,
  errors: ?Array<string>,
};

type PasswordQualityType = {
  lowerCase: boolean,
  upperCase: boolean,
  digit: boolean,
  length: boolean,
};

/**
 * @desc Detects whether or not CAPS LOCK is on.
 * @link http://jsfiddle.net/Mottie/a6nhqvv0/
 * @param {KeyboardEvent} evt
 * @return {boolean}
 */
const isCapsLockOn = (evt: KeyboardEvent): boolean =>
  evt.getModifierState && evt.getModifierState('CapsLock')

/**
 * @desc Set form error message based on its validation
 * @param {String} value
 * @param {String} validModel
 * @param {String} message = 'Invalid'
 * @param {String} errorMessage = ''
 * @return {string}
 */
function setErrorMessage(
  value: string,
  validModel: boolean,
  message: string = 'Invalid',
  errorMessage: string = '',
): string {
  // check for enabling custom error message.
  const error = errorMessage !== '' ? errorMessage : message;
  let formError = '';
  formError = validModel ? '' : ` ${error}`;
  // fallback
  formError = value === '' ? '' : formError;
  return formError;
}
/**
 * @desc validates that the value is an email
 * @link https://github.com/angular/angular/blob/5.2.2/packages/forms/src/validators.ts#L57-L43
 * @param {String} value
 * @return {Boolean}
 */
const validateEmail = (value: string): boolean => {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !isNil(value.match(emailRegex));
}
/**
 * @desc validates that the value is a number
 * @param {String} value
 * @return {boolean}
 */
const validateNumber = (value: string): boolean => {
  const numberRegex = /\d/;
  return !isNil(value.match(numberRegex));
}
/**
 * @desc Checks that the password contains at least the following:
 * one lower case character
 * one upper case character
 * one digit
 * 8 characters
 * @param {String} value
 * @return {PasswordQualityType}
 */
const passwordQuality = (value: string): PasswordQualityType => ({
  lowerCase: /(?=.*?[a-z])/.test(value),
  upperCase: /(?=.*?[A-Z])/.test(value),
  digit: /(?=.*?[0-9])/.test(value),
  length: value.length >= 8,
})
/**
 * @param {String} name - input's name
 * @param {String} value - input's value
 * @param {String} validate - What kind of validation it should be used
 * @param {String} errorMessage - The custom error message given by the user
 * @return {Object}
 */
const validateField = (
  name: string,
  value: string,
  validate: string,
  errorMessage: string,
) => {
  let validModel = '';
  let formError = '';
  let passwordQualityResult = {};
  switch (validate) {
    case 'text':
      validModel = value !== '';
      break;
    case 'number':
      validModel = validateNumber(value);
      formError = setErrorMessage(
        value,
        validModel,
        'Only numbers',
        errorMessage,
      );
      break;
    case 'email':
      validModel = validateEmail(value);
      formError = setErrorMessage(
        value,
        validModel,
        'Invalid Email',
        errorMessage,
      );
      break;
    case 'password':
      passwordQualityResult = passwordQuality(value);
      // check that every value is true.
      validModel = Object.values(passwordQualityResult).every(p => p === true);
      formError = setErrorMessage(
        value,
        validModel,
        'Invalid Password',
        errorMessage,
      );
      break;
    default:
      break;
  }
  return {
    formError,
    name,
    value,
    validity: validModel,
    passwordQuality: passwordQualityResult,
  };
}

const facebookLoginString = () => {
  // $FlowIgnore
  const appId = `${process.env.REACT_APP_OAUTH_FACEBOOK_APP_ID}`;
  // $FlowIgnore
  const redirectUri = `${process.env.REACT_APP_OAUTH_FACEBOOK_REDIRECT_URI}`;
  return `https://www.facebook.com/v2.11/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=email,public_profile&response_type=token`;
};

const googleLoginString = () => {
  // $FlowIgnore
  const appId = `${process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID}`;
  // $FlowIgnore
  const redirectUri = `${process.env.REACT_APP_OAUTH_GOOGLE_REDIRECT_URI}`;
  // $FlowIgnore
  const scopes = `${process.env.REACT_APP_OAUTH_GOOGLE_SCOPES}`;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`;
};

// set in cookies path for redirect after login via oauth provider
const cookiesPathForRedirectAfterLogin = 'REDIRECT_AFTER_LOGIN';
const setPathForRedirectAfterLogin = (path: string) => {
  setCookie(
    cookiesPathForRedirectAfterLogin,
    path,
    moment()
      .utc()
      .add(3, 'm')
      .toDate(),
  );
};
const clearPathForRedirectAfterLogin = () => {
  removeCookie(cookiesPathForRedirectAfterLogin);
};
const getPathForRedirectAfterLogin = (): ?string =>
  getCookie(cookiesPathForRedirectAfterLogin);

const makeInput = (props: {
  [string]: string,
  onChange: () => void,
  errors: Array<string>,
}) => (inputName: string): SignUpInputType => {
  const nowhiteSpace = (str: string): string => str.replace(/ +/g, '');
  /**
   * @link https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
   */
  const camelize = (str: string): string =>
    str.replace(
      /(?:^\w|[A-Z]|\b\w)/g,
      (letter, index) =>
        index === 0 ? letter.toLowerCase() : letter.toUpperCase(),
    );

  const isPasswordOrEmail = (str: string): boolean =>
    str === 'password' || str === 'email';

  const cameledName: string => string = pipe(camelize, nowhiteSpace);

  const setValidate = (input: SignUpInputType): SignUpInputType => {
    if (isPasswordOrEmail(input.type)) {
      return assoc('validate', input.type, input);
    }
    return input;
  };

  const setInitialShape = (label: string): SignUpInputType => {
    const name = cameledName(label);
    return {
      label,
      name,
      type: isPasswordOrEmail(name) ? name : 'text',
      model: props[name],
      onChange: props.onChange,
      errors: propOr(null, name, props.errors),
    };
  };
  return pipe(setInitialShape, setValidate)(inputName);
};

export {
  validateField,
  isCapsLockOn,
  setErrorMessage,
  facebookLoginString,
  googleLoginString,
  setPathForRedirectAfterLogin,
  clearPathForRedirectAfterLogin,
  getPathForRedirectAfterLogin,
  makeInput,
};
