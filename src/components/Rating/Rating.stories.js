import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';

import Rating from 'components/Rating';

storiesOf('Rating', module)
  .addDecorator(withKnobs)
  .add('Basic', () => (
    <Rating rating={number('Rating', 3.4)} />
  ));
