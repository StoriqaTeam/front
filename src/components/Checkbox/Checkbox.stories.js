import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { Checkbox } from 'components/Checkbox';

storiesOf('Checkbox', module)
  .add('Default', () => (
    <StoriesDecorator>
      <Checkbox
        id="katya_ivanova"
        label="Katya Ivanova"
        handleCheckboxChange={() => {}}
      />
    </StoriesDecorator>
  ));
