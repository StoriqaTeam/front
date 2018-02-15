import React from 'react';
import { storiesOf } from '@storybook/react';

import { Dropdown } from 'components/Dropdown';

storiesOf('Dropdown', module)
  .add('Default', () => (
    <Dropdown>
      <trigger>
        <div>Trigger</div>
      </trigger>
      <content>
        <div>Content</div>
      </content>
    </Dropdown>
  ));
