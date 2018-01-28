import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './Button';

storiesOf('Button', module)
  .add('with default class', () => (
    <Button
      title="Storiqa"
    />
  ))
  .add('with "buttonClass" as "signUp" ', () => (
    <Button
      buttonClass="signUp"
      title="Storiqa"
    />
  ))
  .add('with "disabled" prop', () => (
    <Button
      buttonClass="signUp"
      title="Storiqa"
      disabled={true}
    />
  ))
  .add('with "buttonClass" as "signUp" and "onClick" handler', () => (
    <Button
      buttonClass="signUp"
      title="Storiqa"
      onClick={action('click')}
    />
  ))
  .add('with "buttonClass" as "signUp" and type "submit"', () => (
    <Button
      buttonClass="signUp"
      type="submit"
      title="Storiqa"
      onClick={action('submit')}
    />
  ));
