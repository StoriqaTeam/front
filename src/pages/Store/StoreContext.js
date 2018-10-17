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
  facebookUrl: '',
  twitterUrl: '',
  instagramUrl: '',
});

export default StoreContext;
