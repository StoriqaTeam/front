// @flow strict

import React from 'react';

import { GoogleAPIWrapper, AddressForm } from 'components/AddressAutocomplete';

const AddressAutocomplete = ({ isOpen }: { isOpen?: boolean }) => (
  <GoogleAPIWrapper>
    <AddressForm isOpen={isOpen} />
  </GoogleAPIWrapper>
);

AddressAutocomplete.defaultProps = {
  isOpen: false,
};

export default AddressAutocomplete;
