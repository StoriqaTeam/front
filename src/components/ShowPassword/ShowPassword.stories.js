import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

import ShowPassword from './ShowPassword';

storiesOf('ShowPassword', module)
  .add('Inactive', () => (
    <ShowPassword
      show={false}
      onClick={linkTo('ShowPassword', 'Active')}
    />
  ))
  .add('Active', () => (
    <ShowPassword
      show
      onClick={linkTo('ShowPassword', 'Inactive')}
    />
  ));
