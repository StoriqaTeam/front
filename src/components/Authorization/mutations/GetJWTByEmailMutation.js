// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  GetJWTByEmailMutationVariables,
  GetJWTByEmailMutationResponse,
} from './__generated__/GetJWTByEmailMutation.graphql';

const mutation = graphql`
  mutation GetJWTByEmailMutation($input: CreateJWTEmailInput!) {
    getJWTByEmail(input: $input) {
      token
    }
  }
`;

const getJWTByEmailMutation: MutationType<
  GetJWTByEmailMutationVariables,
  GetJWTByEmailMutationResponse,
> = basicMutation(mutation, 'getJWTByEmail');

export default getJWTByEmailMutation;
