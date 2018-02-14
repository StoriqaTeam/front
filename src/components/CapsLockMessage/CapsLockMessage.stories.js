import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import CapsLockMessage from './CapsLockMessage';

storiesOf('CapsLockMessage', module)
  .add('Default', () => (
    <StoriesDecorator>
      <CapsLockMessage text="CAPS LOCK is on" />
    </StoriesDecorator>
  ));
