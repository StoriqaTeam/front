// @flow

import { graphql } from 'react-relay';

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

export default mutation;

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
