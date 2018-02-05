import React from 'react';
import { storiesOf } from '@storybook/react';

import { FormInput } from 'components/FormInput';
import Form from './Form';

storiesOf('Form', module)
  .add('with default "wrapperClass" ', () => (
    <div style={{ position: 'relative', top: 5 }}>
      <Form>
        <FormInput />
      </Form>
    </div>
  ));
