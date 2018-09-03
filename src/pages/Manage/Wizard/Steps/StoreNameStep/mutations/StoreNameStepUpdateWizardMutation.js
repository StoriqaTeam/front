// @flow strict

import { graphql } from 'react-relay';

import { basicMutation } from 'relay/mutations';
import type { MutationType } from 'relay/mutations/basicMutation';

import type {
  StoreNameStepUpdateWizardMutationVariables,
  StoreNameStepUpdateWizardMutationResponse,
} from './__generated__/StoreNameStepUpdateWizardMutation.graphql';

const mutation = graphql`
  mutation StoreNameStepUpdateWizardMutation($input: UpdateWizardStoreInput!) {
    updateWizardStore(input: $input) {
      id
      name
      shortDescription
      slug
      store {
        id
      }
    }
  }
`;

const updateWizardMutation: MutationType<
  StoreNameStepUpdateWizardMutationVariables,
  StoreNameStepUpdateWizardMutationResponse,
> = basicMutation(mutation, 'updateWizardStore');

export { updateWizardMutation };
