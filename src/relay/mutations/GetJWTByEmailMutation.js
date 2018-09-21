// @flow strict

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type { GetJWTByEmailMutationResponse } from './__generated__/GetJWTByEmailMutation.graphql';

const mutation = graphql`
  mutation GetJWTByEmailMutation($input: CreateJWTEmailInput!) {
    getJWTByEmail(input: $input) {
      token
    }
  }
`;

type MutationParamsType = {
  email: string,
  password: string,
  environment: Environment,
  onCompleted: ?(
    response: ?GetJWTByEmailMutationResponse,
    errors: ?Array<Error>,
  ) => void,
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
