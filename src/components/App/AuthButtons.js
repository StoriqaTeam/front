import React from 'react';
import { Icon } from 'components/Icon';

import './AuthButtons.scss';

type PropsType = {
  onOpenModal(boolean): void,
};

const AuthButtons = ({ onOpenModal }: PropsType) => (
  <div styleName="container">
    <div styleName="avatar">
      <Icon type="person" size="16" />
    </div>
    <div
      styleName="signUpButton"
      onClick={() => onOpenModal(true)}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
      data-test="headerSignUpButton"
    >
      Sign Up
    </div>
    <div
      styleName="signInButton"
      onClick={() => onOpenModal(false)}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
      data-test="headerSignInButton"
    >
      <strong>Sign In</strong>
    </div>
  </div>
);

export default AuthButtons;
