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
      facebookUrl
      twitterUrl
      instagramUrl
      address
    }
  }
`;

type MutationParamsType = {
  email: string,
  phone: string,
  facebookUrl: string,
  twitterUrl: string,
  instagramUrl: string,
  address: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: {
      email: '',
      phone: '',
      facebookUrl: '',
      twitterUrl: '',
      instagramUrl: '',
      address: '',
    },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
