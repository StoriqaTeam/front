// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  DraftStoreFromUserMutationVariables,
  DraftStoreFromUserMutationResponse,
} from './__generated__/DraftStoreFromUserMutation.graphql';

const mutation = graphql`
  mutation DraftStoreFromUserMutation($id: Int!) {
    draftStore(id: $id) {
      id
      rawId
      status
    }
  }
`;

const draftStoreFromUserMutation: MutationType<
  DraftStoreFromUserMutationVariables,
  DraftStoreFromUserMutationResponse,
> = basicMutation(mutation, 'draftStore');

export default draftStoreFromUserMutation;
