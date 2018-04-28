// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

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

type MutationParamsType = {
  email: string,
  password: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        email: params.email,
        password: params.password,
      },
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
