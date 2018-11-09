// @flow strict

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';
import { map, reject, isNil } from 'ramda';

import { log } from 'utils';

type InputType = {
  destinationCountry: string,
  baseProductId: number,
  environment: Environment,
};

type AvailableDeliveryPackageType = {
  id: string,
  companyPackageRawId: number,
  name: string,
  price: number,
  currency: string,
  shippingId: number,
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
        id
        name
        price
        companyPackageRawId
        shippingId
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
    let availablePackages: Array<AvailableDeliveryPackageType | null> = [];
    if (
      response &&
      response.availableShippingForUser &&
      response.availableShippingForUser.packages instanceof Array
    ) {
      availablePackages = map(item => {
        const { id, companyPackageRawId, name, price, shippingId } = item;
        if (!isNil(id) && !isNil(name) && !isNil(price)) {
          return {
            id,
            companyPackageRawId,
            name,
            price,
            shippingId,
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
