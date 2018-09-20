// @flow strict

import React from 'react';

import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';

import { socialStrings } from 'utils';

import './AuthorizationSocial.scss';

const buttons = [
  {
    id: '0',
    href: socialStrings.facebookLoginString(),
    iconType: 'facebook',
    dataTest: 'authFacebookButton',
    message: 'Sign in with Facebook',
  },
  {
    id: '1',
    href: socialStrings.googleLoginString(),
    iconType: 'google',
    dataTest: 'authGoogleButton',
    message: 'Sign in with Google',
  },
];

const AuthorizationSocial = () => (
  <div styleName="container">
    {buttons.map(({ id, href, dataTest, iconType, message }) => (
      <Button iconic key={id} href={href} dataTest={dataTest}>
        <Icon type={iconType} />
        <span>{message}</span>
      </Button>
    ))}
  </div>
);

export default AuthorizationSocial;
