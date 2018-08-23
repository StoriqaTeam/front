// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import { filter } from 'ramda';
import type {
  DeleteWarehouseMutationVariables,
  DeleteWarehouseMutationResponse,
} from './__generated__/DeleteWarehouseMutation.graphql';

const mutation = graphql`
  mutation DeleteWarehouseMutation($id: String!) {
    deleteWarehouse(id: $id) {
      id
    }
  }
`;

export type MutationParamsType = {
  ...DeleteWarehouseMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?DeleteWarehouseMutationResponse,
    errors: ?Array<Error>,
  ) => void,
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
      const storageId = relayStore
        .getRootField('deleteWarehouse')
        .getValue('id');
      relayStore.delete(storageId);
      const me = relayStore.getRoot().getLinkedRecord('me');
      const myStore = me.getLinkedRecord('myStore');
      const storages = myStore.getLinkedRecords('warehouses');
      const newStorages = filter(storage => storage !== null, storages);
      myStore.setLinkedRecords(newStorages, 'warehouses');
    },
  });

export default { commit };
