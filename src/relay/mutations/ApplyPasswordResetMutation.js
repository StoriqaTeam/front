// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation ApplyPasswordResetMutation($input: ResetApply!) {
    applyPasswordReset(input: $input) {
      success
      token
    }
  }
`;

export type ApplyPasswordResetMutationParams = {
  input: {
    clientMutationId: string,
    password: string,
    token: string,
  },
  environment: Environment,
  onCompleted: ?(response: boolean, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: ApplyPasswordResetMutationParams) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        password: params.input.password,
        token: params.input.token,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
