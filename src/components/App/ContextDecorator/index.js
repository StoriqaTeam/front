// @flow strict

import React from 'react';
import type { ComponentType } from 'react';

import { AppContext } from 'components/App';

export default (OriginalComponent: ComponentType<*>) => (props: {}) => (
  <AppContext.Consumer>
    {({ environment }) => (
      <OriginalComponent {...props} environment={environment} />
    )}
  </AppContext.Consumer>
);
