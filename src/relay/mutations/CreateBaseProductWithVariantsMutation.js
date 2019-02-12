// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  CreateBaseProductWithVariantsMutationVariables,
  CreateBaseProductWithVariantsMutationResponse,
} from './__generated__/CreateBaseProductWithVariantsMutation.graphql';

export type MutationResponseType = CreateBaseProductWithVariantsMutationResponse;

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
            customerPrice {
              price
              currency
            }
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
      lengthCm
      widthCm
      heightCm
      weightG
    }
  }
`;

const createBaseProductWithVariantsMutation: MutationType<
  CreateBaseProductWithVariantsMutationVariables,
  CreateBaseProductWithVariantsMutationResponse,
> = basicMutation(mutation, 'createBaseProductWithVariants');

export default createBaseProductWithVariantsMutation;
