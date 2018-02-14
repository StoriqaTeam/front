import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, boolean } from '@storybook/addon-knobs';

import PasswordHints from './PasswordHints';

const stories = storiesOf('PasswordHints', module);
stories.addDecorator(withKnobs);

stories
  .add('Default', () => (
    <div
      style={{
        position: 'relative',
        margin: '50px',
        width: '200px',
      }}
    >
      <PasswordHints
        lowerCase={boolean('lowerCase', false)}
        upperCase={boolean('upperCase', false)}
        digit={boolean('digit', false)}
        specialCharacter={boolean('specialCharacter', false)}
        length={boolean('length', false)}
      />
    </div>
  ));
