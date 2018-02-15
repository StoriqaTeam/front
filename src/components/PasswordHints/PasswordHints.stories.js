import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import PasswordHints from './PasswordHints';

const stories = storiesOf('PasswordHints', module);
stories.addDecorator(withKnobs);

stories
  .add('Default', () => (
    <PasswordHints
      lowerCase={boolean('lowerCase', false)}
      upperCase={boolean('upperCase', false)}
      digit={boolean('digit', false)}
      specialCharacter={boolean('specialCharacter', false)}
      length={boolean('length', false)}
    />
  ));
