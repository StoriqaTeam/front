import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links';

import { StoriesDecorator } from 'components/StoriesDecorator';
import ShowPassword from './ShowPassword';

storiesOf('ShowPassword', module)
  .add('Inactive', () => (
    <StoriesDecorator>
      <ShowPassword
        show={false}
        onClick={linkTo('ShowPassword', 'Active')}
      />
    </StoriesDecorator>
  ))
  .add('Active', () => (
    <StoriesDecorator>
      <ShowPassword
        show
        onClick={linkTo('ShowPassword', 'Inactive')}
      />
    </StoriesDecorator>
  ));
