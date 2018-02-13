import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { RadioGroup } from 'components/Forms';

storiesOf('Forms/RadioGroup', module)
  .add('default', () => (
    <RadioGroup
      id="some_id"
      label="Gender"
      items={[
        { id: 'UNDEFINED', value: 'Unknown' },
        { id: 'MALE', value: 'Male' },
        { id: 'FEMALE', value: 'Female' },
      ]}
      checked="MALE"
      onChange={action('radioGroup-change')}
    />
  ));
