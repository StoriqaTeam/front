import React from 'react';
import { storiesOf } from '@storybook/react';

import ShowMore from 'components/ShowMore';

storiesOf('ShowMore', module)
  .add('Basic', () => (
    <ShowMore>
      Details
    </ShowMore>
  ));
