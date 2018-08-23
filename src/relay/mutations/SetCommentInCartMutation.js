// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  SetCommentInCartMutationVariables,
  SetCommentInCartMutationResponse,
} from './__generated__/SetQuantityInCartMutation.graphql';

const mutation = graphql`
  mutation SetCommentInCartMutation($input: SetCommentInCartInput!) {
    setCommentInCart(input: $input) {
      ...Cart_cart
    }
  }
`;

export type SetCommentInCartParams = {
  ...SetCommentInCartMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?SetCommentInCartMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: SetCommentInCartParams) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
