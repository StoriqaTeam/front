import React from 'react';
import { storiesOf } from '@storybook/react';

import { Profile } from 'components/Profile';

import profileData from './profileData.json';

storiesOf('Profile', module)
  .add('User', () => (
    <Profile
      profileData={profileData}
    />
  ))
  .add('Admin', () => (
    <Profile
      admin
      profileData={profileData}
    />
  ));
