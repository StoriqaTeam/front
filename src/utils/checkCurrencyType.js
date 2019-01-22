// @flow

const checkCurrencyType = (
  currency: 'STQ' | 'ETH' | 'BTC' | 'USD' | 'EUR',
): 'fiat' | 'crypto' => {
  if (currency === 'USD' || currency === 'EUR') {
    return 'fiat';
  }
  return 'crypto';
};

export default checkCurrencyType;
