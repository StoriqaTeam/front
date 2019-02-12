// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  CreateInternationalBillingInfoMutationVariables,
  CreateInternationalBillingInfoMutationResponse,
} from './__generated__/CreateInternationalBillingInfoMutation.graphql';

const mutation = graphql`
  mutation CreateInternationalBillingInfoMutation(
    $input: NewInternationalBillingInfoInput!
  ) {
    createInternationalBillingInfo(input: $input) {
      id
      rawId
      storeId
      account
      currency
      name
      bank
      swift
      bankAddress
      country
      city
      recipientAddress
    }
  }
`;

export type CreateInternationalBillingInfoMutationType = {
  ...CreateInternationalBillingInfoMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateInternationalBillingInfoMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: CreateInternationalBillingInfoMutationType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const createInternationalBillingInfo = relayStore.getRootField(
        'createInternationalBillingInfo',
      );
      const me = relayStore.getRoot().getLinkedRecord('me');
      const myStore = me.getLinkedRecord('myStore');
      const russiaBillingInfo = myStore.getLinkedRecord('russiaBillingInfo');
      if (russiaBillingInfo) {
        const russiaBillingInfoId = russiaBillingInfo.getValue('id');
        relayStore.delete(russiaBillingInfoId);
      }
      myStore.setLinkedRecord(
        createInternationalBillingInfo,
        'internationalBillingInfo',
      );
    },
  });

export default { commit };
