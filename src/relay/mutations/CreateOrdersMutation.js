// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateOrdersMutation($input: CreateOrderInput!) {
    createOrders(input: $input) {
      id
    }
  }
`;

type AddressParamsType = {
  country: string,
  value: string,
  administrativeAreaLevel1?: string,
  administrativeAreaLevel2?: string,
  locality: string,
  political?: string,
  postalCode: string,
  route?: string,
  streetNumber: string,
};

type CreateOrdersMutationVariables = {
  input: {
    receiverName: string,
    addressFull: AddressParamsType,
  },
};

export type MutationParamsType = {
  ...CreateOrdersMutationVariables,
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
  });

export default { commit };
