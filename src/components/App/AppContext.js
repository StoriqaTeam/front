// @flow strict

import { createContext } from 'react';

import type { CountriesDefaultType } from 'types';

type AppContextType = {
  directories: {
    countries: CountriesDefaultType,
    [string]: { [string]: string | number | Array<*> | {} },
  },
};
const AppContext = createContext(
  ({ directories: { countries: { children: [] } } }: AppContextType),
);

export default AppContext;
