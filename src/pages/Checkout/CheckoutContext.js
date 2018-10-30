// @flow strict

import React from 'react';

type CheckoutContextType = {
  country: ?string,
};

const defaultContext: CheckoutContextType = {
  country: null,
};

const CheckoutContext = React.createContext(defaultContext);

export default CheckoutContext;
