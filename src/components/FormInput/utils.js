/**
 * @desc Set form error message based on its validation
 * @param {String} value
 * @param {String} validModel
 * @param {String} message = 'Invalid'
 * @param {String} errorMessage'
 * @return {string}
 */
function setErrorMessage(value, validModel, message = 'Invalid', errorMessage) {
  // check for enabling custom error message.
  const error = (errorMessage !== '') ? errorMessage : message;
  let formError = '';
  formError = validModel ? '' : ` ${error}`;
  // fallback
  formError = value === '' ? '' : formError;
  return formError;
}
/**
 * @desc validates that the value is an email
 * @param {String} value
 * @return {Array|null}
 */
function validateEmail(value) {
  const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/;
  return value.match(emailRegex);
}
/**
 * @desc validates that the value is a number
 * @param {String} value
 * @return {Array|null}
 */
function validateNumber(value) {
  const numberRegex = /\d/;
  return value.match(numberRegex);
}
/**
 * @desc applies the password quality based on the length.
 * @param {String} value
 * @return {Object}
 */
function passwordQuality(value) {
  return {
    lowerCase: value.match(/(?=.*?[a-z])/),
    upperCase: value.match(/(?=.*?[A-Z])/),
    digit: value.match(/(?=.*?[0-9])/),
    specialCharacter: value.match(/(?=.*?[#?!@$%^&*-])/),
    length: value.length >= 8,
  };
}
/**
 * @param {String} name - input's name
 * @param {any} value - input's value
 * @param {String} validate - What kind of validation it should be used
 * @param {String} errorMessage - The custom error message given by the user
 * @return {Object}
 */
function validateField(name, value, validate, errorMessage) {
  let validModel = '';
  let formError = '';
  let passwordQualityResult = {};
  switch (validate) {
    case 'text':
      validModel = value !== '';
      break;
    case 'number':
      validModel = validateNumber(value);
      formError = setErrorMessage(value, validModel, 'Only numbers', errorMessage);
      break;
    case 'email':
      validModel = validateEmail(value);
      formError = setErrorMessage(value, validModel, 'Invalid Email', errorMessage);
      break;
    case 'password':
      validModel = value.length >= 3;
      passwordQualityResult = passwordQuality(value);
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

export default {
  validateField,
};
