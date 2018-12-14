// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';

import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  RefreshJWTMutationVariables as Variables,
  RefreshJWTMutationResponse as Response,
} from './__generated__/RefreshJWTMutation.graphql';

const mutation = graphql`
  mutation RefreshJWTMutation {
    refreshJWT
  }
`;

const refreshJWTMutation: MutationType<Variables, Response> = basicMutation(
  mutation,
  'refreshJWT',
);

export default refreshJWTMutation;
