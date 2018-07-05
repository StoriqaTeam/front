// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  SetSelectionInCartMutationVariables,
  SetSelectionInCartMutationResponse,
} from './__generated__/SetSelectionInCartMutation.graphql';

const mutation = graphql`
  mutation SetSelectionInCartMutation($input: SetSelectionInCartInput!) {
    setSelectionInCart(input: $input) {
      ...Cart_cart
    }
  }
`;

export type SetSelectionInCartParams = {
  ...SetSelectionInCartMutationVariables,
  nodeId: string,
  environment: Environment,
  onCompleted: ?(
    response: ?SetSelectionInCartMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: SetSelectionInCartParams) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    optimisticUpdater: relayStore => {
      const {
        input: { value },
        nodeId,
      } = params;
      const product = relayStore.get(nodeId);
      product.setValue(value, 'selected');
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
