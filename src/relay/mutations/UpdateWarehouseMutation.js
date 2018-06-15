// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpdateWarehouseMutationVariables,
  UpdateWarehouseMutationResponse,
} from './__generated__/UpdateWarehouseMutation.graphql';

const mutation = graphql`
  mutation UpdateWarehouseMutation($input: UpdateWarehouseInput!) {
    updateWarehouse(input: $input) {
      id
      rawId
      name
      storeId
      addressFull {
        country
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
  ...UpdateWarehouseMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateWarehouseMutationResponse,
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
