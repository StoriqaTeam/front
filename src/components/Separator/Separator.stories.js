import React from 'react';
import { storiesOf } from '@storybook/react';

import Separator from './Separator';

storiesOf('Separator', module)
  .add('Default', () => (
    <div
      style={{
        margin: '50px',
        width: '336px',
      }}
    >
      <Separator text="or" />
    </div>
  ));
