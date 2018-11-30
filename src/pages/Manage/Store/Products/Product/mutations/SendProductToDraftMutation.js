// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  SendProductToDraftMutationVariables as V,
  SendProductToDraftMutationResponse as R,
} from './__generated__/SendProductToDraftMutation.graphql';

const mutation = graphql`
  mutation SendProductToDraftMutation($ids: [Int!]!) {
    draftBaseProducts(ids: $ids) {
      id
      status
    }
  }
`;

const sendProductToDraftMutation: MutationType<V, R> = basicMutation(
  mutation,
  'draftBaseProducts',
);

export default sendProductToDraftMutation;
