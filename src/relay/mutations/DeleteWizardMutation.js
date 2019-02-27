// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation DeleteWizardMutation {
    deleteWizardStore {
      id
      store {
        id
        rawId
      }
      completed
    }
  }
`;

type MutationParamsType = {
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
