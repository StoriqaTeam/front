// @flow strict

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

import { log } from 'utils';

type InputType = {
  destinationCountry: string,
  baseProductId: number,
  environment: Environment,
};

type AvailableDeliveryPackageType = {
  id: string,
  name: string,
  price: number,
  currency: string,
};
export type { AvailableDeliveryPackageType };

type ReturnType = Array<AvailableDeliveryPackageType>;

const AVAILABLE_PACKAGES_FOR_USER = graphql`
  query DeliveryCompaniesSelect_Query(
    $userCountry: String!
    $baseProductId: Int!
  ) {
    availableShippingForUser(
      userCountry: $userCountry
      baseProductId: $baseProductId
    ) {
      packages {
        name
        price
        companyPackageRawId
        logo
      }
    }
  }
`;

const fetchAvailableDeliveryPackages = (
  input: InputType,
): Promise<ReturnType> => {
  log.debug();
  return fetchQuery(input.environment, AVAILABLE_PACKAGES_FOR_USER, {
    userCountry: input.destinationCountry,
    baseProductId: input.baseProductId,
  }).then(response => {
    if (true || response.availableShippingForUser) {
      return Promise.resolve([
        { id: '1', name: 'UPS', price: 345, currency: 'STQ' },
        { id: '2', name: 'DHL', price: 54333, currency: 'USD' },
        { id: '3', name: 'China post', price: 1345, currency: 'BTC' },
      ]);
    }
    return Promise.reject(new Error('Unable to fetch packages'));
  });
  // return new Promise(resolve => {
  //   setTimeout(
  //     () =>
  //       resolve([
  //         { id: '1', name: 'UPS', price: 345, currency: 'STQ' },
  //         { id: '2', name: 'DHL', price: 54333, currency: 'USD' },
  //         { id: '3', name: 'China post', price: 1345, currency: 'BTC' },
  //       ]),
  //     2000,
  //   );
  // });
};

export { fetchAvailableDeliveryPackages };
