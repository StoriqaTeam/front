// @flow strict

import React from 'react';
import type { ComponentType } from 'react';

import { AppContext } from 'components/App';

export default (OriginalComponent: ComponentType<*>) => (props: {}) => (
  <AppContext.Consumer>
    {({ environment, directories }) => (
      <OriginalComponent
        {...props}
        environment={environment}
        directories={directories}
      />
    )}
  </AppContext.Consumer>
);
