import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Textarea } from 'components/common/Textarea';
import OnChangeDecorator from '../../../.storybook/OnChangeDecorator';

storiesOf('Forms/Textarea', module)
  .add('Default', () => (
    <OnChangeDecorator>
      <Textarea
        id="some_id"
        label="Textarea"
      />
    </OnChangeDecorator>
  ))
  .add('with error', () => (
    <Textarea
      id="some_id2"
      label="Textarea"
      value="test"
      onChange={action('text-change')}
      errors={['Some error text']}
    />
  ));
