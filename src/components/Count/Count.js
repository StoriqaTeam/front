// @flow

import React from 'react';
import classNames from 'classnames';

import './Count.scss';

type PropsTypes = {
  amount: number,
  styles: string,
};

const Count = ({ amount, styles }: PropsTypes) => (
  <div styleName={classNames('container', styles && styles)}>{amount}</div>
);

export default Count;
