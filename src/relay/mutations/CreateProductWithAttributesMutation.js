// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';
import { log } from 'utils';

import type {
  CreateProductWithAttributesMutationVariables,
  CreateProductWithAttributesMutationResponse,
} from './__generated__/CreateProductWithAttributesMutation.graphql';

const mutation = graphql`
  mutation CreateProductWithAttributesMutation(
    $input: CreateProductWithAttributesInput!
  ) {
    createProduct(input: $input) {
      id
      rawId
      baseProduct {
        store {
          warehouses {
            id
          }
        }
      }
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
      discount
      photoMain
      additionalPhotos
      vendorCode
      cashback
      price
      preOrder
      preOrderDays
      attributes {
        attrId
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
`;

export type MutationParamsType = {
  ...CreateProductWithAttributesMutationVariables,
  parentID: string,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateProductWithAttributesMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: (relayStore, newData) => {
      log.info('>>> CreateBaseProductMutation updater params: ', {
        params,
        newData,
      });
      if (!params || !params.parentID) {
        return;
      }
      const baseProductProxy = relayStore.get(params.parentID);
      const conn = ConnectionHandler.getConnection(
        baseProductProxy,
        'Wizard_products',
      );
      const newProduct = relayStore.getRootField('createProduct');
      const edge = ConnectionHandler.createEdge(
        relayStore,
        conn,
        newProduct,
        'ProductsEdge',
      );
      ConnectionHandler.insertEdgeBefore(conn, edge);
    },
  });

const promise = (
  input: {
    ...CreateProductWithAttributesMutationVariables,
    parentID: string,
  },
  environment: Environment,
): Promise<CreateProductWithAttributesMutationResponse> =>
  new Promise((resolve, reject) => {
    commit({
      ...input,
      environment,
      onCompleted: (
        response: ?CreateProductWithAttributesMutationResponse,
        errors: ?Array<Error>,
      ) => {
        log.debug('CreateProductWithAttributesMutation', { response, errors });
        if (errors) {
          reject(errors);
        } else if (response) {
          resolve(response);
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
  CreateProductWithAttributesMutationResponse as CreateProductWithAttributesMutationResponseType,
};

export default { commit, promise };
