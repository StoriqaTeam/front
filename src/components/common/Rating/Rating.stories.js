import React from 'react';
import { storiesOf } from '@storybook/react';

import { Rating } from 'components/common/Rating';

storiesOf('Common/Rating', module)
  .add('Default', () => (
    <Rating value={2.4} />
  ));
