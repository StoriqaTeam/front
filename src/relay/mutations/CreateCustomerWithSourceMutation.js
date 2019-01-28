// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  CreateCustomerWithSourceMutationVariables,
  CreateCustomerWithSourceMutationResponse,
} from './__generated__/CreateCustomerWithSourceMutation.graphql';

const mutation = graphql`
  mutation CreateCustomerWithSourceMutation(
    $input: CreateCustomerWithSourceInput!
  ) {
    createCustomerWithSource(input: $input) {
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

export type CreateCustomerWithSourceMutationType = {
  ...CreateCustomerWithSourceMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateCustomerWithSourceMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: CreateCustomerWithSourceMutationType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: { ...params.input },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const createCustomerWithSource = relayStore.getRootField(
        'createCustomerWithSource',
      );
      const me = relayStore.getRoot().getLinkedRecord('me');
      me.setLinkedRecord(createCustomerWithSource, 'stripeCustomer');
    },
  });

export default { commit };
