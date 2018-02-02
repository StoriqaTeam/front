import React from 'react';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';

import ShowPassword from './ShowPassword';

storiesOf('ShowPassword', module)
  .add('triggers "onClick" event', () => (
    <div style={{ position: 'relative', top: 30, width: 100 }}>
      <ShowPassword onClick={action('click')} />
    </div>
  ));
