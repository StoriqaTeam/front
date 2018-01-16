import React from 'react';
import { storiesOf } from '@storybook/react';

import ProgressBar from './ProgressBar';

storiesOf('ProgressBar', module)
  .add('with message', () => (
    <ProgressBar message="Simple" />
  ))
  .add('with percentage ', () => (
    <ProgressBar percentage={80} />
  ))
  .add('with qualityClass ', () => (
    <ProgressBar qualityClass="good" />
  ));
