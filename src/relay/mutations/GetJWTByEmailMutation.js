// @flow

import { graphql } from 'react-relay';

const mutation = graphql`
  mutation GetJWTByEmailMutation($email: String!, $password: String!) {
    getJWTByEmail(email:$email, password: $password) {
      token
    }
  }
`;

export default mutation;

/* eslint-disable */
/*
{
  "data": {
    "getJWTByEmail": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2VtYWlsIjoidGVzdEBlbS5haWwifQ.uJaimgDyZjBm883hT5Ai2G9S8joxjnfiqh5g3QKFm4k"
    }
  }
}
*/
/* eslint-enable */
