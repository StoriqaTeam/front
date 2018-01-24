// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateUserMutation($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      id,
      rawId,
      email,
      isActive,
    }
  }
`;

type MutationParamsType = {
  login: string,
  password: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  mutation,
  variables: {
    email: params.login,
    password: params.password,
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
