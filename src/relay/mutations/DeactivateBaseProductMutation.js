// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';
import uuidv4 from 'uuid/v4';

const mutation = graphql`
  mutation DeactivateBaseProductMutation($input: DeactivateBaseProductInput!) {
    deactivateBaseProduct(input: $input) {
      id
    }
  }
`;

type MutationParamsType = {
  id: string,
  parentID: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: uuidv4(),
        id: params.id,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const { parentID } = params;
      const storeProxy = relayStore.get(parentID);
      const conn = ConnectionHandler.getConnection(
        storeProxy,
        'Wizard_baseProducts',
      );
      ConnectionHandler.deleteNode(conn, params.id);
    },
  });

export default { commit };
