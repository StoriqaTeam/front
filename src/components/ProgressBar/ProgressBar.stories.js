import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import ProgressBar from './ProgressBar';

storiesOf('ProgressBar', module)
  .add('with simple class and percentage of 20 and message', () => (
    <StoriesDecorator>
      <ProgressBar qualityClass="progressBar simple" percentage={20} message="Simple" />
    </StoriesDecorator>
  ))
  .add('with good class and percentage of 60 and message', () => (
    <StoriesDecorator>
      <ProgressBar qualityClass="progressBar good" percentage={60} message="Good" />
    </StoriesDecorator>
  ))
  .add('with excellent class and percentage of 100 and message ', () => (
    <StoriesDecorator>
      <ProgressBar qualityClass="progressBar excellent" percentage={100} message="Excellent" />
    </StoriesDecorator>
  ));
