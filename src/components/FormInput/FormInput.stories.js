import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs/react';

import FormInput from './FormInput';

storiesOf('FormInput', module)
  .addDecorator(withKnobs)
  .add('no label, no placeholder', () => {
    const username = text('Username', '');
    return (
      <div style={{ position: 'relative', top: 22 }}>
        <FormInput
          model={username}
          name="username"
          onChange={action('onChange')}
        />
      </div>
    );
  })
  .add('no label, placeholder', () => {
    const username = text('Username', '');
    return (
      <div style={{ position: 'relative', top: 22 }}>
        <FormInput
          model={username}
          name="username"
          placeholder="Username"
          onChange={action('onChange')}
        />
      </div>
    );
  })
  .add('label, no placeholder', () => {
    const username = text('Username', '');
    return (
      <div style={{ position: 'relative', top: 22 }}>
        <FormInput
          model={username}
          name="username"
          label="Username"
          onChange={action('onChange')}
        />
      </div>
    );
  })
  .add('default type "text" validation', () => {
    const username = text('Username', '');
    return (
      <div style={{ position: 'relative', top: 22 }}>
        <FormInput
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
        <FormInput
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
        <FormInput
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
        <FormInput
          model={username}
          name="username"
          label="Username"
          autocomplete="off"
          onChange={action('onChange')}
        />
      </div>
    );
  });
