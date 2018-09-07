// @flow

// TODO: rename to UpdateStoreContactsMutation

import { graphql } from 'react-relay';

import { basicMutation } from 'relay/mutations';
import type { MutationType } from 'relay/mutations/basicMutation';

import type {
  UpdateStoreMutationVariables,
  UpdateStoreMutationResponse,
} from './__generated__/UpdateStoreMutation.graphql';

const mutation = graphql`
  mutation UpdateStoreMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      rawId
      defaultLanguage
      email
      phone
      slug
      logo
      name {
        lang
        text
      }
      shortDescription {
        lang
        text
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
      address
      country
      facebookUrl
      twitterUrl
      instagramUrl
      baseProducts(first: 100) @connection(key: "Wizard_baseProducts") {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

const updateStoreMutation: MutationType<
  UpdateStoreMutationVariables,
  UpdateStoreMutationResponse,
> = basicMutation(mutation, 'updateStore');

export { updateStoreMutation };
