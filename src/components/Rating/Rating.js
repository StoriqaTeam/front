// @flow

import React from 'react';
import { range } from 'ramda';

import Star from './svg/star.svg';

import './Rating.scss';

type PropsType = {
  rating: number,
}

const Rating = (props: PropsType) => {
  const numStars = Math.round(props.rating);
  return (
    <div styleName="container">
      {range(1, 6).map(idx => (
        <div styleName="star-container">
          <Star key={idx} styleName={idx <= numStars ? 'on' : 'off'} />
        </div>
      ))}
    </div>
  );
};

export default Rating;
