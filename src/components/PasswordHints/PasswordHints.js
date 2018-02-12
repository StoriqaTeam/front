// @ flow

import React from 'react';

import './PasswordHints.scss';

type PropTypes = {
  lowerCase?: boolean,
  upperCase?: boolean,
  digit?: boolean,
  specialCharacter?: boolean,
  length?: boolean
}

const PasswordHints = (props: PropTypes) => {
  const {
    lowerCase,
    upperCase,
    digit,
    specialCharacter,
    length,
  } = props;
  return (
    <aside styleName="container">
      <ul styleName="list">
        <li styleName={lowerCase ? 'valid' : 'list-item'}>One lower case character</li>
        <li styleName={upperCase ? 'valid' : 'list-item'}>One upper case character</li>
        <li styleName={digit ? 'valid' : 'list-item'}>One number</li>
        <li styleName={specialCharacter ? 'valid' : 'list-item'}>One upper special character</li>
        <li styleName={length ? 'valid' : 'list-item'}>8 characters minimum</li>
      </ul>
    </aside>
  );
};

PasswordHints.defaultProps = {
  lowerCase: false,
  upperCase: false,
  digit: false,
  specialCharacter: false,
  length: false,
};

export default PasswordHints;
