// @flow

import React from 'react';
import { Slider } from 'components/Slider';
import { Button } from 'components/Button';

import './BannersSlider.scss';

type PropsTypes = {
  items: Array<{}>,
};

const BannersSlider = (props: PropsTypes) => (
  <div styleName="container">
    <Slider
      dots
      infinity
      autoplaySpeed={15000}
      animationSpeed={500}
      type="banners"
      items={props.items}
      slidesToShow={1}
    />
    <div styleName="button">
      <Button
        white
        href={process.env.REACT_APP_HOST ? `${process.env.REACT_APP_HOST}/manage/store/new` : '/'}
      >
        Стать продавцом
      </Button>
    </div>
  </div>
);

export default BannersSlider;

