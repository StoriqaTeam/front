import React from 'react';
import { storiesOf } from '@storybook/react';

import { GoogleAPIWrapper, AddressForm } from 'components/AddressAutocomplete';

storiesOf('AddressAutocomplete', module)
  .add('Default', () => (
    <GoogleAPIWrapper>
      <AddressForm />
    </GoogleAPIWrapper>
  ));
