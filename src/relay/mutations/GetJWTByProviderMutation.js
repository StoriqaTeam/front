// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation GetJWTByProviderMutation($input:CreateJWTProviderInput!) {
    getJWTByProvider(input: $input) {
      token
    }
  }
`;

type MutationParamsType = {
  provider: string,
  token: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: {
      clientMutationId: '',
      provider: params.provider,
      token: params.token,
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
    "getJWTByProvider": {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2VtYWlsIjoic2FsZGluLmlsaXlhQGdtYWlsLmNvbSJ9.zPpNXmoqmvLy2vvgg1SVIAVQLglFXYJK_0OPi_o1a_s"
    }
  }
}
*/
/* eslint-enable */
