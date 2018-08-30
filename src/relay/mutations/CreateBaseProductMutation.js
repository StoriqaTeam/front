// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';

import type {
  CreateBaseProductMutationVariables as CreateBaseProductMutationVariablesType,
  CreateBaseProductMutationResponse as CreateBaseProductMutationResponseType,
} from './__generated__/CreateBaseProductMutation.graphql';

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
      currency
      category {
        id
        rawId
      }
      storeId
      currency
      products(first: 1) @connection(key: "Wizard_products") {
        edges {
          node {
            stocks {
              id
              productId
              warehouseId
              warehouse {
                name
                addressFull {
                  country
                  administrativeAreaLevel1
                  administrativeAreaLevel2
                  political
                  postalCode
                  streetNumber
                  value
                  route
                  locality
                }
              }
              quantity
            }
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
  currency: string,
  categoryId: number,
  parentID: string,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateBaseProductMutationResponseType,
    errors: ?Array<Error>,
  ) => void,
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
        currency: params.currency,
        categoryId: params.categoryId,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    // updater for add new base product to baseProducts connection
    updater: relayStore => {
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

const promise = (
  input: {
    name: Array<{ lang: string, text: string }>,
    storeId: number,
    shortDescription: Array<{ lang: string, text: string }>,
    longDescription: Array<{ lang: string, text: string }>,
    seoTitle: Array<{ lang: string, text: string }>,
    seoDescription: Array<{ lang: string, text: string }>,
    currency: string,
    categoryId: number,
    parentID: string,
  },
  environment: Environment,
): Promise<CreateBaseProductMutationResponseType> =>
  new Promise((resolve, reject) => {
    commit({
      ...input,
      environment,
      onCompleted: (
        response: ?CreateBaseProductMutationResponseType,
        errors: ?Array<Error>,
      ) => {
        if (response) {
          resolve(response);
        } else if (errors) {
          reject(errors);
        } else {
          // eslint-disable-next-line
          reject([new Error('Unknown error')]);
        }
      },
      onError: (error: Error) => {
        // eslint-disable-next-line
        reject([error]);
      },
    });
  });

export type {
  CreateBaseProductMutationVariablesType,
  CreateBaseProductMutationResponseType,
  MutationParamsType as CreateBaseProductMutationParamsType,
};

export default { commit, promise };
