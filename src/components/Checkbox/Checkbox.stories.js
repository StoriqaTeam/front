import React from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from 'components/common/Checkbox';

storiesOf('Checkbox', module)
  .add('Default checkbox', () => (
    <Checkbox
      id="katya_ivanova"
      label="Katya Ivanova"
      handleCheckboxChange={() => {}}
    />
  ));
