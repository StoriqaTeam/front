import React from 'react';
import { action, decorateAction } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';

import ShowPassword from './ShowPassword';

storiesOf('ShowPassword', module)
  .add('triggers "onClick" event', () => { // eslint-disable-line
    return (
      <div style={{ position: 'relative', top: 30, width: 100 }}>
        <ShowPassword
          show={boolean('Is show', false)}
          onClick={action('click')}
        />
      </div>
    );
  });
