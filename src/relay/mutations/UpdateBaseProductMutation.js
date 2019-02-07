// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import uuidv4 from 'uuid/v4';

import type { UpdateBaseProductMutationResponse as UpdateBaseProductMutationResponseType } from './__generated__/UpdateBaseProductMutation.graphql';

const mutation = graphql`
  mutation UpdateBaseProductMutation($input: UpdateBaseProductInput!) {
    updateBaseProduct(input: $input) {
      id
      rawId
      category {
        rawId
      }
      store {
        id
        rawId
      }
      name {
        lang
        text
      }
      shortDescription {
        lang
        text
      }
      longDescription {
        lang
        text
      }
      seoTitle {
        lang
        text
      }
      seoDescription {
        lang
        text
      }
      storeId
      currency
      status
      products(first: null) @connection(key: "Wizard_products") {
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
      lengthCm
      widthCm
      heightCm
      weightG
    }
  }
`;

export type UpdateBaseProductMutationVariablesType = {
  id: number,
  name: Array<{ lang: string, text: string }>,
  shortDescription: Array<{ lang: string, text: string }>,
  longDescription: Array<{ lang: string, text: string }>,
  seoTitle: Array<{ lang: string, text: string }>,
  seoDescription: Array<{ lang: string, text: string }>,
  currency: string,
  categoryId: number,
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  weightG: number,
};

export type { UpdateBaseProductMutationResponseType };

type MutationParamsType = {
  ...UpdateBaseProductMutationVariablesType,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateBaseProductMutationResponseType,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: uuidv4(),
        id: params.id,
        name: params.name,
        shortDescription: params.shortDescription,
        longDescription: params.longDescription,
        seoTitle: params.seoTitle,
        seoDescription: params.seoDescription,
        currency: params.currency,
        categoryId: params.categoryId,
        lengthCm: params.lengthCm,
        widthCm: params.widthCm,
        heightCm: params.heightCm,
        weightG: params.weightG,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

const promise = (
  input: UpdateBaseProductMutationVariablesType,
  environment: Environment,
): Promise<UpdateBaseProductMutationResponseType> =>
  new Promise((resolve, reject) => {
    commit({
      ...input,
      environment,
      onCompleted: (
        response: ?UpdateBaseProductMutationResponseType,
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
