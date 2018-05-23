// @flow

import { graphql, commitMutation } from 'react-relay';
import { omit } from 'ramda';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateWizardMutation($input: UpdateWizardStoreInput!) {
    updateWizardStore(input: $input) {
      id
      rawId
      storeId
      name
      slug
      shortDescription
      defaultLanguage
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
      stepThree {
        edges {
          node {
            id
          }
        }
      }
      store {
        id
        rawId
        baseProducts(first: 100) @connection(key: "Wizard_baseProducts") {
          edges {
            node {
              id
              rawId
              name {
                text
                lang
              }
              shortDescription {
                lang
                text
              }
              category {
                id
                rawId
              }
              storeId
              currencyId
              products(first: 1) @connection(key: "Wizard_products") {
                edges {
                  node {
                    id
                    rawId
                    price
                    discount
                    photoMain
                    additionalPhotos
                    vendorCode
                    cashback
                    price
                    attributes {
                      value
                      metaField
                      attribute {
                        id
                        rawId
                        name {
                          lang
                          text
                        }
                        metaField {
                          values
                          translatedValues {
                            translations {
                              text
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type AddressParamsType = {
  country?: string,
  value?: string,
  administrativeAreaLevel1?: string,
  administrativeAreaLevel2?: string,
  locality?: string,
  political?: string,
  postalCode?: string,
  route?: string,
  streetNumber?: string,
};

type MutationParamsType = {
  storeId?: number,
  name?: number,
  slug?: string,
  shortDescription?: number,
  defaultLanguage?: string,
  addressFull?: AddressParamsType,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => {
  console.log('!!! UpdateWizardMutation params: ', params);
  return commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        ...omit(['environment', 'onCompleted', 'onError'], params),
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: (relayStore, data) => {
      // debugger;
      // console.log('>>> updateWizardMutations data: ', {data})
      // if (data.storeId) {
      //   const me = relayStore.getRoot().getLinkedRecord('me');
      //   const wizardStore = me.getLinkedRecord('wizardStore');
      //   // const storeProxy = wizardStore.getLinkedRecord('store');
      //   // const conn = ConnectionHandler.getConnection(
      //   //   storeProxy,
      //   //   'Wizard_baseProducts',
      //   // );
      //   const newWizard = relayStore.getRootField('updateWizardStore');
      //   const newStore = newWizard.getLinkedRecord('store');
      //   wizardStore.setLinkedRecord(newStore, 'store');
      //   // const edge = ConnectionHandler.createEdge(
      //   //   relayStore,
      //   //   conn,
      //   //   newProduct,
      //   //   'BaseProductsEdge',
      //   // );
      //   // ConnectionHandler.insertEdgeAfter(conn, edge);
      // }
    },
  });
};

export default { commit };
