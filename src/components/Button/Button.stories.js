import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { Icon } from 'components/Icon';

import Button from './Button';

const stories = storiesOf('Button', module);
stories.addDecorator(withKnobs);

stories
  .add('Default', () => (
    <div
      style={{
        margin: '50px',
        width: '200px',
      }}
    >
      <Button onClick={action('click')}>
        <span>Storiqa</span>
      </Button>
    </div>
  ))
  .add('Disabled', () => (
    <div
      style={{
        margin: '50px',
        width: '200px',
      }}
    >
      <Button disabled={boolean('Disabled', false)}>
        <span>Storiqa</span>
      </Button>
    </div>
  ))
  .add('Social', () => (
    <div
      style={{
        margin: '50px',
        width: '200px',
      }}
    >
      <Button
        iconic
        onClick={action('click')}
      >
        <Icon type="google" />
        <span>Sign Up with Google</span>
      </Button>
    </div>
  ));
