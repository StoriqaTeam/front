// @flow strict

export type InputOnChangeType = ({
  name: string,
  value: string,
  validity: boolean,
}) => void;

export type SignUpInputType = {
  label: string,
  name: string,
  type: string,
  validate?: string,
  thisFocus?: boolean,
  onChange: InputOnChangeType,
  errors: ?Array<string>,
};

export type PasswordQualityType = {
  lowerCase: boolean,
  upperCase: boolean,
  digit: boolean,
  length: boolean,
};

export type ValidFieldType = {
  formError: string,
  name: string,
  value: string,
  validity: boolean,
  passwordQuality: PasswordQualityType,
};

export type ErrorsType = {
  [code: string]: Array<string>,
};

export type InputConfig = {
  label: string,
  type: string,
};
