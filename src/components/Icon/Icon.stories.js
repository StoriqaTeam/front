import React from 'react';
import { storiesOf } from '@storybook/react';

import { Icon } from 'components/Icon';

storiesOf('Icon', module)
  .add('Person', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Icon
        type="person"
        size="32"
      />
    </div>
  ))
  .add('Cart', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Icon
        type="cart"
        size="32"
      />
    </div>
  ));
