// @flow strict

import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  SendProductToModerationMutationVariables,
  SendProductToModerationMutationResponse,
} from './__generated__/SendProductToModerationMutation.graphql';

const mutation = graphql`
  mutation SendProductToModerationMutation($id: Int!) {
    sendBaseProductToModeration(id: $id) {
      id
      rawId
      status
    }
  }
`;

const sendProductToModerationMutation: MutationType<
  SendProductToModerationMutationVariables,
  SendProductToModerationMutationResponse,
> = basicMutation(mutation, 'sendBaseProductToModeration');

export default sendProductToModerationMutation;
