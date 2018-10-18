// @flow strict

import React from 'react';

import './PasswordHints.scss';

import t from './i18n';

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
          {t.oneLowerCaseCharacter}
        </li>
        <li styleName={upperCase ? 'valid' : 'list-item'}>
          {t.oneUpperCaseCharacter}
        </li>
        <li styleName={digit ? 'valid' : 'list-item'}>{t.oneNumber}</li>
        <li styleName={length ? 'valid' : 'list-item'}>{t.eightCharactersMinimun}</li>
      </ul>
    </aside>
  );
};

export default PasswordHints;
