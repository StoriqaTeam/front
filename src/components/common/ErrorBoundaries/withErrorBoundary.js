// @flow

// https://github.com/facebook/flow/issues/5809
import * as React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { log } from 'utils';

import DefaultErrorBoundary from './DefaultErrorBoundary';

const withErrorBoundaryHOC = (Component: React.Element<*>) =>
  withErrorBoundary(
    Component,
    DefaultErrorBoundary,
    (error: Error, componentStack: string) => {
      log.debug({ error, componentStack });
    },
  );

export default withErrorBoundaryHOC;
