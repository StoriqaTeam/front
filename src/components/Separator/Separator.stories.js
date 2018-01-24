import React from 'react';
import { storiesOf } from '@storybook/react';

import Separator from './Separator';

storiesOf('Separator', module)
  .add('with "text" ', () => (
    <Separator
      text="or"
    />
  ));
