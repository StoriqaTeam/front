// @flow

import { graphql, commitMutation } from 'react-relay';
import { ConnectionHandler, Environment } from 'relay-runtime';

import type {
  CreateBaseProductWithVariantsMutationVariables,
  CreateBaseProductWithVariantsMutationResponse,
} from './__generated__/CreateBaseProductWithVariantsMutation.graphql';

const mutation = graphql`
  mutation CreateBaseProductWithVariantsMutation(
    $input: NewBaseProductWithVariantsInput!
  ) {
    createBaseProductWithVariants(input: $input) {
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
                  countryCode
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
      store(visibility: "active") {
        id
        warehouses {
          id
        }
      }
    }
  }
`;

export type MutationParamsType = {
  ...CreateBaseProductWithVariantsMutationVariables,
  parentID?: string,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateBaseProductWithVariantsMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

type CurrencyType =
  | 'BTC'
  | 'ETH'
  | 'EUR'
  | 'RUB'
  | 'STQ'
  | 'USD'
  | '%future added value';
type LanguageType =
  | 'CH'
  | 'DE'
  | 'EN'
  | 'ES'
  | 'FR'
  | 'JA'
  | 'KO'
  | 'PO'
  | 'RU'
  | '%future added value';

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      if (params.parentID) {
        const storeProxy = relayStore.get(params.parentID);
        const conn = ConnectionHandler.getConnection(
          storeProxy,
          'Wizard_baseProducts',
        );
        const newProduct = relayStore.getRootField(
          'createBaseProductWithVariants',
        );
        const edge = ConnectionHandler.createEdge(
          relayStore,
          conn,
          newProduct,
          'BaseProductsEdge',
        );
        ConnectionHandler.insertEdgeAfter(conn, edge);
      }
    },
  });

const promise = (
  input: {
    clientMutationId: string,
    name: $ReadOnlyArray<{ lang: LanguageType, text: string }>,
    storeId: number,
    shortDescription: $ReadOnlyArray<{ lang: LanguageType, text: string }>,
    longDescription?: ?$ReadOnlyArray<{ lang: LanguageType, text: string }>,
    seoTitle?: ?$ReadOnlyArray<{ lang: LanguageType, text: string }>,
    seoDescription?: ?$ReadOnlyArray<{ lang: LanguageType, text: string }>,
    currency: CurrencyType,
    categoryId: number,
    slug?: ?string,
    selectedAttributes: $ReadOnlyArray<number>,
    variants: $ReadOnlyArray<{
      clientMutationId: string,
      product: {
        baseProductId?: ?number,
        price: number,
        vendorCode: string,
        photoMain: ?string,
        additionalPhotos?: ?$ReadOnlyArray<string>,
        cashback?: ?number,
        discount?: ?number,
        preOrder?: ?boolean,
        preOrderDays?: ?number,
      },
      attributes: $ReadOnlyArray<{
        value: string,
        attrId: number,
        metaField?: ?string,
      }>,
    }>,
  },
  parentID?: string,
  environment: Environment,
): Promise<CreateBaseProductWithVariantsMutationResponse> =>
  new Promise((resolve, reject) => {
    commit({
      input,
      environment,
      parentID,
      onCompleted: (
        response: ?CreateBaseProductWithVariantsMutationResponse,
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

export default { commit, promise };
