import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Checkbox } from 'components/Forms';

storiesOf('Forms/Checkbox', module)
  .add('checked', () => (
    <Checkbox
      id="some_id"
      label="Checked:"
      checked
      onChange={action('checkbox-change')}
    />
  ))
  .add('unchecked', () => (
    <Checkbox
      id="some_id"
      label="Checked:"
      checked={false}
      onChange={action('checkbox-change')}
    />
  ));
