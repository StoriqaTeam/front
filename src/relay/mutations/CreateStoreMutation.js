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
  name: Array<{ lang: string, text: string }>,
  userId: number,
  defaultLanguage: string,
  shortDescription: Array<{ lang: string, text: string }>,
  longDescription: Array<{ lang: string, text: string }>,
  slug: string,
  slogan: string,
  logo?: string,
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
      defaultLanguage: params.defaultLanguage,
      shortDescription: params.shortDescription,
      longDescription: params.longDescription,
      slug: params.slug,
      slogan: params.slogan,
      logo: params.logo,
    },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
