// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  CreateWarehouseMutationVariables,
  CreateWarehouseMutationResponse,
} from './__generated__/CreateWarehouseMutation.graphql';

const mutation = graphql`
  mutation CreateWarehouseMutation($input: CreateWarehouseInput!) {
    createWarehouse(input: $input) {
      id
      name
      storeId
      store {
        id
        warehouses {
          id
        }
      }
      addressFull {
        country
        countryCode
        administrativeAreaLevel1
        administrativeAreaLevel2
        political
        postalCode
        streetNumber
        value
        route
        locality
      }
    }
  }
`;

export type MutationParamsType = {
  ...CreateWarehouseMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateWarehouseMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
