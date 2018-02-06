import React from 'react';
import { storiesOf } from '@storybook/react';

import SignUpForm from './SignUpForm';

storiesOf('SignUpForm', module)
  .add('with Initial looking', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <SignUpForm />
    </div>
  ));
