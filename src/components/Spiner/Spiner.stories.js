import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { Spiner } from 'components/Spiner';

storiesOf('Spiner', module)
  .add('Size 16', () => (
    <StoriesDecorator>
      <Spiner size={16} />
    </StoriesDecorator>
  ))
  .add('Size 24', () => (
    <StoriesDecorator>
      <Spiner size={24} />
    </StoriesDecorator>
  ))
  .add('Size 32', () => (
    <StoriesDecorator>
      <Spiner size={32} />
    </StoriesDecorator>
  ));
