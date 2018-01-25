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
  ))
  .add('QA', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Icon type="qa" size="32" />
    </div>
  ))
  .add('Prev, Next', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Icon type="prev" size="32" />&nbsp;
      <Icon type="next" size="32" />
    </div>
  ));
