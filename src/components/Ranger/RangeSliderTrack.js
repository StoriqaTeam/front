// @flow strict 

import React from 'react';

import './RangeSliderTrack.scss';

type PropsType = {
  thumb1Phantom: number,
  thumb2Phantom: number,
};

const RangeSliderTrack = ({
  thumb1Phantom,
  thumb2Phantom,
}: PropsType) => (
  <div styleName="container">
    <div styleName="track" />
    <div
      styleName="shadowTrack shadowLeftTrack"
      style={{ width: `${thumb1Phantom}%` }}
    />
    <div
      styleName="shadowTrack shadowRightTrack"
      style={{ width: `${100 - thumb2Phantom}%` }}
    />
  </div>
);

export default RangeSliderTrack;
