// @flow strict

export type CurrencyExchangeType = Array<{
  code: string,
  rates: Array<{
    code: string,
    value: number,
  }>,
}>;
