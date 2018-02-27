import React from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from 'components/Checkbox';

storiesOf('Checkbox', module)
  .add('Default', () => (
    <Checkbox
      id="katya_ivanova"
      label="Katya Ivanova"
      handleCheckboxChange={() => {}}
    />
  ));
