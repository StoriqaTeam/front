import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Input } from 'components/Forms';

storiesOf('Forms/Input', module)
  .add('default', () => (
    <Input
      id="some_id"
      label="Name"
      onChange={action('text-change')}
    />
  ))
  .add('with error', () => (
    <Input
      id="some_id2"
      label="Name"
      value="test"
      onChange={action('text-change')}
      errors={['Some error text']}
    />
  ));
