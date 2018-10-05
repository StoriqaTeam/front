// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  DeleteCustomAttributeMutationVariables,
  DeleteCustomAttributeMutationResponse,
} from './__generated__/DeleteCustomAttributeMutation.graphql';
import { filter } from 'ramda';

const mutation = graphql`
  mutation DeleteCustomAttributeMutation($input: DeleteCustomAttributeInput!) {
    deleteCustomAttribute(input: $input) {
      id
      rawId
      attributeId
      baseProductId
    }
  }
`;

export type MutationParamsType = {|
  ...DeleteCustomAttributeMutationVariables,
  environment: Environment,
  baseProductId: string,
  onCompleted: ?(
    response: ?DeleteCustomAttributeMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
|};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const attributeId = relayStore
        .getRootField('deleteCustomAttribute')
        .getValue('id');
      relayStore.delete(attributeId);
      const baseProductProxy = relayStore.get(params.baseProductId);
      const customAttributes = baseProductProxy.getLinkedRecords(
        'customAttributes',
      );
      const newCustomAttributes = filter(
        attribute => attribute !== null,
        customAttributes,
      );
      baseProductProxy.setLinkedRecords(
        newCustomAttributes,
        'customAttributes',
      );
    },
  });

export default { commit };
