import React from 'react';
import { storiesOf } from '@storybook/react';

import Button from './Button';

storiesOf('Button', module)
  .add('with text', () => (
    <Button title="Title here" />
  ))
  .add('with some emoji', () => (
    // eslint-disable-next-line
    <Button title="😀 😎 👍 💯" />
  ))
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
    // eslint-disable-next-line
    <Button buttonClass="signUpFormButton" title="Storiqa" onClick={() => console.log('click')} />
  ))
  .add('with "buttonClass" as "signUpFormButton" and type "submit"', () => (
    // eslint-disable-next-line
    <form onSubmit={e => {
      e.preventDefault();
      alert('submit');
    }}
    >
      <Button buttonClass="signUpFormButton" type="submit" title="Storiqa" />
    </form>
  ));
