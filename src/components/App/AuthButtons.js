import React from 'react';

import './AuthButtons.scss';

type PropsType = {
  onOpenModal(boolean): void
}

const AuthButtons = ({
  onOpenModal,
}: PropsType) => (
  <div styleName="container">
    <div
      styleName="signUpButton"
      onClick={() => onOpenModal(true)}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
    >
      Sign Up
    </div>
    <div
      styleName="signInButton"
      onClick={() => onOpenModal(false)}
      onKeyDown={() => {}}
      role="button"
      tabIndex="0"
    >
      <strong>Sign In</strong>
    </div>
  </div>
);

export default AuthButtons;
