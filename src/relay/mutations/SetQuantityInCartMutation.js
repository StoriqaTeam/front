// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type { SetQuantityInCartMutationVariables, SetQuantityInCartMutationResponse } from './__generated__/IncrementInCartMutation.graphql';

const mutation = graphql`
  mutation SetQuantityInCartMutation($input: SetQuantityInCartInput!) {
    setQuantityInCart(input: $input) {
      ...CartProduct_product
    }
  }
`;


export type SetQuantityInCartParams = {
  ...SetQuantityInCartMutationVariables,
  environment: Environment,
  onCompleted: ?(response: ?SetQuantityInCartMutationResponse, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
}

const commit = (params: SetQuantityInCartParams) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: { ...params.input },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
