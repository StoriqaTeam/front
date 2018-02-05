import React from 'react';
import { storiesOf } from '@storybook/react';

import { Profile } from 'components/Profile';

import users from './users.json';
import currentUser from './currentUser.json';

storiesOf('Profile', module)
  .add('User', () => (
    <Profile
      currentUser={currentUser}
    />
  ))
  .add('Admin', () => (
    <Profile
      admin
      users={users}
    />
  ));
