import React from 'react';
import { storiesOf } from '@storybook/react';

import { Spiner } from 'components/Spiner';

storiesOf('Spiner', module)
  .add('Size 16', () => (
    <Spiner size={16} />
  ))
  .add('Size 24', () => (
    <Spiner size={24} />
  ))
  .add('Size 32', () => (
    <Spiner size={32} />
  ));
