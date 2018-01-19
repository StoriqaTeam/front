// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation GetJWTByEmailMutation($email: String!, $password: String!) {
    getJWTByEmail(email:$email, password: $password) {
      token
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
