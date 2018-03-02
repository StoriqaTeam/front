import React from 'react';
import { storiesOf } from '@storybook/react';

import { UserDropdown } from 'components/UserDropdown';

import profile1 from './profile_with_avatar.json';
import profile2 from './profile_without_avatar.json';

storiesOf('UserDropdown', module)
  .add('With avatar', () => (
    <UserDropdown profile={profile1} />
  ))
  .add('Without avatar', () => (
    <UserDropdown profile={profile2} />
  ))
  .add('Not logged', () => (
    <UserDropdown
      profile={null}
      user
    />
  ));
