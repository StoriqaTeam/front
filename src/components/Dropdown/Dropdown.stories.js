import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { Dropdown } from 'components/Dropdown';

storiesOf('Dropdown', module)
  .add('Default', () => (
    <StoriesDecorator>
      <Dropdown>
        <trigger>
          <div>Trigger</div>
        </trigger>
        <content>
          <div>Content</div>
        </content>
      </Dropdown>
    </StoriesDecorator>
  ));
