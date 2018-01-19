import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs/react';

import SignUpFormInput from './SignUpFormInput';

storiesOf('SignUpFormInput', module)
  .addDecorator(withKnobs)
  .add('default type "text" validation', () => {
    const username = text('Username', '');
    return (
      <div style={{ position: 'relative', top: 22 }}>
        <SignUpFormInput
          model={username}
          name="username"
          label="Username"
          onChange={action('onChange')}
        />
      </div>
    );
  })
  .add('type "email" validation', () => {
    const email = text('Email', '');
    return (
      <div style={{ position: 'relative', top: 22 }}>
        <SignUpFormInput
          model={email}
          type="email"
          name="email"
          label="Email"
          onChange={action('onChange')}
        />
      </div>
    );
  })
  .add('type "password" validation displaying "showPassword" button', () => {
    const password = text('Email', '');
    return (
      <div style={{ position: 'relative', top: 22 }}>
        <SignUpFormInput
          model={password}
          type="password"
          name="password"
          label="Email"
          onChange={action('onChange')}
        />
      </div>
    );
  })
  .add('with "autocomplete" off', () => {
    const username = text('Username', '');
    return (
      <div style={{ position: 'relative', top: 22 }}>
        <SignUpFormInput
          model={username}
          name="username"
          label="Username"
          autocomplete="off"
          onChange={action('onChange')}
        />
      </div>
    );
  });
