import React from 'react';
import { storiesOf } from '@storybook/react';

import { Checkbox } from 'components/common/Checkbox';

storiesOf('Common/Checkbox', module)
  .add('Default checkbox', () => (
    <div style={{ width: '300px' }}>
      <Checkbox
        id="katya_ivanova"
        label="Katya Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova"
        handleCheckboxChange={() => {}}
      />
      <Checkbox
        id="katya_ivanova_2"
        label="Katya Ivanova"
        handleCheckboxChange={() => {}}
      />
    </div>
  ));
