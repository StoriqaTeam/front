// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  PayOutCryptoToSellerMutationVariables,
  PayOutCryptoToSellerMutationResponse,
} from './__generated__/PayOutCryptoToSellerMutation.graphql';

export type MutationResponseType = PayOutCryptoToSellerMutationResponse;

const mutation = graphql`
  mutation PayOutCryptoToSellerMutation($input: PayOutCryptoToSellerInput!) {
    payOutCryptoToSeller(input: $input) {
      id
      grossAmount
      netAmount
      currency
      walletAddress
      blockchainFee
      initiatedAt
      completedAt
      orderIds
    }
  }
`;

const payOutCryptoToSellerMutation: MutationType<
  PayOutCryptoToSellerMutationVariables,
  PayOutCryptoToSellerMutationResponse,
> = basicMutation(mutation, 'payOutCryptoToSeller');

export default payOutCryptoToSellerMutation;
