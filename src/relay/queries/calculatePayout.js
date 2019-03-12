// @flow strict

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';
// import { reject, isNil } from 'ramda';

import { log } from 'utils';

import type {
  calculatePayout_QueryResponse as CalculatePayoutResponseType,
  calculatePayout_QueryVariables as CalculatePayoutVariablesType,
} from './__generated__/calculatePayout_Query.graphql';

type InputType = CalculatePayoutVariablesType;

type ReturnType = CalculatePayoutResponseType;

const CALCULATE_PAYOUT = graphql`
  query calculatePayout_Query($input: CalculatePayoutInput!) {
    calculatePayout(input: $input) {
      orderIds
      currency
      grossAmount
      blockchainFeeOptions {
        value
        estimatedTimeSeconds
      }
    }
  }
`;

const calculatePayout = (data: {
  variables: InputType,
  environment: Environment,
}): Promise<ReturnType> => {
  log.debug();
  return fetchQuery(data.environment, CALCULATE_PAYOUT, data.variables).then(
    response => {
      if (response) {
        return Promise.resolve(response);
      }

      return Promise.reject(new Error('Unable to fetch packages'));
    },
  );
};

export default calculatePayout;
