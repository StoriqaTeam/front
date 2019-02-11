// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';
import type {
  CreateDisputeMutationVariables,
  CreateDisputeMutationResponse,
} from './__generated__/CreateDisputeMutation.graphql';

const mutation = graphql`
  mutation CreateDisputeMutation($input: CreateDisputeInput!) {
    createDispute(input: $input) {
      mock
    }
  }
`;

const CreateDisputeMutation: MutationType<
  CreateDisputeMutationVariables,
  CreateDisputeMutationResponse,
> = basicMutation(mutation, 'createDispute');

export default CreateDisputeMutation;
