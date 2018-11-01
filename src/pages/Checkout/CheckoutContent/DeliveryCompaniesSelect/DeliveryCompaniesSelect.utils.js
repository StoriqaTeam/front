// @flow strict

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';
import { map, reject, isNil, addIndex } from 'ramda';

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
    log.debug('fetchAvailableDeliveryPackages', { response });

    let availablePackages: Array<AvailableDeliveryPackageType | null> = [];
    if (
      response &&
      response.availableShippingForUser &&
      response.availableShippingForUser.packages instanceof Array
    ) {
      const mapIndexed = addIndex(map);
      availablePackages = mapIndexed((item, idx) => {
        const { companyPackageRawId: id, name, price } = item;
        if (!isNil(id) && !isNil(name) && !isNil(price)) {
          return {
            id: `${id}_${idx}`,
            name,
            price,
            currency: 'STQ',
          };
        }
        return null;
      }, response.availableShippingForUser.packages);

      return Promise.resolve(reject(isNil, availablePackages));
    }

    return Promise.reject(new Error('Unable to fetch packages'));
  });
};

export { fetchAvailableDeliveryPackages };
