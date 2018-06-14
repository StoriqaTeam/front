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
      discount
      photoMain
      additionalPhotos
      vendorCode
      cashback
      price
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

export default { commit };
