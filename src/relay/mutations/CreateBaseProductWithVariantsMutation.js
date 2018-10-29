// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

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
    }
  }
`;

export type MutationParamsType = {
  ...CreateBaseProductWithVariantsMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateBaseProductWithVariantsMutationResponse,
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
