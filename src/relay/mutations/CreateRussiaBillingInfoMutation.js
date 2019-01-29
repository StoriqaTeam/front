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
      # storeId
      # kpp
      # bic
      # inn
      # fullName
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
    // updater: relayStore => {
    //   const createCustomerWithSource = relayStore.getRootField(
    //     'createCustomerWithSource',
    //   );
    //   const me = relayStore.getRoot().getLinkedRecord('me');
    //   me.setLinkedRecord(createCustomerWithSource, 'stripeCustomer');
    // },
  });

export default { commit };
