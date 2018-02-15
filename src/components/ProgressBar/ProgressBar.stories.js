import React from 'react';
import { storiesOf } from '@storybook/react';

import ProgressBar from './ProgressBar';

storiesOf('ProgressBar', module)
  .add('with simple class and percentage of 20 and message', () => (
    <ProgressBar qualityClass="progressBar simple" percentage={20} message="Simple" />
  ))
  .add('with good class and percentage of 60 and message', () => (
    <ProgressBar qualityClass="progressBar good" percentage={60} message="Good" />
  ))
  .add('with excellent class and percentage of 100 and message ', () => (
    <ProgressBar qualityClass="progressBar excellent" percentage={100} message="Excellent" />
  ));
