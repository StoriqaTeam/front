// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  CreateRussiaBillingInfoMutationVariables,
  CreateRussiaBillingInfoMutationResponse,
} from './__generated__/CreateRussiaBillingInfoMutation.graphql';

const mutation = graphql`
  mutation CreateRussiaBillingInfoMutation($input: NewRussiaBillingInfoInput!) {
    createRussiaBillingInfo(input: $input) {
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

export type CreateRussiaBillingInfoMutationType = {
  ...CreateRussiaBillingInfoMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateRussiaBillingInfoMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: CreateRussiaBillingInfoMutationType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const createRussiaBillingInfo = relayStore.getRootField(
        'createRussiaBillingInfo',
      );
      const me = relayStore.getRoot().getLinkedRecord('me');
      const myStore = me.getLinkedRecord('myStore');
      const internationalBillingInfo = myStore.getLinkedRecord(
        'internationalBillingInfo',
      );

      if (internationalBillingInfo) {
        const internationalBillingInfoId = internationalBillingInfo.getValue(
          'id',
        );
        relayStore.delete(internationalBillingInfoId);
      }
      myStore.setLinkedRecord(createRussiaBillingInfo, 'russiaBillingInfo');
    },
  });

export default { commit };
