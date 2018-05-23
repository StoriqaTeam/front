// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';

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
    }
  }
`;

type MutationParamsType = {
  product: {
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
  updater: ?(proxyStore: any) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        product: params.product,
        attributes: params.attributes,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: (relayStore, newData) => {
      console.log('>>> CreateBaseProductMutation updater params: ', {
        params,
        newData,
      });
      // const me = relayStore.getRoot().getLinkedRecord('me');
      // const wizardStore = me.getLinkedRecord('wizardStore');
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
      ConnectionHandler.insertEdgeAfter(conn, edge);
    },
  });

export default { commit };

/* {
  "input": {
    "clientMutationId": "",
    "product": {
      "baseProductId": 1,
      "discount": 12,
      "photoMain": "https://s3.amazonaws.com/storiqa-dev/img-QFoCm1LVrzkC.png",
      "additionalPhotos": ["https://s3.amazonaws.com/storiqa-dev/img-QFoCm1LVrzkC.png","https://s3.amazonaws.com/storiqa-dev/img-QFoCm1LVrzkC.png"],
      "vendorCode": "1q11q1q-1q1q1",
      "cashback": 22,
      "price": 123123123
    },
    "attributes": [
      { "attrId": 1, "value": "44", "metaField": "https://s3.amazonaws.com/storiqa-dev/img-QFoCm1LVrzkC.png" },
      { "attrId": 1, "value": "52", "metaField": "https://s3.amazonaws.com/storiqa-dev/img-QFoCm1LVrzkC.png" }
    ]
  }
} */
