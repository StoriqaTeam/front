import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { Slider } from 'components/Slider';

import mostPopularGoods from './mostPopularGoods.json';

storiesOf('Slider', module)
  .add('Most popular', () => (
    <StoriesDecorator type="slider">
      <Slider
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
    </StoriesDecorator>
  ))
  .add('Sale', () => (
    <StoriesDecorator type="slider">
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
    </StoriesDecorator>
  ))
  .add('Smart Reviews', () => (
    <StoriesDecorator type="slider">
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
    </StoriesDecorator>
  ));
