// flow

import React from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

import { socialStrings } from 'utils';

import './AuthorizationSocial.scss';

const buttons = [
  {
    href: socialStrings.facebookLoginString(),
    iconType: 'facebook',
    dataTest: 'authFacebookButton',
    message: 'Sign in with Facebook',
  },
  {
    href: socialStrings.googleLoginString(),
    iconType: 'google',
    dataTest: 'authGoogleButton',
    message: 'Sign in with Google',
  },
];

const AuthorizationSocial = () => (
  <div styleName="container">
    {buttons.map(({ href, dataTest, iconType, message }) => (
      <Button iconic href={href} dataTest={dataTest}>
        <Icon type={iconType} />
        <span>{message}</span>
      </Button>
    ))}
  </div>
);

export default AuthorizationSocial;
