import React from 'react';
import { storiesOf } from '@storybook/react';

import { Slider } from 'components/Slider';

import mostPopularGoods from './mostPopularGoods.json';
import staticBanners from './staticBanners.json';

storiesOf('Slider', module)
  .add('Most popular', () => (
    <Slider
      isInfinity
      animationSpeed={500}
      title="Most popular"
      headerType="most-popular"
      type="cardProduct"
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
      animationSpeed={500}
      title="Sale"
      headerType="sale"
      type="cardProduct"
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
      animationSpeed={500}
      title="Smart Reviews"
      headerType="smart-reviews"
      type="cardProduct"
      items={mostPopularGoods}
      slidesToShow={4}
      responsive={[
        { breakpoint: 1200, slidesToShow: 3 },
        { breakpoint: 992, slidesToShow: 2 },
        { breakpoint: 576, slidesToShow: 1 },
      ]}
    />
  ))
  .add('Static Banners', () => (
    <Slider
      isDots
      isInfinity
      autoplaySpeed={15000}
      animationSpeed={500}
      type="banners"
      items={staticBanners}
      slidesToShow={1}
    />
  ));
