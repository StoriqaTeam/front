// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  ChargeFeeMutationVariables,
  ChargeFeeMutationResponse,
} from './__generated__/ChargeFeeMutation.graphql';

export type {
  ChargeFeeMutationResponse as ChargeFeeMutationResponseType,
} from './__generated__/ChargeFeeMutation.graphql';

const mutation = graphql`
  mutation ChargeFeeMutation($input: ChargeFeeInput!) {
    ChargeFee(input: $input) {
      id
      orderId
      amount
      status
      currency
      chargeId
    }
  }
`;

export type MutationParamsType = {|
  ...ChargeFeeMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?ChargeFeeMutationResponse,
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
  });

export default { commit };
