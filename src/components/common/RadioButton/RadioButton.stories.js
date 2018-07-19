import React from 'react';
import { storiesOf } from '@storybook/react';

import { RadioButton } from 'components/common/RadioButton';

storiesOf('Common/RadioButton', module)
  .add('Default radio button', () => (
    <div style={{ width: '300px' }}>
      <RadioButton
        id="katya_ivanova"
        label="Katya Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova"
        isChecked
        onChange={() => {}}
      />
      <RadioButton
        id="katya_ivanova_2"
        label="Katya Ivanova"
        isChecked
        onChange={() => {}}
      />
    </div>
  ));
