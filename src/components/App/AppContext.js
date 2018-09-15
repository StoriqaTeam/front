// @flow strict

import { createContext } from 'react';

const AppContext = createContext({
  directories: {
    currencyExchange: [],
  },
});

export default AppContext;
