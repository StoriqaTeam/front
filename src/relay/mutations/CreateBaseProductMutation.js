// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation CreateBaseProductMutation($input: CreateBaseProductInput!) {
    createBaseProduct(input: $input) {
      id
      rawId
      name {
        lang
        text
      }
      isActive
      shortDescription {
        lang
        text
      }
      longDescription {
        lang
        text
      }
      currencyId
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
`;

type MutationParamsType = {
  name: Array<{ lang: string, text: string }>,
  storeId: number,
  shortDescription: Array<{ lang: string, text: string }>,
  longDescription: Array<{ lang: string, text: string }>,
  seoTitle: Array<{ lang: string, text: string }>,
  seoDescription: Array<{ lang: string, text: string }>,
  currencyId: number,
  categoryId: number,
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
        name: params.name,
        storeId: params.storeId,
        shortDescription: params.shortDescription,
        longDescription: params.longDescription,
        seoTitle: params.seoTitle,
        seoDescription: params.seoDescription,
        currencyId: params.currencyId,
        categoryId: params.categoryId,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    // updater for add new base product to baseProducts connection
    updater: (relayStore, newData) => {
      console.log('>>> CreateBaseProductMutation updater params: ', {
        params,
        newData,
      });
      // const me = relayStore.getRoot().getLinkedRecord('me');
      // const wizardStore = me.getLinkedRecord('wizardStore');
      if (!params || !params.parentID) {
        return;
      }
      const storeProxy = relayStore.get(params.parentID);
      const conn = ConnectionHandler.getConnection(
        storeProxy,
        'Wizard_baseProducts',
      );
      const newProduct = relayStore.getRootField('createBaseProduct');
      const edge = ConnectionHandler.createEdge(
        relayStore,
        conn,
        newProduct,
        'BaseProductsEdge',
      );
      ConnectionHandler.insertEdgeAfter(conn, edge);
    },
  });

export default { commit };
