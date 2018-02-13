import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Text } from 'components/Forms';

storiesOf('Forms/Text', module)
  .add('default', () => (
    <Text
      id="some_id"
      label="Name:"
      value="test"
      onChange={action('text-change')}
    />
  ))
  .add('with error', () => (
    <Text
      id="some_id2"
      label="Name:"
      value="test"
      onChange={action('text-change')}
      errors={['Some error text']}
    />
  ));
