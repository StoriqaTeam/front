// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpdateRussiaBillingInfoMutationVariables,
  UpdateRussiaBillingInfoMutationResponse,
} from './__generated__/UpdateRussiaBillingInfoMutation.graphql';

const mutation = graphql`
  mutation UpdateRussiaBillingInfoMutation(
    $input: UpdateRussiaBillingInfoInput!
  ) {
    updateRussiaBillingInfo(input: $input) {
      id
      rawId
      storeId
      bankName
      branchName
      swiftBic
      taxId
      correspondentAccount
      currentAccount
      personalAccount
      beneficiaryFullName
    }
  }
`;

export type UpdateRussiaBillingInfoMutationType = {
  ...UpdateRussiaBillingInfoMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateRussiaBillingInfoMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: UpdateRussiaBillingInfoMutationType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const updateRussiaBillingInfo = relayStore.getRootField(
        'updateRussiaBillingInfo',
      );
      const me = relayStore.getRoot().getLinkedRecord('me');
      const myStore = me.getLinkedRecord('myStore');
      myStore.setLinkedRecord(updateRussiaBillingInfo, 'russiaBillingInfo');
    },
  });

export default { commit };
