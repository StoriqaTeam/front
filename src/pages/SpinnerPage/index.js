// @flow strict

import React from 'react';

import { Spinner } from 'components/common/Spinner';
import Logo from 'components/Icon/svg/logo.svg';

import './SpinnerPage.scss';

import t from './i18n';

const SpinnerPage = () => (
  <div styleName="container">
    <div styleName="logo">
      <Logo />
    </div>
    <span styleName="text">
      {t.loading}
      <br />
      {t.pleaseWait}
    </span>
    <span styleName="description">- {t.storiqaTeam}</span>
    <Spinner />
  </div>
);

export default SpinnerPage;
