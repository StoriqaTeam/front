import { storiesOf } from '@storybook/react';

import { googleApiWrapper, AddressForm } from 'components/AddressAutocomplete';

const form = googleApiWrapper(AddressForm);

storiesOf('AddressAutocomplete', module)
  .add('Default', () => (
    form
  ));
