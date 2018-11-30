// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  GetJWTByProviderMutationVariables,
  GetJWTByProviderMutationResponse,
} from './__generated__/GetJWTByProviderMutation.graphql';

const mutation = graphql`
  mutation GetJWTByProviderMutation($input: CreateJWTProviderInput!) {
    getJWTByProvider(input: $input) {
      token
    }
  }
`;

const getJWTByProviderMutation: MutationType<
  GetJWTByProviderMutationVariables,
  GetJWTByProviderMutationResponse,
> = basicMutation(mutation, 'getJWTByProvider');

export default getJWTByProviderMutation;

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
