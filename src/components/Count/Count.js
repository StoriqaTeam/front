// @flow

import React from 'react';
import classNames from 'classnames';

import './Count.scss';

type PropsTypes = {
  amount: number,
  styles: string,
  tip: boolean,
};

const Count = ({ amount, styles, tip }: PropsTypes) => (
  <div styleName={classNames('container', styles, { tip })}>
    <strong>{amount}</strong>
  </div>
);

export default Count;
