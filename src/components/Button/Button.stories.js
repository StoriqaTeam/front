import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from 'components/Button';

storiesOf('Button', module)
  .add('with text', () => (
    <Button title="Title here" />
  ))
  .add('with some emoji', () => (
    // eslint-disable-next-line
    <Button title="😀 😎 👍 💯" />
  ));
