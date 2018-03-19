import React from 'react';
import { storiesOf } from '@storybook/react';

import { GoogleAPIWrapper, AutocompleteComponent } from 'components/AddressAutocomplete';

storiesOf('AddressAutocomplete', module)
  .add('Default', () => (
    <GoogleAPIWrapper>
      <AutocompleteComponent />
    </GoogleAPIWrapper>
  ));
