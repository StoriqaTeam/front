import React from 'react';
import { storiesOf } from '@storybook/react';

import { Count } from 'components/Count';

storiesOf('Count', module)
  .add('Blue & two symbols', () => (
    <Count
      amount={32}
      styles="blue"
    />
  ))
  .add('Green & three symbols', () => (
    <Count
      amount={321}
      styles="green"
    />
  ))
  .add('For messages', () => (
    <Count
      tip
      amount={321}
      styles="blue"
    />
  ));
