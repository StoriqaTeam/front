// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateUserMutation(
    $id: ID!,
    $email: String!,
    $phone: String,
    $firstName: String,
    $lastName: String,
    $middleName: String,
    $birthdate: String,
  ) {
    updateUser(
      id: $id,
      email: $email,
      phone:$phone,
      firstName:$firstName,
      lastName:$lastName,
      middleName:$middleName,
      birthdate:$birthdate
  ) {
      id
      email
      phone
      firstName
      lastName
      middleName
      birthdate
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
<example of response here>
*/
