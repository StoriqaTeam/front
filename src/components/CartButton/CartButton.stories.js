import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { CartButton } from 'components/CartButton';

storiesOf('Cart button', module)
  .add('With goods', () => (
    <StoriesDecorator>
      <CartButton amount={32} />
    </StoriesDecorator>
  ))
  .add('Without goods', () => (
    <StoriesDecorator>
      <CartButton href="#" />
    </StoriesDecorator>
  ));
