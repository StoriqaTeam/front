// @flow strict

import { createContext } from 'react';
import { Environment } from 'relay-runtime';

import type { DirectoriesType } from 'types';

type AppContextType = {
  directories: DirectoriesType,
  environment: Environment,
  handleLogin: () => void,
  categories: { children: [], name: [] },
};
const AppContext = createContext(
  ({
    directories: {
      countries: {
        children: [],
      },
      currencies: [],
      fiatCurrencies: [],
      cryptoCurrencies: [],
      sellerCurrencies: [],
      languages: [],
      categories: {
        name: [],
        children: [],
      },
      // $FlowIgnoreMe
      orderStatuses: '',
      currencyExchange: [],
    },
    environment: null,
    handleLogin: () => {},
    categories: {
      name: [],
      children: [],
    },
  }: AppContextType),
);

export default AppContext;
