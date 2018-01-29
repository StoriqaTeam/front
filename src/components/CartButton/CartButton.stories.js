import React from 'react';
import { storiesOf } from '@storybook/react';

import { CartButton } from 'components/CartButton';

storiesOf('Cart button', module)
  .add('With goods', () => (
    <div style={{ margin: '50px' }}>
      <CartButton amount={32} />
    </div>
  ))
  .add('Without goods', () => (
    <div style={{ margin: '50px' }}>
      <CartButton href="#" />
    </div>
  ));
