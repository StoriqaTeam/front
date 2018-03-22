import React from 'react';
import { storiesOf } from '@storybook/react';

import { Slider } from 'components/Slider';

import mostPopularGoods from './mostPopularGoods.json';

storiesOf('Slider', module)
  .add('Most popular', () => (
    <Slider
      isInfinity
      title="Most popular"
      type="most-popular"
      items={mostPopularGoods}
      slidesToShow={4}
      responsive={[
        { breakpoint: 1200, slidesToShow: 3 },
        { breakpoint: 992, slidesToShow: 2 },
        { breakpoint: 576, slidesToShow: 1 },
      ]}
    />
  ))
  .add('Sale', () => (
    <Slider
      title="Sale"
      type="sale"
      items={mostPopularGoods}
      slidesToShow={4}
      responsive={[
        { breakpoint: 1200, slidesToShow: 3 },
        { breakpoint: 992, slidesToShow: 2 },
        { breakpoint: 576, slidesToShow: 1 },
      ]}
    />
  ))
  .add('Smart Reviews', () => (
    <Slider
      title="Smart Reviews"
      type="smart-reviews"
      items={mostPopularGoods}
      slidesToShow={4}
      responsive={[
        { breakpoint: 1200, slidesToShow: 3 },
        { breakpoint: 992, slidesToShow: 2 },
        { breakpoint: 576, slidesToShow: 1 },
      ]}
    />
  ));
