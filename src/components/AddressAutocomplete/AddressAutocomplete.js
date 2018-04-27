// @flow
import React from 'react';

import { GoogleAPIWrapper, AddressForm } from 'components/AddressAutocomplete';

const AddressAfutocomplete = () => (
  <GoogleAPIWrapper>
    <AddressForm />
  </GoogleAPIWrapper>
);

export default AddressAutocomplete;
