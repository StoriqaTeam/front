import React from 'react';
import { storiesOf } from '@storybook/react';

import CapsLockMessage from './CapsLockMessage';

storiesOf('CapsLockMessage', module)
  .add('Default', () => (
    <CapsLockMessage text="CAPS LOCK is on" />
  ));
