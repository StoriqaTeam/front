// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  RecalcInvoiceAmountMutationVariables,
  RecalcInvoiceAmountMutationResponse,
} from './__generated__/RecalcInvoiceAmountMutation.graphql';

export type {
  RecalcInvoiceAmountMutationVariables as RecalcInvoiceAmountMutationVariablesType,
  RecalcInvoiceAmountMutationResponse as RecalcInvoiceAmountMutationResponseType,
} from './__generated__/RecalcInvoiceAmountMutation.graphql';

const mutation = graphql`
  mutation RecalcInvoiceAmountMutation($id: String!) {
    recalcInvoiceAmount(id: $id) {
      id
      amount
      priceReservedDueDateTime
      state
      wallet
      transactions {
        id
        amount
      }
    }
  }
`;

export type MutationParamsType = {|
  ...RecalcInvoiceAmountMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?RecalcInvoiceAmountMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
|};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      id: params.id,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
