import React from 'react';
import { storiesOf } from '@storybook/react';

import ProgressBar from './ProgressBar';

storiesOf('ProgressBar', module)
  .add('with simple class and percentage of 20 and message', () => (
    <div style={{ position: 'relative', top: 5 }}>
      <ProgressBar qualityClass="progressBar simple" percentage={20} message="Simple" />
    </div>
  ))
  .add('with good class and percentage of 60 and message', () => (
    <div style={{ position: 'relative', top: 5 }}>
      <ProgressBar qualityClass="progressBar good" percentage={60} message="Good" />
    </div>
  ))
  .add('with excellent class and percentage of 100 and message ', () => (
    <div style={{ position: 'relative', top: 5 }}>
      <ProgressBar qualityClass="progressBar excellent" percentage={100} message="Excellent" />
    </div>
  ));
