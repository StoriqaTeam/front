// @flow

import React from 'react';
import classNames from 'classnames';

import './Container.scss';

type PropsTypes = {
  withoutGrow: ?boolean,
  children: any,
};

const Container = ({ children, withoutGrow }: PropsTypes) => (
  <div styleName={classNames('container', { withoutGrow })}>{children}</div>
);

export default Container;
