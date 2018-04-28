// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

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
    }
  }
`;

type MutationParamsType = {
  id: number,
  product: {
    baseProductId: number,
    price: number,
    vendorCode: string,
    photoMain?: string,
    additionalPhotos?: Array<string>,
    cashback: number,
    discount: number,
  },
  attributes: Array<{ attrId: number, value: string, metaField?: string }>,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        id: params.id,
        product: params.product,
        attributes: params.attributes,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
