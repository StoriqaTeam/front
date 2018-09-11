// @flow strict

import { graphql } from 'react-relay';

import { basicMutation } from 'relay/mutations';
import type { MutationType } from 'relay/mutations/basicMutation';

import type {
  WizardCreateBaseProductMutationVariables,
  WizardCreateBaseProductMutationResponse,
} from './__generated__/WizardCreateBaseProductMutation.graphql';

const mutation = graphql`
  mutation WizardCreateBaseProductMutation($input: CreateBaseProductInput!) {
    createBaseProduct(input: $input) {
      id
      rawId
    }
  }
`;

const createBaseProductMutation: MutationType<
  WizardCreateBaseProductMutationVariables,
  WizardCreateBaseProductMutationResponse,
> = basicMutation(mutation, 'createBaseProduct');

export { createBaseProductMutation };
