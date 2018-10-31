// @flow strict

import { createContext } from 'react';
import { Environment } from 'relay-runtime';

import type { DirectoriesType } from 'types';

type AppContextType = {
  directories: DirectoriesType,
  environment: Environment,
  handleLogin: () => void,
  categories: { children: [] },
};
const AppContext = createContext(
  ({
    directories: {},
    environment: null,
    handleLogin: () => {},
    categories: { children: [] },
  }: AppContextType),
);

export default AppContext;
