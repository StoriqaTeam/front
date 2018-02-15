import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProfileMenu } from 'components/ProfileMenu';

import profile1 from './profile_with_avatar.json';
import profile2 from './profile_without_avatar.json';

storiesOf('ProfileMenu', module)
  .add('With avatar', () => (
    <ProfileMenu profile={profile1} />
  ))
  .add('Without avatar', () => (
    <ProfileMenu profile={profile2} />
  ));
