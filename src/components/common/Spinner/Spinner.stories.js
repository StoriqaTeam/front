import React from 'react';
import { storiesOf } from '@storybook/react';

import { Spinner } from 'components/common/Spinner';

storiesOf('Common/Spinner', module)
  .add('Default', () => (
    <Spinner />
  ));
