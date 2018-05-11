// @flow

import React from 'react';

import Stars from 'components/common/Rating/svg/stars.svg';

import './Rating.scss';

const Rating = ({ value }: { value: ?number }) => (
  <div styleName="container">
    <div
      styleName="background"
      style={{ width: `${value ? value * 20 : '0'}%` }}
    />
    <Stars />
  </div>
);

export default Rating;
