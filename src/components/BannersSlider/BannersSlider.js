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
      type="banners"
      items={props.items}
      slidesToShow={1}
    />
    <div styleName="button">
      <Button
        big
        white
        href={
          process.env.REACT_APP_HOST
            ? `${process.env.REACT_APP_HOST}/manage/store/new`
            : '/'
        }
        dataTest="sliderStartSellingButton"
      >
        Start selling
      </Button>
    </div>
  </div>
);

export default BannersSlider;
