// @flow
import React from 'react';

import { GoogleAPIWrapper, AddressForm } from 'components/AddressAutocomplete';

const AddressAutocomplete = () => (
  <GoogleAPIWrapper>
    <AddressForm />
  </GoogleAPIWrapper>
);

export default AddressAutocomplete;
