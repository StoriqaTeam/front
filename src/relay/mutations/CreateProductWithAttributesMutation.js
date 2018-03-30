// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateProductWithAttributesMutation($input:CreateProductWithAttributesInput!) {
    createProduct(input: $input) {
      id
      rawId
      discount
      vendorCode
      cashback
    }
}
`;

type MutationParamsType = {
  baseProductId: number,
  price: number,
  vendorCode: string,
  cashback: number,
  // discount: number,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: {
      clientMutationId: '',
      product: {
        price: params.price,
        baseProductId: params.baseProductId,
        vendorCode: params.vendorCode,
        cashback: params.cashback,
        // discount: params.discount,
      },
      attributes: [],
    },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
