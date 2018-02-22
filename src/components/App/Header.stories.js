// 12rem
import React from 'react';
import { storiesOf } from '@storybook/react';

import { Header } from 'components/App';

storiesOf('App/Header', module)
  .addDecorator(story => (
    <div style={{ backgroundColor: 'lightgrey', padding: '20px' }}>
      {story()}
    </div>
  ))
  .add('Default', () => (
    <Header />
  ));
