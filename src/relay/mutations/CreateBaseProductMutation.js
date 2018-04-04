// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateBaseProductMutation($input: CreateBaseProductInput!) {
    createBaseProduct(input: $input) {
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
      currencyId
      categoryId
    }
  }
`;

type MutationParamsType = {
  name: Array<{ lang: string, text: string }>,
  storeId: number,
  shortDescription: Array<{ lang: string, text: string }>,
  longDescription: Array<{ lang: string, text: string }>,
  seoTitle: Array<{ lang: string, text: string }>,
  seoDescription: Array<{ lang: string, text: string }>,
  currencyId: number,
  categoryId: number,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: {
      clientMutationId: '',
      name: params.name,
      storeId: params.storeId,
      shortDescription: params.shortDescription,
      longDescription: params.longDescription,
      seoTitle: params.seoTitle,
      seoDescription: params.seoDescription,
      currencyId: params.currencyId,
      categoryId: params.categoryId,
    },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };
