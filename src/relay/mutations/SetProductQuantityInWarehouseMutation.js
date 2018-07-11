// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  SetProductQuantityInWarehouseMutationVariables,
  SetProductQuantityInWarehouseMutationResponse,
} from './__generated__/SetProductQuantityInWarehouseMutation.graphql';

const mutation = graphql`
  mutation SetProductQuantityInWarehouseMutation(
    $input: ProductQuantityInput!
  ) {
    setProductQuantityInWarehouse(input: $input) {
      id
      productId
      warehouseId
      quantity
    }
  }
`;

export type MutationParamsType = {
  ...SetProductQuantityInWarehouseMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?SetProductQuantityInWarehouseMutationResponse,
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
