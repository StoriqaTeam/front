// @flow strict

import { graphql } from 'react-relay';

import { basicMutation } from 'relay/mutations';
import type { MutationType } from 'relay/mutations/basicMutation';

import type {
  StoreNameStepCreateWizardMutationResponse,
  StoreNameStepCreateWizardMutationVariables,
} from './__generated__/StoreNameStepCreateWizardMutation.graphql';

const mutation = graphql`
  mutation StoreNameStepCreateWizardMutation {
    createWizardStore {
      id
      rawId
      storeId
      name
      slug
      shortDescription
      defaultLanguage
      store {
        id
        rawId
      }
      addressFull {
        country
        value
        administrativeAreaLevel1
        administrativeAreaLevel2
        locality
        political
        postalCode
        route
        streetNumber
      }
      stepThree {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

const createWizardMutation: MutationType<
  StoreNameStepCreateWizardMutationVariables,
  StoreNameStepCreateWizardMutationResponse,
> = basicMutation(mutation, 'createWizardStore');

export { createWizardMutation };
