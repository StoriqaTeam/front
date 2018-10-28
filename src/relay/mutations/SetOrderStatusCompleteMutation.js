// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  SetOrderStatusCompleteMutationVariables,
  SetOrderStatusCompleteMutationResponse,
} from './__generated__/SetOrderStatusCompleteMutation.graphql';

export type {
  SetOrderStatusCompleteMutationResponse as SetOrderStatusCompleteMutationResponseType,
} from './__generated__/SetOrderStatusCompleteMutation.graphql';

const mutation = graphql`
  mutation SetOrderStatusCompleteMutation($input: OrderStatusCompleteInput!) {
    setOrderStatusComplete(input: $input) {
      id
      state
    }
  }
`;

export type MutationParamsType = {|
  ...SetOrderStatusCompleteMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?SetOrderStatusCompleteMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
|};

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
