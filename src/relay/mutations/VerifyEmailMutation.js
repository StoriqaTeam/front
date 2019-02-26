// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  VerifyEmailMutationVariables,
  VerifyEmailMutationResponse,
} from './__generated__/VerifyEmailMutation.graphql';

const mutation = graphql`
  mutation VerifyEmailMutation($input: VerifyEmailApply!) {
    verifyEmail(input: $input) {
      success
      email
      token
    }
  }
`;

export type VerifyEmailMutationParamsType = {
  variables: VerifyEmailMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?VerifyEmailMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: VerifyEmailMutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: params.variables,
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
