// @flow

import React from 'react';
import { withErrorBoundary } from 'react-error-boundary';
import { log } from 'utils';

import DefaultErrorBoundary from './DefaultErrorBoundary';

const withErrorBoundaryHOC = (Component: React.Component<*>) =>
  withErrorBoundary(
    Component,
    DefaultErrorBoundary,
    (error: Error, componentStack: string) => {
      log.debug({ error, componentStack });
    },
  );

export default withErrorBoundaryHOC;
