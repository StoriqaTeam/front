import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { Icon } from 'components/Icon';

import Button from './Button';

const stories = storiesOf('Button', module);
stories.addDecorator(withKnobs);

stories
  .add('Default', () => (
    <StoriesDecorator>
      <Button
        disabled={boolean('Disabled', false)}
        onClick={action('click')}
      >
        <span>Storiqa</span>
      </Button>
    </StoriesDecorator>
  ))
  .add('Social', () => (
    <StoriesDecorator>
      <Button
        iconic
        onClick={action('click')}
      >
        <Icon type="google" />
        <span>Sign Up with Google</span>
      </Button>
    </StoriesDecorator>
  ));
