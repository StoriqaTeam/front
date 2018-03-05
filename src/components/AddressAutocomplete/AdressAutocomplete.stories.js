import React from 'react';
import { storiesOf } from '@storybook/react';

import { AddressAutocomplete } from 'components/AddressAutocomplete';

storiesOf('AddressAutocomplete', module)
  .add('Default', () => (
    <AddressAutocomplete />
  ));
