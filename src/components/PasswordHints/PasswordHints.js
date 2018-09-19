// @flow strict

import React from 'react';

import './PasswordHints.scss';

type PropTypes = {
  lowerCase: boolean,
  upperCase: boolean,
  digit: boolean,
  length: boolean,
};

const PasswordHints = (props: PropTypes) => {
  const { lowerCase, upperCase, digit, length } = props;
  return (
    <aside styleName="container">
      <ul styleName="list">
        <li styleName={lowerCase ? 'valid' : 'list-item'}>
          One lower case character
        </li>
        <li styleName={upperCase ? 'valid' : 'list-item'}>
          One upper case character
        </li>
        <li styleName={digit ? 'valid' : 'list-item'}>One number</li>
        <li styleName={length ? 'valid' : 'list-item'}>8 characters minimum</li>
      </ul>
    </aside>
  );
};

export default PasswordHints;
