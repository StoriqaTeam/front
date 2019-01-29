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
      # storeId
      # swiftBic
      # bankName
      # fullName
      # iban
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
    // updater: relayStore => {
    //   const createCustomerWithSource = relayStore.getRootField(
    //     'createCustomerWithSource',
    //   );
    //   const me = relayStore.getRoot().getLinkedRecord('me');
    //   me.setLinkedRecord(createCustomerWithSource, 'stripeCustomer');
    // },
  });

export default { commit };
