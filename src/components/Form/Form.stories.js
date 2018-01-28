import React from 'react';
import { storiesOf } from '@storybook/react';

import Form from './Form';
import { FormInput } from 'components/FormInput'

storiesOf('Form', module)
  .add('with default "wrapperClass" ', () => (
    <div style={{ position: 'relative', top: 5 }}>
      <Form>
        <FormInput />
      </Form>
    </div>
  ));
