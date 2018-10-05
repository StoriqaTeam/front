// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpdateProductMutationVariables,
  UpdateProductMutationResponse,
} from './__generated__/UpdateProductMutation.graphql';

export type {
  UpdateProductMutationVariables as UpdateProductMutationVariablesType,
  UpdateProductMutationResponse as UpdateProductMutationResponseType,
};

const mutation = graphql`
  mutation UpdateProductMutation($input: UpdateProductWithAttributesInput!) {
    updateProduct(input: $input) {
      id
      rawId
      discount
      photoMain
      additionalPhotos
      vendorCode
      cashback
      price
      quantity
      preOrder
      preOrderDays
      baseProduct {
        id
        store {
          id
          warehouses {
            id
          }
        }
      }
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
      customAttributes {
        customAttribute {
          id
          rawId
          attributeId
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
        customAttributeId
        productId
        value
      }
    }
  }
`;

export type MutationParamsType = {
  ...UpdateProductMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateProductMutationResponse,
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
  });

const promise = (
  input: UpdateProductMutationVariables,
  environment: Environment,
): Promise<UpdateProductMutationResponse> =>
  new Promise((resolve, reject) => {
    commit({
      ...input,
      environment,
      onCompleted: (
        response: ?UpdateProductMutationResponse,
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
