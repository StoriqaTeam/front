import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { Count } from 'components/Count';

storiesOf('Count', module)
  .add('Blue & two symbols', () => (
    <StoriesDecorator>
      <Count
        amount={32}
        styles="blue"
      />
    </StoriesDecorator>
  ))
  .add('Green & three symbols', () => (
    <StoriesDecorator>
      <Count
        amount={321}
        styles="green"
      />
    </StoriesDecorator>
  ))
  .add('For messages', () => (
    <StoriesDecorator>
      <Count
        tip
        amount={321}
        styles="blue"
      />
    </StoriesDecorator>
  ));
