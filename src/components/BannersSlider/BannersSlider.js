// @flow

import React from 'react';
import { Slider } from 'components/Slider';

import './BannersSlider.scss';

type PropsTypes = {
  items: Array<{}>,
};

const BannersSlider = (props: PropsTypes) => (
  <div styleName="container">
    <Slider
      dots
      infinity
      animationSpeed={500}
      type="banners"
      items={props.items}
      slidesToShow={1}
      fade
      autoplaySpeed={10000}
    />
  </div>
);

export default BannersSlider;
