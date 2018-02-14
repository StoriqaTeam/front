import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { ProfileMenu } from 'components/ProfileMenu';

import profile1 from './profile_with_avatar.json';
import profile2 from './profile_without_avatar.json';

storiesOf('ProfileMenu', module)
  .add('With avatar', () => (
    <StoriesDecorator>
      <ProfileMenu profile={profile1} />
    </StoriesDecorator>
  ))
  .add('Without avatar', () => (
    <StoriesDecorator>
      <ProfileMenu profile={profile2} />
    </StoriesDecorator>
  ));
