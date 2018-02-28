import React from 'react';
import { storiesOf } from '@storybook/react';

import { Alert } from 'components/Modal';

storiesOf('Alert', module)
  .add('Success', () => (
    <Alert
      showAlert
      text="Everything is correct!"
    />
  ))
  .add('Error', () => (
    <Alert
      showAlert
      isError
      text="Fill out all of the required fileds correctly in order to preview or to save."
    />
  ));
