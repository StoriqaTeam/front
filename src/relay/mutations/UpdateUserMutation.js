// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      phone
      firstName
      lastName
      middleName
      birthdate
      gender
      isActive
    }
  }
`;

type MutationParamsType = {
  input: {
    id: string,
    phone: ?string,
    firstName: ?string,
    lastName: ?string,
    middleName: ?string,
    birthdate: ?string,
    gender: string,
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
