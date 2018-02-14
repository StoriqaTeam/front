import React from 'react';
import { storiesOf } from '@storybook/react';

import CapsLockMessage from './CapsLockMessage';

storiesOf('CapsLockMessage', module)
  .add('Default', () => (
    <div
      style={{
        margin: '50px',
        width: '200px',
      }}
    >
      <CapsLockMessage text="CAPS LOCK is on" />
    </div>
  ));
