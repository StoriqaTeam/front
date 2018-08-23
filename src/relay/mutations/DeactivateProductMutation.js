// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';

import type {
  DeactivateProductVariables,
  DeactivateProductResponse,
} from './__generated__/DeactivateProductMutation.graphql';

const mutation = graphql`
  mutation DeactivateProductMutation($input: DeactivateProductInput!) {
    deactivateProduct(input: $input) {
      id
    }
  }
`;

export type MutationParamsType = {
  ...DeactivateProductVariables,
  parentID: string,
  environment: Environment,
  onCompleted: ?(
    response: ?DeactivateProductResponse,
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
      const deactivateProduct = relayStore.getRootField('deactivateProduct');
      const id = deactivateProduct.getValue('id');
      const { parentID } = params;
      const storeProxy = relayStore.get(parentID);
      const conn = ConnectionHandler.getConnection(
        storeProxy,
        'Wizard_products',
      );
      ConnectionHandler.deleteNode(conn, id);
    },
  });

export default { commit };
