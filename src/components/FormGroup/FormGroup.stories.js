import React from 'react';
import { storiesOf } from '@storybook/react';

import FormGroup from './FormGroup';

storiesOf('FormGroup', module)
  .add('with default "marginBottom"', () => (
    <div>
      <FormGroup>
        <p>Lorem ipsum</p>
      </FormGroup>
      <FormGroup>
        <p>dolor it samet</p>
      </FormGroup>
    </div>
  ))
  .add('with "marginBottom" set to 10px ', () => (
    <div>
      <FormGroup
        marginBottom={10}
      >
        <p>other text</p>
      </FormGroup>
      <FormGroup
        marginBottom={10}
      >
        <p>that has no meaning</p>
      </FormGroup>
    </div>
  ));
