// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  UpdateStoreSubscriptionMutationVariables,
  UpdateStoreSubscriptionMutationResponse,
} from './__generated__/UpdateStoreSubscriptionMutation.graphql';

export type MutationResponseType = UpdateStoreSubscriptionMutationResponse;

const mutation = graphql`
  mutation UpdateStoreSubscriptionMutation(
    $input: UpdateStoreSubscriptionInput!
  ) {
    updateStoreSubscription(input: $input) {
      id
      storeId
      currency
      value
      walletAddress
      trialStartDate
      status
    }
  }
`;

const updateStoreSubscriptionMutation: MutationType<
  UpdateStoreSubscriptionMutationVariables,
  UpdateStoreSubscriptionMutationResponse,
> = basicMutation(mutation, 'updateStoreSubscription');

export default updateStoreSubscriptionMutation;
