// @flow

import { createContext } from 'react';

const StoreContext = createContext({
  logo: null,
  cover: null,
  tabs: [],
  storeId: 0,
  name: ' ',
  rating: 0,
  active: null,
});

export default StoreContext;
