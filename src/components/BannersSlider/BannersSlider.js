// @flow

import React from 'react';
import { Slider } from 'components/Slider';
import { Button } from 'components/common/Button';

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
      autoplaySpeed={4000}
      type="banners"
      items={props.items}
      slidesToShow={1}
    />
  </div>
);

export default BannersSlider;
