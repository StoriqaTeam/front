import React from 'react';
import { storiesOf } from '@storybook/react';

import FormHeader from './FormHeader';

storiesOf('FormHeader', module)
  .add('with default "title" and "linkTitle"', () => (
    <FormHeader />
  ))
  .add('with "title" and "linkTitle" set via props', () => (
    <FormHeader
      title="I'm title"
      linkTitle="Click me"
    />
  ));
