// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';
import { findIndex } from 'ramda';

import type {
  IncrementInCartMutationVariables,
  IncrementInCartMutationResponse,
} from './__generated__/IncrementInCartMutation.graphql';

const mutation = graphql`
  mutation IncrementInCartMutation($input: IncrementInCartInput!) {
    incrementInCart(input: $input) {
      ...Cart_cart
    }
  }
`;

export type IncrementInCartParams = {
  ...IncrementInCartMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?IncrementInCartMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: IncrementInCartParams) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
