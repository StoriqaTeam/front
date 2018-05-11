// @flow

// TODO: rename to UpdateStoreContactsMutation

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateStoreMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      rawId
      email
      phone
      country
      address
      facebookUrl
      twitterUrl
      instagramUrl
    }
  }
`;

type MutationParamsType = {
  id: string,
  email: string,
  phone: string,
  country: string,
  address: string,
  facebookUrl: string,
  twitterUrl: string,
  instagramUrl: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        id: params.id,
        email: params.email,
        phone: params.phone,
        country: params.country,
        address: params.address,
        facebookUrl: params.facebookUrl,
        twitterUrl: params.twitterUrl,
        instagramUrl: params.instagramUrl,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
