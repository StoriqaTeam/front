import React from 'react';
import { storiesOf } from '@storybook/react';

import { Profile } from 'components/Profile';

storiesOf('Profile', module)
  .add('Default', () => (
    <Profile />
  ));
