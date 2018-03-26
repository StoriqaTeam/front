// @flow

import React from 'react';
import { Slider } from 'components/Slider';

import './BannersSlider.scss';

type PropsTypes = {
  banners: Array<{}>,
};

const BannersSlider = (props: PropsTypes) => (
  <div styleName="container">
    <Slider
      dots
      infinity
      autoplaySpeed={15000}
      animationSpeed={500}
      type="banners"
      items={props.banners}
      slidesToShow={1}
    />
  </div>
);

export default BannersSlider;

