// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import { map } from 'ramda';

import type {
  CreateUserDeliveryAddressMutationVariables,
  CreateUserDeliveryAddressMutationResponse,
} from './__generated__/CreateUserDeliveryAddressMutation.graphql';

const mutation = graphql`
  mutation CreateUserDeliveryAddressMutation(
    $input: NewUserDeliveryAddressInput!
  ) {
    createUserDeliveryAddress(input: $input) {
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
  ...CreateUserDeliveryAddressMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateUserDeliveryAddressMutationResponse,
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
      const address = relayStore.getRootField('createUserDeliveryAddress');
      const isPriority = address.getValue('isPriority');
      const me = relayStore.getRoot().getLinkedRecord('me');
      const deliveryAddresses = me.getLinkedRecords('deliveryAddresses');
      map(item => {
        if (isPriority) {
          item.setValue(false, 'isPriority');
        }
        return item;
      }, deliveryAddresses);
      const newDeliveryAddresses = [address, ...deliveryAddresses];
      me.setLinkedRecords(newDeliveryAddresses, 'deliveryAddresses');
    },
  });

export default { commit };

/*
<example of response here>
*/
