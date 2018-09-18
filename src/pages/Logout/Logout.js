// @flow

import React from 'react';

import { AppContext } from 'components/App';

import { LogoutPage } from './index';

const Logout = () => (
  <AppContext.Consumer>
    {({ environment }) => <LogoutPage environment={environment} />}
  </AppContext.Consumer>
);

export default Logout;
