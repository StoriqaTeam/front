// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpdateUserMutationVariables,
  UpdateUserMutationResponse,
} from './__generated__/UpdateUserMutation.graphql';

const mutation = graphql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      phone
      firstName
      lastName
      middleName
      birthdate
      gender
      isActive
      avatar
    }
  }
`;

export type MutationParamsType = {
  ...UpdateUserMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpdateUserMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: relayStore => {
      const updateUser = relayStore.getRootField('updateUser');
      const avatar = updateUser.getValue('avatar');
      const me = relayStore.getRoot().getLinkedRecord('me');
      me.setValue(avatar, 'avatar');
    },
  });

export default { commit };

/*
<example of response here>
*/
