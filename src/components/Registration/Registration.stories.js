import React from 'react';
import { storiesOf } from '@storybook/react';

import Registration from './Registration';

storiesOf('Registration', module)
  .add('with Initial looking', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Registration />
    </div>
  ));
