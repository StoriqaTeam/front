// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpdateCustomerMutationVariables,
  UpdateCustomerMutationResponse,
} from './__generated__/UpdateCustomerMutation.graphql';

const mutation = graphql`
  mutation UpdateCustomerMutation($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      id
      cards {
        id
        brand
        country
        customer
        expMonth
        expYear
        last4
        name
      }
    }
  }
`;

export type UpdateCustomerMutationType = {
  ...UpdateCustomerMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateCustomerMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: UpdateCustomerMutationType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const updateCustomer = relayStore.getRootField('updateCustomer');
      const me = relayStore.getRoot().getLinkedRecord('me');
      me.setLinkedRecord(updateCustomer, 'stripeCustomer');
    },
  });

export default { commit };
