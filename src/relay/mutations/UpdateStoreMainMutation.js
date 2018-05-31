// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import { log } from 'utils';

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
      logo
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

const commit = (params: MutationParamsType) => {
  log.info('!!! UpdateStoreMainMutation params: ', params);
  return commitMutation(params.environment, {
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
    updater: relayStore => {
      const updateStore = relayStore.getRootField('updateStore');
      const logo = updateStore.getValue('logo');
      const storeId = updateStore.getValue('id');
      const store = relayStore.get(storeId);
      store.setValue(logo, 'logo');
    },
  });
};

export default { commit };
