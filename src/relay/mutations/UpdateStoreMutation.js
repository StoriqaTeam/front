// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateStoreMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      rawId
      email
      phone
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
  address: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: {
      clientMutationId: '',
      id: params.id,
      email: params.email,
      phone: params.phone,
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
