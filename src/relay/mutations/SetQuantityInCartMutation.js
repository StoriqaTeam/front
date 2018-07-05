// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  SetQuantityInCartMutationVariables,
  SetQuantityInCartMutationResponse,
} from './__generated__/SetQuantityInCartMutation.graphql';

const mutation = graphql`
  mutation SetQuantityInCartMutation($input: SetQuantityInCartInput!) {
    setQuantityInCart(input: $input) {
      ...Cart_cart
    }
  }
`;

export type SetQuantityInCartParams = {
  ...SetQuantityInCartMutationVariables,
  nodeId: string,
  environment: Environment,
  onCompleted: ?(
    response: ?SetQuantityInCartMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: SetQuantityInCartParams) =>
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
      product.setValue(value, 'quantity');
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
