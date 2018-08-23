import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Input } from 'components/common/Input';
import OnChangeDecorator from '../../../../.storybook/OnChangeDecorator';

storiesOf('Common/Input', module)
  .add('Default', () => (
    <OnChangeDecorator>
      <Input
        id="some_id"
        label="Input more words"
      />
    </OnChangeDecorator>
  ))
  .add('with error', () => (
    <Input
      id="some_id2"
      label="Input"
      value="test"
      onChange={action('text-change')}
      errors={['Some error text']}
    />
  ));
