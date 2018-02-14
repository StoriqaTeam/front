import React from 'react';
import { storiesOf } from '@storybook/react';

import { Spiner } from 'components/Spiner';

storiesOf('Spiner', module)
  .add('Size 16', () => (
    <div
      style={{
        position: 'relative',
        margin: '50px',
      }}
    >
      <Spiner size={16} />
    </div>
  ))
  .add('Size 24', () => (
    <div
      style={{
        position: 'relative',
        margin: '50px',
      }}
    >
      <Spiner size={24} />
    </div>
  ))
  .add('Size 32', () => (
    <div
      style={{
        position: 'relative',
        margin: '50px',
      }}
    >
      <Spiner size={32} />
    </div>
  ));
