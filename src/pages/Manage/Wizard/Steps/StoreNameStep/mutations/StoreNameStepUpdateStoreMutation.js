// @flow strict

import { graphql } from 'react-relay';

import { basicMutation } from 'relay/mutations';
import type { MutationType } from 'relay/mutations/basicMutation';

import type {
  StoreNameStepUpdateStoreMutationVariables,
  StoreNameStepUpdateStoreMutationResponse,
} from './__generated__/StoreNameStepUpdateStoreMutation.graphql';

const mutation = graphql`
  mutation StoreNameStepUpdateStoreMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      slug
      name {
        lang
        text
      }
      shortDescription {
        lang
        text
      }
    }
  }
`;

const updateStoreMutation: MutationType<
  StoreNameStepUpdateStoreMutationVariables,
  StoreNameStepUpdateStoreMutationResponse,
> = basicMutation(mutation, 'updateStore');

export { updateStoreMutation };
