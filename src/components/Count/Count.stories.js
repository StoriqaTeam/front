import React from 'react';
import { storiesOf } from '@storybook/react';

import { Count } from 'components/Count';

storiesOf('Count', module)
  .add('Blue & two symbols', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Count
        amount={32}
        styles="blue"
      />
    </div>
  ))
  .add('Green & three symbols', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Count
        amount={321}
        styles="green"
      />
    </div>
  ));
