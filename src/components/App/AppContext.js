// @flow strict

import { createContext } from 'react';
import { Environment } from 'relay-runtime';

import type { CountriesDefaultType } from 'types';

type AppContextType = {
  directories: {
    countries: CountriesDefaultType,
    [string]: { [string]: string | number | Array<*> | {} },
    environment: Environment,
  },
};
const AppContext = createContext(
  ({
    directories: {
      countries: {
        children: [],
      },
    },
    environment: null,
  }: AppContextType),
);

export default AppContext;
