// @flow

import React from 'react';
import classNames from 'classnames';

import './Count.scss';

type PropsTypes = {
  amount: number,
  type: string,
};

const Count = ({ amount, type }: PropsTypes) => (
  <div styleName={classNames('container', type && type)}>{amount}</div>
);

export default Count;
