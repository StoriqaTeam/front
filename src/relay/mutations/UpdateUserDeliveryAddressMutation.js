// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import { map } from 'ramda';

import type {
  UpdateUserDeliveryAddressMutationVariables,
  UpdateUserDeliveryAddressMutationResponse,
} from './__generated__/UpdateUserDeliveryAddressMutation.graphql';

const mutation = graphql`
  mutation UpdateUserDeliveryAddressMutation(
    $input: UpdateUserDeliveryAddressInput!
  ) {
    updateUserDeliveryAddress(input: $input) {
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
  ...UpdateUserDeliveryAddressMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateUserDeliveryAddressMutationResponse,
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
        'updateUserDeliveryAddress',
      );
      const isPriority = updatedAddress.getValue('isPriority');
      const updatedAddressId = updatedAddress.getValue('id');
      const me = relayStore.getRoot().getLinkedRecord('me');
      const deliveryAddresses = me.getLinkedRecords('deliveryAddresses');
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
      me.setLinkedRecords(newDeliveryAddresses, 'deliveryAddresses');
    },
  });

export default { commit };

/*
<example of response here>
*/
