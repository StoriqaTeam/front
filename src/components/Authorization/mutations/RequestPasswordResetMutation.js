// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  RequestPasswordResetMutationVariables,
  RequestPasswordResetMutationResponse,
} from './__generated__/RequestPasswordResetMutation.graphql';

const mutation = graphql`
  mutation RequestPasswordResetMutation($input: ResetRequest!) {
    requestPasswordReset(input: $input) {
      success
    }
  }
`;

const requestPasswordResetMutation: MutationType<
  RequestPasswordResetMutationVariables,
  RequestPasswordResetMutationResponse,
> = basicMutation(mutation, 'requestPasswordReset');

export default requestPasswordResetMutation;
