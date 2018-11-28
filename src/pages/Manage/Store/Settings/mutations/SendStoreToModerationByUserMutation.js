// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  SendStoreToModerationByUserMutationVariables,
  SendStoreToModerationByUserMutationResponse,
} from './__generated__/SendStoreToModerationByUserMutation.graphql';

const mutation = graphql`
  mutation SendStoreToModerationByUserMutation($id: Int!) {
    sendStoreToModeration(id: $id) {
      id
      status
    }
  }
`;

const sendStoreToModerationByUserMutation: MutationType<
  SendStoreToModerationByUserMutationVariables,
  SendStoreToModerationByUserMutationResponse,
> = basicMutation(mutation, 'sendStoreToModeration');

export default sendStoreToModerationByUserMutation;
