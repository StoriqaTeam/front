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

const promise = (
  input: SetProductQuantityInWarehouseMutationVariables,
  environment: Environment,
): Promise<SetProductQuantityInWarehouseMutationResponse> =>
  new Promise((resolve, reject) => {
    commit({
      ...input,
      environment,
      onCompleted: (
        response: ?SetProductQuantityInWarehouseMutationResponse,
        errors: ?Array<Error>,
      ) => {
        if (errors) {
          reject(errors);
        } else if (response) {
          resolve(response);
        } else {
          // eslint-disable-next-line
          reject([new Error('Unknown error')]);
        }
      },
      onError: (error: Error) => {
        // eslint-disable-next-line
        reject([error]);
      },
    });
  });

export default { commit, promise };
