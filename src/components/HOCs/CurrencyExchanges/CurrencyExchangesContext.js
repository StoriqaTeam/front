// @flow strict

import React from 'react';

import type { CurrencyExchangesQueryResponse } from './__generated__/CurrencyExchangesQuery.graphql';

type ContextType = CurrencyExchangesQueryResponse;

const CurrencyExchangesContext = React.createContext(
  ({
    currencyExchange: [],
  }: ContextType),
);

export default CurrencyExchangesContext;
