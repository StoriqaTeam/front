// @flow strict

import { log } from 'utils';

type InputType = {
  destinationCountry: string,
  baseProductId: number,
};

type AvailableDeliveryPackageType = {
  id: string,
  name: string,
  price: number,
  currency: string,
};
export type { AvailableDeliveryPackageType };

type ReturnType = Array<AvailableDeliveryPackageType>;

const fetchAvailableDeliveryPackages = (
  input: InputType,
): Promise<ReturnType> => {
  log.debug(input);
  return new Promise(resolve => {
    setTimeout(
      () =>
        resolve([
          { id: '1', name: 'UPS', price: 345, currency: 'STQ' },
          { id: '2', name: 'DHL', price: 54333, currency: 'USD' },
          { id: '3', name: 'China post', price: 1345, currency: 'BTC' },
        ]),
      2000,
    );
  });
};

export { fetchAvailableDeliveryPackages };
