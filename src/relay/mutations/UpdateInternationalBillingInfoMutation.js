// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpdateInternationalBillingInfoMutationVariables,
  UpdateInternationalBillingInfoMutationResponse,
} from './__generated__/UpdateInternationalBillingInfoMutation.graphql';

const mutation = graphql`
  mutation UpdateInternationalBillingInfoMutation(
    $input: UpdateInternationalBillingInfoInput!
  ) {
    updateInternationalBillingInfo(input: $input) {
      id
      storeId
      swiftBic
      bankName
      fullName
      iban
    }
  }
`;

export type UpdateInternationalBillingInfoMutationType = {
  ...UpdateInternationalBillingInfoMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateInternationalBillingInfoMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: UpdateInternationalBillingInfoMutationType) =>
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
