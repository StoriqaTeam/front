// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateStoreMainMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      name {
        lang
        text
      }
      longDescription {
        lang
        text
      }
      shortDescription {
        lang
        text
      }
      defaultLanguage
      slug
      slogan
    }
  }
`;

type MutationParamsType = {
  id: string,
  name: string,
  longDescription: string,
  shortDescription: string,
  defaultLanguage: string,
  slug: string,
  slogan: string,
  logo?: string,
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
        name: params.name,
        longDescription: params.longDescription,
        shortDescription: params.shortDescription,
        defaultLanguage: params.defaultLanguage,
        slug: params.slug,
        slogan: params.slogan,
        logo: params.logo,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
