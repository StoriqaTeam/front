// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateUserDeliveryAddressMutation(
    $input: NewUserDeliveryAddressInput!
  ) {
    createUserDeliveryAddress(input: $input) {
      rawId
      id
      userId
      isPriority
      address {
        country
        administrativeAreaLevel1
        administrativeAreaLevel2
        political
        postalCode
        streetNumber
        value
        route
        locality
      }
    }
  }
`;

export type MutationParamsType = {
  input: {
    userId: number,
    country: string,
    administrativeAreaLevel1: ?string,
    administrativeAreaLevel2: ?string,
    political: ?string,
    postalCode: string,
    streetNumber: ?string,
    address: ?string,
    route: ?string,
    locality: ?string,
    isPriority: boolean,
  },
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const address = relayStore.getRootField('createUserDeliveryAddress');
      const me = relayStore.getRoot().getLinkedRecord('me');
      const deliveryAddresses = me.getLinkedRecords('deliveryAddresses');
      const newDeliveryAddresses = [...deliveryAddresses, address];
      me.setLinkedRecords(newDeliveryAddresses, 'deliveryAddresses');
    },
  });

export default { commit };

/*
<example of response here>
*/
