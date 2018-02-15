import React from 'react';
import { storiesOf } from '@storybook/react';

import { CartButton } from 'components/CartButton';

storiesOf('Cart button', module)
  .add('With goods', () => (
    <CartButton amount={32} />
  ))
  .add('Without goods', () => (
    <CartButton href="#" />
  ));
