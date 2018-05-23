// @flow

// TODO: rename to UpdateStoreContactsMutation

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateStoreWizardMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      rawId
      defaultLanguage
      name {
        lang
        text
      }
      slug
      shortDescription {
        lang
        text
      }
      addressFull {
        country
        value
        administrativeAreaLevel1
        administrativeAreaLevel2
        locality
        political
        postalCode
        route
        streetNumber
      }
      address
      country
      facebookUrl
      twitterUrl
      instagramUrl
      baseProducts(first: 100) @connection(key: "Wizard_baseProducts") {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

type MutationParamsType = {
  id: string,
  name: string,
  slug: string,
  shortDescription: string,
  defaultLanguage: string,
  country: string,
  address: string,
  administrativeAreaLevel1: string,
  administrativeAreaLevel2: string,
  locality: string,
  political: string,
  postalCode: string,
  route: string,
  streetNumber: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => {
  console.log('!!! UpdateStoreMutation params: ', params);
  return commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        id: params.id,
        defaultLanguage: params.defaultLanguage,
        email: params.email,
        phone: params.phone,
        country: params.country,
        address: params.address,
        administrativeAreaLevel1: params.administrativeAreaLevel1,
        administrativeAreaLevel2: params.administrativeAreaLevel2,
        locality: params.locality,
        political: params.political,
        postalCode: params.postalCode,
        route: params.route,
        streetNumber: params.streetNumber,
        facebookUrl: params.facebookUrl,
        twitterUrl: params.twitterUrl,
        instagramUrl: params.instagramUrl,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    // updater: (relayStore, data) => {
    //   console.log('>>> UpdateStoreWizardMutation updater: ');
    //   const me = relayStore.getRoot().getLinkedRecord('me');
    //   const wizardStore = me.getLinkedRecord('wizardStore');
    //   const storeProxy = wizardStore.getLinkedRecord('store');
    //   const conn = ConnectionHandler.getConnection(
    //     storeProxy,
    //     'Wizard_baseProducts',
    //   );
    //   ConnectionHandler.insertEdgeAfter(conn, );

    //   const responseStore = relayStore.getRootField('updateStore');
    //   // const responseStoreBaseProducts = responseStore.getLinkedRecord(
    //   //   'baseProducts',
    //   // );

    //   // storeProxy.setLinkedRecord(responseStoreBaseProducts, 'baseProducts');
    //   console.log('^^^ UpdateStoreWizardMutation updater: ', {
    //     storeProxy,
    //     responseStore,
    //     data,
    //     // responseStoreBaseProducts,
    //   });
    // },
  });
};

export default { commit };
