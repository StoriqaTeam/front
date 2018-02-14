import React from 'react';
import { storiesOf } from '@storybook/react';
import { linkTo } from '@storybook/addon-links'

import ShowPassword from './ShowPassword';

storiesOf('ShowPassword', module)
  .add('Inactive', () => { // eslint-disable-line
    return (
      <div
        style={{
          position: 'relative',
          width: '100px',
          margin: '50px',
        }}
      >
        <ShowPassword
          show={false}
          onClick={linkTo('ShowPassword', 'Active')}
        />
      </div>
    );
  })
  .add('Active', () => { // eslint-disable-line
    return (
      <div
        style={{
          position: 'relative',
          width: '100px',
          margin: '50px',
        }}
      >
        <ShowPassword
          show
          onClick={linkTo('ShowPassword', 'Inactive')}
        />
      </div>
    );
  });
