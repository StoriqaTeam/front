// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type { SetInCartMutationVariables, SetInCartMutationResponse } from './__generated__/IncrementInCartMutation.graphql';

const mutation = graphql`
  mutation SetInCartMutation($input: SetInCartInput!) {
    setInCart(input: $input) {
      ...CartProduct_product
    }
  }
`;


export type SetInCartParams = {
  ...SetInCartMutationVariables,
  environment: Environment,
  onCompleted: ?(response: ?SetInCartMutationResponse, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
}

const commit = (params: SetInCartParams) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: { ...params.input },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
