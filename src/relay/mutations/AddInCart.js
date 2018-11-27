// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  AddInCartVariables,
  AddInCartResponse,
} from './__generated__/AddInCartMutation.graphql';

const mutation = graphql`
  mutation AddInCartMutation($input: AddInCartInput!) {
    AddInCart(input: $input) {
      ...Cart_cart
    }
  }
`;

export type AddInCartParams = {
  ...AddInCartVariables,
  environment: Environment,
  onCompleted: ?(response: ?AddInCartResponse, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: AddInCartParams) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
