// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment, ConnectionHandler } from 'relay-runtime';

const mutation = graphql`
  mutation CreateProductWithAttributesWizardMutation(
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
    updater: (relayStore, newProductData) => {
      const me = relayStore.getRoot().getLinkedRecord('me');
      const wizardStore = me.getLinkedRecord('wizardStore');
      const storeProxy = wizardStore.getLinkedRecord('store');
      const baseProducts = wizardStore.getLinkedRecord('baseProducts');
      // const conn = ConnectionHandler.getConnection(
      //   storeProxy,
      //   'Wizard_products',
      // );
      console.log('>>> CreateProductWithAttributesWizardMutation updater: ', {
        me,
        wizardStore,
        storeProxy,
        newProductData,
        baseProducts,
      });
      // const newProduct = relayStore.getRootField('createBaseProduct');
      // const edge = ConnectionHandler.createEdge(
      //   relayStore,
      //   conn,
      //   newProduct,
      //   'BaseProductsEdge',
      // );
      // ConnectionHandler.insertEdgeAfter(conn, edge);
    },
  });

export default { commit };
