// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import { map } from 'ramda';

import type {
  UpdateUserDeliveryAddressFullMutationVariables,
  UpdateUserDeliveryAddressFullMutationResponse,
} from './__generated__/UpdateUserDeliveryAddressFullMutation.graphql';

const mutation = graphql`
  mutation UpdateUserDeliveryAddressFullMutation(
    $input: UpdateUserDeliveryAddressFullInput!
  ) {
    updateUserDeliveryAddressFull(input: $input) {
      rawId
      id
      userId
      isPriority
      address {
        country
        administrativeAreaLevel1
        administrativeAreaLevel2
        political
        postalCode
        streetNumber
        value
        route
        locality
      }
    }
  }
`;

export type MutationParamsType = {
  ...UpdateUserDeliveryAddressFullMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateUserDeliveryAddressFullMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const updatedAddress = relayStore.getRootField(
        'updateUserDeliveryAddressFull',
      );
      const isPriority = updatedAddress.getValue('isPriority');
      const updatedAddressId = updatedAddress.getValue('id');
      const me = relayStore.getRoot().getLinkedRecord('me');
      const deliveryAddresses = me.getLinkedRecords('deliveryAddressesFull');
      const newDeliveryAddresses = map(item => {
        /* eslint-disable */
        if (item._dataID === updatedAddressId) {
          /* eslint-enable */
          return updatedAddress;
        }
        if (isPriority) {
          item.setValue(false, 'isPriority');
        }
        return item;
      }, deliveryAddresses);
      me.setLinkedRecords(newDeliveryAddresses, 'deliveryAddressesFull');
    },
  });

export default { commit };

/*
<example of response here>
*/
