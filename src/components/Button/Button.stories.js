import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Button', module)
  .add('with text', () => (
    <Button title="Title here" />
  ))
  .add('with some emoji', () => (
    // eslint-disable-next-line
    <Button title="😀 😎 👍 💯" />
  ))
  .add('with "buttonClass" as default', () => (
    // eslint-disable-next-line
    <Button buttonClass="Button" title="Storiqa" />
  ))
  .add('with "buttonClass" as "SignUpFormButton" ', () => (
    // eslint-disable-next-line
    <Button buttonClass="SignUpFormButton" title="Storiqa" />
  ));
