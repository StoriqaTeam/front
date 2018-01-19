import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Button from './Button';

storiesOf('Button', module)
  .add('with "buttonClass" as default', () => (
    // eslint-disable-next-line
    <Button buttonClass="Button" title="Storiqa" />
  ))
  .add('with "buttonClass" as "signUpFormButton" ', () => (
    // eslint-disable-next-line
    <Button buttonClass="signUpFormButton" title="Storiqa" />
  ))
  .add('with "disabled" prop', () => (
    // eslint-disable-next-line
    <Button buttonClass="signUpFormButton" title="Storiqa" disabled={true} />
  ))
  .add('with "buttonClass" as "signUpFormButton" and "onClick" handler', () => (
    <Button buttonClass="signUpFormButton" title="Storiqa" onClick={action('click')} />
  ))
  .add('with "buttonClass" as "signUpFormButton" and type "submit"', () => (
    <Button buttonClass="signUpFormButton" type="submit" title="Storiqa" onClick={action('submit')} />
  ));
