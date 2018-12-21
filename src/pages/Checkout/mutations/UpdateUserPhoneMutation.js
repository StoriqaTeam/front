import { graphql } from 'react-relay';
import { basicMutation } from 'relay/mutations/basicMutation';
import type { MutationType } from 'relay/mutations/basicMutation/basicMutation';

import type {
  UpdateUserPhoneMutationVariables as V,
  UpdateUserPhoneMutationResponse as R,
} from './__generated__/UpdateUserPhoneMutation.graphql';

const mutation = graphql`
  mutation UpdateUserPhoneMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      phone
    }
  }
`;

const updateUserPhoneMutation: MutationType<V, R> = basicMutation(
  mutation,
  'updateUser',
);

export default updateUserPhoneMutation;
