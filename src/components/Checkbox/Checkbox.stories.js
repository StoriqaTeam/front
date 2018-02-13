import React from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from 'components/Checkbox';

storiesOf('Checkbox', module)
  .add('Default', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Checkbox
        label="Katya Ivanova"
        handleCheckboxChange={() => {}}
      />
    </div>
  ));
