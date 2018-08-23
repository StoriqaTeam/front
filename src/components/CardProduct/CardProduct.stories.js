import React from 'react';
import { storiesOf } from '@storybook/react';

import { CardProduct } from 'components/CardProduct';

import cardProductData from './cardProductData.json';

storiesOf('CardProduct', module)
  .add('Default', () => (
    <CardProduct
      data={cardProductData}
      width={100}
    />
  ));
