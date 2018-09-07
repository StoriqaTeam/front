// @flow strict

import { graphql } from 'react-relay';

import { basicMutation } from 'relay/mutations';
import type { MutationType } from 'relay/mutations/basicMutation';

import type {
  AddressStepUpdateStoreAddressMutationVariables,
  AddressStepUpdateStoreAddressMutationResponse,
} from './__generated__/AddressStepUpdateStoreAddressMutation.graphql';

const mutation = graphql`
  mutation AddressStepUpdateStoreAddressMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      addressFull {
        value
        country
        administrativeAreaLevel1
        administrativeAreaLevel2
        locality
        political
        postalCode
        route
        streetNumber
        placeId
      }
    }
  }
`;

const updateStoreAddressMutation: MutationType<
  AddressStepUpdateStoreAddressMutationVariables,
  AddressStepUpdateStoreAddressMutationResponse,
> = basicMutation(mutation, 'updateStore');

export { updateStoreAddressMutation };
