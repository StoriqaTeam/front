import React from 'react';
import { storiesOf } from '@storybook/react';

import { Banner } from 'components/Banner';

storiesOf('Banner', module)
  .add('Default', () => (
    <Banner
      count={1}
      img="https://preview.ibb.co/m3udSx/Mask_Group_63.png"
    />
  ));
