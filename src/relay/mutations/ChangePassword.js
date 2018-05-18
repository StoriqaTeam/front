// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation ChangePasswordMutation($input: ChangePasswordInput!) {
    changePasword(input: $input) {
      success
    }
  }
`;

export type MutationParamsType = {
  input: {
    oldPassword: string,
    newPassword: string,
  },
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
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
