import React from 'react';
import { storiesOf } from '@storybook/react';

import { Count } from 'components/Count';

storiesOf('Count', module)
  .add('Blue', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Count
        amount={32}
        type="blue"
      />
    </div>
  ))
  .add('Green', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Count
        amount={321}
        type="green"
      />
    </div>
  ));
