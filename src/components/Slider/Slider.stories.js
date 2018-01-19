import React from 'react';
import { storiesOf } from '@storybook/react';

import { Slider } from 'components/Slider';

import mostPopularGoods from './mostPopularGoods.json';

storiesOf('Slider', module)
  .add('Most popular', () => (
    <div
      style={{
        maxWidth: '1360px',
        margin: '50px auto 0',
        // border: '1px solid grey',
      }}
    >
      <Slider
        title="Most popular"
        color="#9239C9"
        items={mostPopularGoods}
        slidesToShow={4}
        responsive={[
          { breakpoint: 1200, slidesToShow: 3 },
          { breakpoint: 992, slidesToShow: 2 },
          { breakpoint: 576, slidesToShow: 1 },
        ]}
      />
    </div>
  ));
