// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import type {
  DeleteWarehouseMutationVariables,
  DeleteWarehouseMutationResponse,
} from './__generated__/DeleteWarehouseMutation.graphql';

const mutation = graphql`
  mutation DeleteWarehouseMutation($id: String!) {
    deleteWarehouse(id: $id) {
      id
    }
  }
`;

export type MutationParamsType = {
  ...DeleteWarehouseMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?DeleteWarehouseMutationResponse,
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
