import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Text } from 'components/Forms';

import textStyle from './Text.stories.scss';

storiesOf('Forms/Text', module)
  .add('default', () => (
    <Text
      id="some_id"
      label="Name:"
      value="test"
      onChange={action('text-change')}
      styleName={textStyle.textInput}
    />
  ));
