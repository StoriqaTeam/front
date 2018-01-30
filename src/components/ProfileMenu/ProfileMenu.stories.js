import React from 'react';
import { storiesOf } from '@storybook/react';

import { ProfileMenu } from 'components/ProfileMenu';

import profile from './profile.json';

storiesOf('ProfileMenu', module)
  .add('Default', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <ProfileMenu profile={profile} />
    </div>
  ));
