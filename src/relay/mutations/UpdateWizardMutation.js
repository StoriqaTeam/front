// @flow

import { graphql, commitMutation } from 'react-relay';
import { omit } from 'ramda';
import { Environment } from 'relay-runtime';
import uuidv4 from 'uuid/v4';

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
        countryCode
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
              currency
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

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: uuidv4(),
        ...omit(['environment', 'onCompleted', 'onError'], params),
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
