import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Icon } from 'components/Icon';

import Button from './Button';

storiesOf('Button', module)
  .add('with default class', () => (
    <Button>
      <span>Storiqa</span>
    </Button>
  ))
  .add('signUp', () => (
    <Button>
      <span>Storiqa</span>
    </Button>
  ))
  .add('with "disabled" prop', () => (
    <Button disabled>
      <span>Storiqa</span>
    </Button>
  ))
  .add('signUp and onClick handler', () => (
    <Button onClick={action('click')}>
      <span>Storiqa</span>
    </Button>
  ))
  .add('signUp and type submit', () => (
    <Button
      type="submit"
      onClick={action('submit')}
    >
      <span>Storiqa</span>
    </Button>
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
