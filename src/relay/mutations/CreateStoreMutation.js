// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateStoreMutation($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      rawId
      name {
        lang
        text
      }
      currencyId
      shortDescription {
        lang
        text
      }
      longDescription {
        lang
        text
      }
      slug
    }
  }
`;

type MutationParamsType = {
  name: string,
  userId: string,
  currencyId: string,
  shortDescription: string,
  longDescription: string,
  slug: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: {
      clientMutationId: '',
      name: params.name,
      userId: params.userId,
      currencyId: params.currencyId,
      languageId: params.languageId,
      shortDescription: params.shortDescription,
      longDescription: params.longDescription,
      slug: params.slug,
      address: '',
      phone: '',
      email: '',
    },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
