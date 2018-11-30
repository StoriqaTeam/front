// @flow strict
import React from 'react';
import { Icon } from 'components/Icon';

import t from './i18n';
import './AuthButtons.scss';

type PropsType = {
  onOpenModal(boolean): void,
};

const AuthButtons = ({ onOpenModal }: PropsType) => (
  <div styleName="container">
    <div
      styleName="login"
      onClick={() => onOpenModal(true)}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
    >
      <Icon type="login" size={24} />
    </div>
    <div
      styleName="signUpButton"
      onClick={() => onOpenModal(true)}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
      data-test="headerSignUpButton"
    >
      {t.signUp}
    </div>
    <div
      styleName="signInButton"
      onClick={() => onOpenModal(false)}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
      data-test="headerSignInButton"
    >
      <strong>{t.signIn}</strong>
    </div>
  </div>
);

export default AuthButtons;
