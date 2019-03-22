// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  CreateStoreSubscriptionMutationVariables,
  CreateStoreSubscriptionMutationResponse,
} from './__generated__/CreateStoreSubscriptionMutation.graphql';

export type MutationResponseType = CreateStoreSubscriptionMutationResponse;

const mutation = graphql`
  mutation CreateStoreSubscriptionMutation(
    $input: CreateStoreSubscriptionInput!
  ) {
    createStoreSubscription(input: $input) {
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

const createStoreSubscriptionMutation: MutationType<
  CreateStoreSubscriptionMutationVariables,
  CreateStoreSubscriptionMutationResponse,
> = basicMutation(mutation, 'createStoreSubscription');

export default createStoreSubscriptionMutation;
