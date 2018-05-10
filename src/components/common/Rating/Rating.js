// @flow

import React from 'react';
import classNames from 'classnames';

import Stars from 'components/common/Rating/svg/stars.svg';

import './Rating.scss';

type PropsTypes = {
  type: string,
  value: number,
};

const Rating = ({ type, value }: PropsTypes) => (
  <div styleName={classNames('container', { type })}>
    <div
      styleName={classNames('background', { type })}
      style={{ width: `${value ? value * 20 : '0'}%` }}
    />
    <Stars />
  </div>
);

export default Rating;
