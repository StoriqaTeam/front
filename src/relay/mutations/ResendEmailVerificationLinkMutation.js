// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import uuidv4 from 'uuid/v4';

const mutation = graphql`
  mutation ResendEmailVerificationLinkMutation($input: VerifyEmailResend!) {
    resendEmailVerificationLink(input: $input) {
      success
    }
  }
`;

export type ResendEmailVerificationLinkParams = {
  input: {
    clientMutationId: string,
    email: string,
  },
  environment: Environment,
  onCompleted: ?(response: boolean, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: ResendEmailVerificationLinkParams) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: uuidv4(),
        email: params.input.email,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
