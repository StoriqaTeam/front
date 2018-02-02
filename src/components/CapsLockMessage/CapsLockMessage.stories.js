import React from 'react';
import { storiesOf } from '@storybook/react';

import CapsLockMessage from './CapsLockMessage';

storiesOf('CapsLockMessage', module)
  .add('with "CAPS LOCK is on" message', () => (
    <div style={{ position: 'relative', top: 5 }}>
      <CapsLockMessage />
    </div>
  ));
