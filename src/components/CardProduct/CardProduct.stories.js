import React from 'react';
import { storiesOf } from '@storybook/react';

import { CardProduct } from 'components/CardProduct';

import cardProductData from './cardProductData.json';

storiesOf('Card Product', module)
  .add('Default', () => (
    <div
      style={{
        maxWidth: '328px',
        margin: '0 auto',
      }}
    >
      <CardProduct
        data={cardProductData}
        width={100}
      />
    </div>
  ));
