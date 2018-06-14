// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpdateProductMutationVariables,
  UpdateProductMutationResponse,
} from './__generated__/UpdateProductMutation.graphql';

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

export default { commit };
