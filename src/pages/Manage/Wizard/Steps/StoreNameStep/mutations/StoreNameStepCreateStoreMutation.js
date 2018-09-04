// @flow strict

import { graphql } from 'react-relay';

import { basicMutation } from 'relay/mutations';
import type { MutationType } from 'relay/mutations/basicMutation';

import type {
  StoreNameStepCreateStoreMutationVariables,
  StoreNameStepCreateStoreMutationResponse,
} from './__generated__/StoreNameStepCreateStoreMutation.graphql';

const mutation = graphql`
  mutation StoreNameStepCreateStoreMutation($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      name {
        lang
        text
      }
      slug
      shortDescription {
        lang
        text
      }
    }
  }
`;

const createStoreMutation: MutationType<
  StoreNameStepCreateStoreMutationVariables,
  StoreNameStepCreateStoreMutationResponse,
> = basicMutation(mutation, 'createStore');

export { createStoreMutation };
