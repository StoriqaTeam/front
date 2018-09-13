// @flow

import React from 'react';
import classNames from 'classnames';

import './Container.scss';

type PropsTypes = {
  withoutGrow?: boolean,
  correct?: boolean,
  children: any,
};

const Container = ({ correct, children, withoutGrow }: PropsTypes) => (
  <div styleName={classNames('container', { withoutGrow, correct })}>
    {children}
  </div>
);

Container.defaultProps = {
  withoutGrow: false,
  correct: false,
};

export default Container;
