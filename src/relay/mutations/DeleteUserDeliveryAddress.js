// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import { filter } from 'ramda';

const mutation = graphql`
  mutation DeleteUserDeliveryAddressMutation($id: Int!) {
    deleteUserDeliveryAddress(id: $id) {
      id
      rawId
    }
  }
`;

export type MutationParamsType = {
  id: number,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      id: params.id,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const addressId = relayStore
        .getRootField('deleteUserDeliveryAddress')
        .getValue('id');
      relayStore.delete(addressId);
      const me = relayStore.getRoot().getLinkedRecord('me');
      const deliveryAddresses = me.getLinkedRecords('deliveryAddresses');
      const newDeliveryAddresses = filter(
        address => address !== null,
        deliveryAddresses,
      );
      me.setLinkedRecords(newDeliveryAddresses, 'deliveryAddresses');
    },
  });

export default { commit };

/*
<example of response here>
*/
