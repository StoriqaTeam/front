import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text, select } from '@storybook/addon-knobs';

import { Alert } from 'components/Alerts';

storiesOf('Alert', module)
  .addDecorator(withKnobs)
  .add('Default', () => (
    <Alert
      text={text('Text', 'Sorry but currenltly our service is under maintenance. Keep calm - it’ll take about 5m.')}
      type={select('Type', {
        default: 'default', 
        success: 'success', 
        warning: 'warning', 
        danger: 'danger',
      }, 'default')}
      link={{
        text: text('Link text', 'Got it!'),
      }}
    />
  ));
