// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  ChangePasswordMutationVariables,
  ChangePasswordMutationResponse,
} from './__generated__/ChangePasswordMutation.graphql';

const mutation = graphql`
  mutation ChangePasswordMutation($input: ChangePasswordInput!) {
    changePassword(input: $input) {
      success
    }
  }
`;

export type MutationParamsType = {
  ...ChangePasswordMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?ChangePasswordMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

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

/*
<example of response here>
*/
