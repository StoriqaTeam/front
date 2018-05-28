// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  CreateUserMutationVariables,
  CreateUserMutationResponse,
} from './__generated__/CreateUserMutation.graphql';

const mutation = graphql`
  mutation CreateUserMutation($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      rawId
      email
      isActive
    }
  }
`;

export type MutationParamsType = {
  ...CreateUserMutationVariables,
  firstName: string,
  lastName: string,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateUserMutationResponse,
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
{
  "data": {
    "createUser": {
      "id": "dXNlcnNfdXNlcl81",
      "rawId": "5",
      "email": "test@em.ail",
      "isActive": true
    }
  }
}
*/
