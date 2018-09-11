// @flow strict

import { graphql } from 'react-relay';

import { basicMutation } from 'relay/mutations';
import type { MutationType } from 'relay/mutations/basicMutation';

import type {
  WizardCreateProductWithAttributesMutationVariables,
  WizardCreateProductWithAttributesMutationResponse,
} from './__generated__/WizardCreateProductWithAttributesMutation.graphql';

const mutation = graphql`
  mutation WizardCreateProductWithAttributesMutation(
    $input: CreateProductWithAttributesInput!
  ) {
    createProduct(input: $input) {
      id
    }
  }
`;

const createProductMutation: MutationType<
  WizardCreateProductWithAttributesMutationVariables,
  WizardCreateProductWithAttributesMutationResponse,
> = basicMutation(mutation, 'createProduct');

export { createProductMutation };
